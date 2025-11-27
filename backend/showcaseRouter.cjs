const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");

// Paths
const SHOWCASE_DB = path.join(__dirname, "showcase.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Ensure storage exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(SHOWCASE_DB)) fs.writeFileSync(SHOWCASE_DB, "[]");

// Multer (memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "image/webp"].includes(file.mimetype);
    cb(null, ok);
  },
});

// Per-route tighter rate limit
const showcaseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // a bit tighter than global
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();
router.use(showcaseLimiter);

function loadShowcase() {
  try {
    return JSON.parse(fs.readFileSync(SHOWCASE_DB, "utf8"));
  } catch (e) {
    return [];
  }
}

function saveShowcase(arr) {
  fs.writeFileSync(SHOWCASE_DB, JSON.stringify(arr, null, 2));
}

// GET /api/showcase
router.get("/showcase", (req, res) => {
  try {
    const raw = loadShowcase();
    let list = Array.isArray(raw) ? raw : [];
    // Some legacy files contain an array-of-arrays; flatten one level
    if (list.length > 0 && Array.isArray(list[0])) {
      try { list = list.flat(1); } catch { list = [].concat(...list); }
    }
    const normalized = list
      .filter((x) => x && typeof x === 'object')
      .map((x) => ({
        id: String(x.id || ''),
        name: String(x.name || ''),
        description: typeof x.description === 'string' ? x.description : '',
        inviteLink: String(x.inviteLink || ''),
        category: String(x.category || ''),
        tags: Array.isArray(x.tags) ? x.tags : [],
        logoUrl: String(x.logoUrl || ''),
        createdAt: x.createdAt ? new Date(x.createdAt).toISOString() : new Date().toISOString(),
        featured: Boolean(x.featured),
        verified: Boolean(x.verified),
      }));
    res.json(normalized);
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Laden des Showcase" });
  }
});

// POST /api/showcase
router.post("/showcase", upload.single("logo"), async (req, res) => {
  try {
    const { name, description, inviteLink, category, tags } = req.body || {};

    const errors = {};
    if (!name || !name.trim()) errors.name = "Name ist Pflicht";
    if (!description || !description.trim()) errors.description = "Beschreibung ist Pflicht";
    if (!inviteLink || !/^dcs\.lol\/[A-Za-z0-9_-]{3,64}$/.test(inviteLink)) {
      errors.inviteLink = "Nur dcs.lol/<id> Links erlaubt";
    }
    if (!category || !category.trim()) errors.category = "Kategorie ist Pflicht";
    if (!req.file) errors.logo = "Logo ist Pflicht";

    let tagArray = [];
    if (tags) {
      try {
        const parsed = typeof tags === "string" ? JSON.parse(tags) : tags;
        tagArray = Array.isArray(parsed) ? parsed : [];
      } catch {
        tagArray = tags
          .toString()
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
    if (tagArray.length > 5) errors.tags = "Maximal 5 Tags erlaubt";

    if (Object.keys(errors).length) return res.status(400).json({ error: errors });

    const id = uuidv4();
    const filename = `${id}.webp`;
    const outPath = path.join(UPLOADS_DIR, filename);

    await sharp(req.file.buffer)
      .resize(512, 512, { fit: "cover" })
      .webp({ quality: 80 })
      .toFile(outPath);

    const entry = {
      id,
      name: name.trim(),
      description: description.trim(),
      inviteLink: inviteLink.trim(),
      category: category.trim(),
      tags: tagArray,
      logoUrl: `/uploads/${filename}`,
      createdAt: new Date().toISOString(),
    };

    const data = loadShowcase();
    data.unshift(entry);
    saveShowcase(data);

    res.status(201).json(entry);
  } catch (e) {
    console.error("Showcase upload error:", e);
    res.status(500).json({ error: "Server-Fehler beim Upload" });
  }
});

module.exports = { router, UPLOADS_DIR };
