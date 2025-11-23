const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Paths
const DATA_DIR = __dirname;
const SHOWCASE_DB = path.join(DATA_DIR, 'showcase.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure storage
if (!fs.existsSync(SHOWCASE_DB)) fs.writeFileSync(SHOWCASE_DB, '[]');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = ['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype);
    cb(null, ok);
  }
});

const tightLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

function loadShowcase() {
  try {
    return JSON.parse(fs.readFileSync(SHOWCASE_DB, 'utf8'));
  } catch {
    return [];
  }
}

function saveShowcase(arr) {
  fs.writeFileSync(SHOWCASE_DB, JSON.stringify(arr, null, 2));
}

// GET /api/showcase
router.get('/showcase', (req, res) => {
  try {
    const data = loadShowcase();
    res.json(data);
  } catch (e) {
    console.error('Showcase load error:', e);
    res.status(500).json({ error: 'Fehler beim Laden des Showcase' });
  }
});

// POST /api/showcase
router.post('/showcase', tightLimiter, upload.single('logo'), async (req, res) => {
  try {
    const { name, description, inviteLink, category, tags } = req.body || {};

    const errs = {};
    if (!name || !String(name).trim()) errs.name = 'Name ist Pflicht';
    if (!description || !String(description).trim()) errs.description = 'Beschreibung ist Pflicht';

    // Only allow our short domain pattern
    const invite = String(inviteLink || '').trim();
    if (!invite || !/^dcs\.lol\/[A-Za-z0-9_-]{3,32}$/.test(invite)) {
      errs.inviteLink = 'Nur dcs.lol Kurzlinks erlaubt';
    }

    if (!category) errs.category = 'Kategorie ist Pflicht';

    let tagArray = [];
    if (tags) {
      try {
        const parsed = typeof tags === 'string' ? JSON.parse(tags) : tags;
        if (Array.isArray(parsed)) tagArray = parsed.map(String);
      } catch {
        tagArray = String(tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
    if (tagArray.length > 5) errs.tags = 'Maximal 5 Tags erlaubt';

    if (!req.file) errs.logo = 'Logo ist Pflicht';

    if (Object.keys(errs).length) {
      return res.status(400).json({ error: errs });
    }

    const id = uuidv4();
    const filename = `${id}.webp`;
    const outPath = path.join(UPLOADS_DIR, filename);

    await sharp(req.file.buffer)
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 82 })
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

    const arr = loadShowcase();
    arr.unshift(entry);
    saveShowcase(arr);

    res.status(201).json(entry);
  } catch (e) {
    console.error('Showcase post error:', e);
    res.status(500).json({ error: 'Server-Fehler beim Upload' });
  }
});

module.exports = { router, UPLOADS_DIR };
