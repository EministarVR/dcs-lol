const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
axios.defaults.timeout = 7000;
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");
const mysql = require("mysql2/promise");
require("dotenv").config({path: path.join(__dirname, "..", ".env")});
const {router: showcaseRouter, UPLOADS_DIR} = require("./showcaseRouter.cjs");
const app = express();
const PORT = process.env.PORT || 49623;
const WEBHOOK_PATH = path.join(__dirname, "webhooks.json");

// MySQL Verbindungspool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "dcs",
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONN_LIMIT) || 10,
    queueLimit: 0,
});

console.log("DB-CONFIG", {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    db: process.env.MYSQL_DATABASE,
    pwSet: !!process.env.MYSQL_PASSWORD,
});


const LEGACY_DB_FILE = path.join(__dirname, "links.json");

async function ensureSchema() {
    const createSql = `
        CREATE TABLE IF NOT EXISTS links
        (
            id
            BIGINT
            AUTO_INCREMENT
            PRIMARY
            KEY,
            custom_id
            VARCHAR
        (
            64
        ) NOT NULL UNIQUE,
            original_url VARCHAR
        (
            2048
        ) NOT NULL,
            clicks BIGINT NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.query(createSql);

    // Optional: Import aus alter JSON-Datei, falls Tabelle leer
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS cnt FROM links");
        const count = rows && rows[0] ? rows[0].cnt : 0;
        if (count === 0 && fs.existsSync(LEGACY_DB_FILE)) {
            const json = JSON.parse(fs.readFileSync(LEGACY_DB_FILE, "utf8"));
            if (Array.isArray(json) && json.length > 0) {
                const values = json.map((l) => [
                    l.customId,
                    l.originalUrl,
                    Number(l.clicks || 0),
                    new Date(l.createdAt || Date.now()),
                ]);
                // Bulk insert
                await pool.query(
                    "INSERT INTO links (custom_id, original_url, clicks, created_at) VALUES ?",
                    [values]
                );
                if (process.env.NODE_ENV !== "production") {
                    console.log(`Imported ${values.length} legacy links from JSON.`);
                }
            }
        }
    } catch (e) {
        console.warn("Legacy import skipped:", e?.message || e);
    }
}

ensureSchema().catch((e) => {
    console.error("DB init error:", e);
});

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({
    crossOriginResourcePolicy: {policy: "cross-origin"},
}));
app.use(compression());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({limit: "1mb"}));

// Serve static files (prefer built assets from /dist in production)
const DIST_DIR = path.join(__dirname, "..", "dist");
const PUBLIC_DIR = fs.existsSync(DIST_DIR) ? DIST_DIR : path.join(__dirname, "..");
app.use("/uploads", express.static(UPLOADS_DIR));
// Backward-compat: old entries stored logoUrl starting with /backend/uploads
app.use("/backend/uploads", express.static(UPLOADS_DIR));
app.use(express.static(PUBLIC_DIR));

// Basic rate limit for all API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", apiLimiter);
app.use("/api", showcaseRouter);

// Strengeres Rate-Limit für kritische Endpunkte
const tightLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
});

// Healthcheck
app.get("/health", (req, res) => res.json({status: "ok"}));

// Klick-Tracking (Client-seitig ausgelöst)
app.post("/api/click/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const [result] = await pool.query("UPDATE links SET clicks = clicks + 1 WHERE custom_id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({error: "Nicht gefunden"});
        // Webhook best-effort
        try {
            sendWebhookEvent('link.clicked', {id, at: new Date().toISOString()});
        } catch (e) {
        }
        res.json({ok: true});
    } catch (e) {
        res.status(500).json({error: "Serverfehler"});
    }
});

// Hilfsfunktionen
function getBaseUrl(req) {
    const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
    const host = req.get("host");
    return `${proto}://${host}`;
}

// POST: Link kürzen
app.post("/api/shorten", tightLimiter, async (req, res) => {
    try {
        let {originalUrl, customId} = req.body || {};

        // Normalize Discord invite URLs
        if (typeof originalUrl === "string") {
            originalUrl = originalUrl.trim();
            originalUrl = originalUrl.replace(/^http:\/\//, "https://");
            originalUrl = originalUrl.replace(
                /^https:\/\/discord\.com\/invite\//,
                "https://discord.gg/"
            );
        }

        const isValid =
            typeof originalUrl === "string" &&
            (/^https:\/\/discord\.gg\/[a-zA-Z0-9]+$/.test(originalUrl) ||
                /^https:\/\/discord\.com\/invite\/[a-zA-Z0-9]+$/.test(originalUrl));

        if (!isValid) {
            return res.status(400).json({error: "Ungültiger Discord-Link"});
        }

        if (!customId || !/^[a-zA-Z0-9_-]{3,32}$/.test(customId)) {
            return res.status(400).json({error: "Ungültige ID"});
        }

        // Conflict check
        const [rows] = await pool.query("SELECT 1 FROM links WHERE custom_id = ? LIMIT 1", [customId]);
        if (Array.isArray(rows) && rows.length > 0) {
            return res.status(409).json({error: "Diese ID existiert bereits"});
        }

        // Insert
        await pool.query(
            "INSERT INTO links (custom_id, original_url, clicks) VALUES (?, ?, 0)",
            [customId, originalUrl]
        );

        const base = getBaseUrl(req);
        // Fire webhook (non-blocking)
        try {
            sendWebhookEvent('link.created', {
                id: customId,
                originalUrl,
                shortUrl: `${base}/${customId}`,
                clicks: 0,
                createdAt: new Date().toISOString(),
            });
        } catch (e) {
        }

        res.json({short: `${base}/${customId}`});
    } catch (e) {
        console.error("shorten error:", e);
        res.status(500).json({error: "Serverfehler"});
    }
});

app.get("/api/info/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query(
            "SELECT custom_id, original_url FROM links WHERE custom_id = ? LIMIT 1",
            [id]
        );
        const link = Array.isArray(rows) && rows[0];
        if (!link) return res.status(404).json({error: "Nicht gefunden"});

        // Invite-Code aus dem Discord-Link extrahieren (unterstützt discord.gg und discord.com/invite)
        const inviteMatch = link.original_url.match(/(?:discord\.gg\/|discord\.com\/invite\/)([A-Za-z0-9-_]+)/);
        const inviteCode = inviteMatch ? inviteMatch[1] : null;

        if (!inviteCode) {
            return res.status(400).json({ error: "Kein gültiger Invite-Code" });
        }

        const response = await axios.get(
            `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=true`
        );
        const data = response.data || {};

        const guild = data.guild || {};
        const serverName = guild.name || "Unbekannter Server";
        let serverIcon = "https://cdn-icons-png.flaticon.com/512/5968/5968756.png"; // fallback
        if (guild.icon && guild.id) {
            const ext = String(guild.icon).startsWith("a_") ? "gif" : "png";
            serverIcon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=128`;
        }

        res.json({
            name: serverName,
            icon: serverIcon,
            inviteCode: link.custom_id,
            originalUrl: link.original_url,
        });
    } catch (err) {
        console.error("/api/info error:", err?.message || err);
        return res.status(500).json({error: "Discord-Daten konnten nicht geladen werden"});
    }
});



function loadWebhooks() {
    if (!fs.existsSync(WEBHOOK_PATH)) return [];
    return JSON.parse(fs.readFileSync(WEBHOOK_PATH));
}

function saveWebhooks(webhooks) {
    fs.writeFileSync(WEBHOOK_PATH, JSON.stringify(webhooks, null, 2));
}

// Send webhooks (fire-and-forget) for events like link.created / link.clicked
function sendWebhookEvent(type, payload) {
    try {
        const webhooks = loadWebhooks();
        if (!Array.isArray(webhooks) || webhooks.length === 0) return;
        const body = {type, timestamp: new Date().toISOString(), payload};
        webhooks.forEach(async (hook) => {
            try {
                if (!hook || !hook.url) return;
                await axios.post(hook.url, body, {headers: {'Content-Type': 'application/json'}});
                // Update counters best-effort
                hook.totalCalls = (hook.totalCalls || 0) + 1;
                hook.lastTriggered = new Date().toISOString();
                saveWebhooks(webhooks);
            } catch (e) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn('Webhook send failed:', e?.message || e);
                }
            }
        });
    } catch (e) {
        // ignore
    }
}

app.get("/api/webhooks", (req, res) => {
    res.json(loadWebhooks());
});

// Add webhook
app.post("/api/webhooks", tightLimiter, (req, res) => {
    const webhooks = loadWebhooks();
    const newHook = {...req.body, id: Date.now().toString(), totalCalls: 0};
    webhooks.push(newHook);
    saveWebhooks(webhooks);
    res.json(newHook);
});

// Update webhook
app.put("/api/webhooks/:id", (req, res) => {
    let webhooks = loadWebhooks();
    webhooks = webhooks.map((w) =>
        w.id === req.params.id ? {...w, ...req.body} : w
    );
    saveWebhooks(webhooks);
    res.sendStatus(200);
});

// Delete webhook
app.delete("/api/webhooks/:id", (req, res) => {
    let webhooks = loadWebhooks();
    webhooks = webhooks.filter((w) => w.id !== req.params.id);
    saveWebhooks(webhooks);
    res.sendStatus(200);
});

// Test webhook
app.post("/api/webhooks/:id/test", tightLimiter, async (req, res) => {
    const webhooks = loadWebhooks();
    const hook = webhooks.find((w) => w.id === req.params.id);
    if (!hook) return res.status(404).json({error: "Webhook nicht gefunden"});

    try {
        const result = await axios.post(hook.url, {
            content: `🔔 Testnachricht vom Webhook "${hook.name}"`,
        });

        hook.totalCalls += 1;
        hook.lastTriggered = new Date().toISOString();
        saveWebhooks(webhooks);
        res.json({success: true, status: result.status});
    } catch (e) {
        res.status(500).json({error: "Fehler beim Senden des Webhooks"});
    }
});

// GET: Aktuelle Links für Frontend
app.get("/api/recents", async (req, res) => {
    try {
        const base = getBaseUrl(req);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 9));
        const [rows] = await pool.query(
            "SELECT custom_id, original_url, clicks, created_at FROM links ORDER BY created_at DESC LIMIT ?",
            [limit]
        );
        const recentLinks = (rows || []).map((link) => ({
            id: link.custom_id,
            originalUrl: link.original_url,
            shortUrl: `${base}/${link.custom_id}`,
            clicks: Number(link.clicks || 0),
            createdAt: new Date(link.created_at).toISOString(),
        }));
        res.json(recentLinks);
    } catch (e) {
        console.error("/api/recents error:", e?.message || e);
        res.status(500).json([]);
    }
});

// GET: Liste aller Links (paginierte API)
app.get('/api/links', async (req, res) => {
    try {
        const base = getBaseUrl(req);
        const all = String(req.query.all || '').toLowerCase() === 'true';
        const page = all ? 1 : Math.max(1, parseInt(req.query.page) || 1);
        const limit = all ? 100000 : Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const q = (req.query.q || '').toString();
        const sortByParam = (req.query.sortBy || 'createdAt').toString();
        const orderParam = (req.query.order || 'desc').toString();

        const sortMap = {clicks: 'clicks', id: 'custom_id', createdAt: 'created_at'};
        const sortBy = sortMap[sortByParam] || 'created_at';
        const order = orderParam.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        const where = q ? "WHERE custom_id LIKE ? OR original_url LIKE ?" : "";
        const params = q ? [`%${q}%`, `%${q}%`] : [];

        // total count
        const [countRows] = await pool.query(`SELECT COUNT(*) AS cnt
                                              FROM links ${where}`, params);
        const total = (countRows && countRows[0] && countRows[0].cnt) || 0;

        // data
        let rows;
        if (all) {
            [rows] = await pool.query(
                `SELECT custom_id, original_url, clicks, created_at
                 FROM links ${where}
                 ORDER BY ${sortBy} ${order}`,
                params
            );
        } else {
            const offset = (page - 1) * limit;
            [rows] = await pool.query(
                `SELECT custom_id, original_url, clicks, created_at
                 FROM links ${where}
                 ORDER BY ${sortBy} ${order} LIMIT ?
                 OFFSET ?`,
                [...params, limit, offset]
            );
        }

        const items = (rows || []).map((l) => ({
            id: l.custom_id,
            originalUrl: l.original_url,
            shortUrl: `${base}/${l.custom_id}`,
            clicks: Number(l.clicks || 0),
            createdAt: new Date(l.created_at).toISOString(),
        }));

        const totalPages = all ? 1 : Math.ceil(total / limit);
        const respLimit = all ? items.length : limit;
        res.json({items, page, limit: respLimit, total, totalPages});
    } catch (e) {
        console.error('/api/links error:', e?.message || e);
        res.status(500).json({items: [], page: 1, limit: 20, total: 0, totalPages: 0});
    }
});

// Hilfsfunktion für Zeitangabe
function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes < 1) return "gerade eben";
    if (minutes === 1) return "vor 1 Min";
    return `vor ${minutes} Min`;
}

// SPA Fallback for React Router (must be after all API routes)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return res.status(404).end();
  }
  // Serve index.html from built dist if present, otherwise project root
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend läuft auf http://0.0.0.0:${PORT}`);
});
