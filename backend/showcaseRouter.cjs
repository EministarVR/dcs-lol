// Showcase Router (CommonJS) — mounted under /api in backend/index.cjs
// Provides:
//   GET   /api/showcase        → list showcase entries
//   POST  /api/showcase        → create entry with image upload
// Exports: { router, UPLOADS_DIR }

const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Paths
const BACKEND_DIR = __dirname; // backend/
const SHOWCASE_DB = path.join(BACKEND_DIR, "showcase.json");
const UPLOADS_DIR = path.join(BACKEND_DIR, "uploads");

// Ensure storage exists
try {
  if (!fs.existsSync(SHOWCASE_DB)) fs.writeFileSync(SHOWCASE_DB, "[]");
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch (e) {
  console.error("[showcase] Init error:", e);
}

// Tight rate limit specific to showcase endpoints
const showcaseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(showcaseLimiter);

// Multer (memory storage) for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(_req, file, cb) {
    const ok = ["image/png", "image/jpeg", "image/webp"].includes(file.mimetype);
    cb(null, ok);
  },
});

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(SHOWCASE_DB, "utf8"));
  } catch (e) {
    console.error("[showcase] Read DB error:", e);
    return [];
  }
}

function saveDb(list) {
  try {
    fs.writeFileSync(SHOWCASE_DB, JSON.stringify(list, null, 2));
  } catch (e) {
    console.error("[showcase] Write DB error:", e);
  }
}

// GET /api/showcase — list entries
router.get("/showcase", (_req, res) => {
  const data = loadDb();
  res.json(data);
});

// POST /api/showcase — create entry
router.post("/showcase", upload.single("logo"), async (req, res) => {
  try {
    const { name, description, inviteLink, category, tags } = req.body || {};

    const errors = {};
    if (!name || !String(name).trim()) errors.name = "Name ist Pflicht";
    if (!description || !String(description).trim()) errors.description = "Beschreibung ist Pflicht";

    // Only allow dcs.lol/<id> format as requested
    const invite = String(inviteLink || "").trim();
    if (!invite || !/^dcs\.lol\/[A-Za-z0-9_-]{3,32}$/.test(invite)) {
      errors.inviteLink = "Nur dcs.lol/<id> erlaubt";
    }

    if (!category) errors.category = "Kategorie ist Pflicht";

    let tagArray = [];
    if (tags) {
      try {
        tagArray = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch {
        tagArray = String(tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
    if (tagArray.length > 5) errors.tags = "Maximal 5 Tags erlaubt";

    if (!req.file) errors.logo = "Logo ist Pflicht";

    if (Object.keys(errors).length) {
      return res.status(400).json({ error: errors });
    }

    // Process image → webp 512x512
    const id = uuidv4();
    const filename = `${id}.webp`;
    const outPath = path.join(UPLOADS_DIR, filename);

    await sharp(req.file.buffer)
      .resize(512, 512, { fit: "cover" })
      .webp({ quality: 80 })
      .toFile(outPath);

    const entry = {
      id,
      name: String(name).trim(),
      description: String(description).trim(),
      inviteLink: invite,
      category,
      tags: tagArray,
      logoUrl: `/uploads/${filename}`,
      createdAt: new Date().toISOString(),
    };

    const arr = loadDb();
    arr.unshift(entry);
    saveDb(arr);

    res.status(201).json(entry);
  } catch (e) {
    console.error("[showcase] POST error:", e);
    res.status(500).json({ error: "Server-Fehler beim Upload" });
  }
});

module.exports = { router, UPLOADS_DIR };
