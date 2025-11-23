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
const { router: showcaseRouter, UPLOADS_DIR } = require("./showcaseRouter.cjs");
const app = express();
const PORT = process.env.PORT || 49623;
const DB_FILE = path.join(__dirname, "links.json");
const WEBHOOK_PATH = path.join(__dirname, "webhooks.json");

// Initialisiere Datenbank falls nicht vorhanden
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

let db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(compression());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));

// Serve static files (prefer built assets from /dist in production)
const DIST_DIR = path.join(__dirname, "..", "dist");
const PUBLIC_DIR = fs.existsSync(DIST_DIR) ? DIST_DIR : path.join(__dirname, "..");
app.use("/uploads", express.static(UPLOADS_DIR));
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
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Hilfsfunktionen
function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.get("host");
  return `${proto}://${host}`;
}

// POST: Link kürzen
app.post("/api/shorten", tightLimiter, (req, res) => {
  let { originalUrl, customId } = req.body;

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
    return res.status(400).json({ error: "Ungültiger Discord-Link" });
  }

  if (!customId || !/^[a-zA-Z0-9_-]{3,32}$/.test(customId)) {
    return res.status(400).json({ error: "Ungültige ID" });
  }

  if (db.find((link) => link.customId === customId)) {
    return res.status(409).json({ error: "Diese ID existiert bereits" });
  }

  const newLink = {
    originalUrl,
    customId,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };

  db.push(newLink);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

  const base = getBaseUrl(req);
  // Fire webhook (non-blocking)
  try {
    sendWebhookEvent('link.created', {
      id: customId,
      originalUrl,
      shortUrl: `${base}/${customId}`,
      clicks: 0,
      createdAt: newLink.createdAt,
    });
  } catch (e) {}
  res.json({ short: `${base}/${customId}` });
});

app.get("/api/info/:id", async (req, res) => {
  const link = db.find((l) => l.customId === req.params.id);

  if (!link) {
    return res.status(404).json({ error: "Nicht gefunden" });
  }

  // Invite-Code aus dem Discord-Link extrahieren
  const inviteMatch = link.originalUrl.match(/discord\.gg\/([a-zA-Z0-9]+)/);
  const inviteCode = inviteMatch ? inviteMatch[1] : null;

  if (!inviteCode) {
    return res.status(400).json({ error: "Kein gültiger Invite-Code" });
  }

  try {
    const response = await axios.get(
      `https://discord.com/api/v9/invites/${inviteCode}?with_counts=true&with_expiration=true`
    );
    const data = response.data;

    const serverName = data.guild?.name || "Unbekannter Server";
    const serverIcon = data.guild?.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`
      : "https://cdn-icons-png.flaticon.com/512/5968/5968756.png"; // fallback

    res.json({
      name: serverName,
      icon: serverIcon,
      inviteCode: link.customId,
      originalUrl: link.originalUrl,
    });
  } catch (err) {
    console.error("Fehler beim Abrufen der Discord-Daten:", err.message);
    return res
      .status(500)
      .json({ error: "Discord-Daten konnten nicht geladen werden" });
  }
});

// Server-seitige Weiterleitung: 302 auf den Original-Discord-Link
// Nur gültige Kurz-IDs abfangen; reservierte Pfade an SPA/Handler weitergeben
app.get('/:id([A-Za-z0-9_-]{3,32})', (req, res, next) => {
  const candidate = (req.params.id || '').toLowerCase();
  const reserved = new Set(['api','health','uploads','assets','links','redirect','dashboard','favicon.ico','robots.txt','sitemap.xml']);
  if (reserved.has(candidate)) return next();

  const link = db.find((l) => l.customId === req.params.id);
  if (!link) return next(); // SPA-Fallback greifen lassen
  // Klicks zählen (Best-Effort)
  try {
    link.clicks = (link.clicks || 0) + 1;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    // ignore write error for redirect speed
  }
  // Webhook (best-effort, async)
  try {
    const ip = (req.headers['x-forwarded-for']?.toString().split(',')[0].trim()) || req.ip;
    const ua = req.get('user-agent') || '';
    sendWebhookEvent('link.clicked', {
      id: req.params.id,
      clicks: link.clicks,
      ip,
      userAgent: ua,
      at: new Date().toISOString(),
    });
  } catch (e) {}

  res.redirect(302, link.originalUrl);
});

// SPA Fallback für React Router
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return res.status(404).end();
  }
  // Serve index.html from built dist if present, otherwise project root
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
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
    const body = { type, timestamp: new Date().toISOString(), payload };
    webhooks.forEach(async (hook) => {
      try {
        if (!hook || !hook.url) return;
        await axios.post(hook.url, body, { headers: { 'Content-Type': 'application/json' } });
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
  const newHook = { ...req.body, id: Date.now().toString(), totalCalls: 0 };
  webhooks.push(newHook);
  saveWebhooks(webhooks);
  res.json(newHook);
});

// Update webhook
app.put("/api/webhooks/:id", (req, res) => {
  let webhooks = loadWebhooks();
  webhooks = webhooks.map((w) =>
    w.id === req.params.id ? { ...w, ...req.body } : w
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
  if (!hook) return res.status(404).json({ error: "Webhook nicht gefunden" });

  try {
    const result = await axios.post(hook.url, {
      content: `🔔 Testnachricht vom Webhook "${hook.name}"`,
    });

    hook.totalCalls += 1;
    hook.lastTriggered = new Date().toISOString();
    saveWebhooks(webhooks);
    res.json({ success: true, status: result.status });
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Senden des Webhooks" });
  }
});

// GET: Aktuelle Links für Frontend
app.get("/api/recents", (req, res) => {
  const base = getBaseUrl(req);
  const recentLinks = db
    .slice(-8)
    .reverse()
    .map((link) => ({
      id: link.customId,
      originalUrl: link.originalUrl,
      shortUrl: `${base}/${link.customId}`,
      clicks: link.clicks,
      createdAt: timeSince(new Date(link.createdAt)),
    }));

  res.json(recentLinks);
});

// GET: Liste aller Links (paginierte API)
app.get('/api/links', (req, res) => {
  const base = getBaseUrl(req);
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const q = (req.query.q || '').toString().toLowerCase();
  const sortBy = (req.query.sortBy || 'createdAt').toString();
  const order = (req.query.order || 'desc').toString();

  let items = db.slice();

  if (q) {
    items = items.filter(
      (l) =>
        l.customId.toLowerCase().includes(q) ||
        (l.originalUrl && l.originalUrl.toLowerCase().includes(q))
    );
  }

  items.sort((a, b) => {
    const dir = order === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'clicks':
        return ((a.clicks || 0) - (b.clicks || 0)) * dir;
      case 'id':
        return a.customId.localeCompare(b.customId) * dir;
      default:
        return (new Date(a.createdAt) - new Date(b.createdAt)) * dir;
    }
  });

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit).map((l) => ({
    id: l.customId,
    originalUrl: l.originalUrl,
    shortUrl: `${base}/${l.customId}`,
    clicks: l.clicks || 0,
    createdAt: l.createdAt,
  }));

  res.json({ items: paged, page, limit, total, totalPages: Math.ceil(total / limit) });
});

// Hilfsfunktion für Zeitangabe
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return "gerade eben";
  if (minutes === 1) return "vor 1 Min";
  return `vor ${minutes} Min`;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend läuft auf http://0.0.0.0:${PORT}`);
});
