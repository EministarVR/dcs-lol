// index.cjs
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 49623;

// Pfade
const LINKS_DB = path.join(__dirname, 'links.json');
const SHOWCASE_DB = path.join(__dirname, 'showcase.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Initialisierung
for (const file of [LINKS_DB, SHOWCASE_DB]) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
}
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Multer für Logo-Upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter(req, file, cb) {
    const ok = ['image/png','image/jpeg','image/webp'].includes(file.mimetype);
    cb(null, ok);
  }
});



app.post('/api/shorten', (req, res) => {
  const { originalUrl, customId } = req.body;

  if (!/^https?:\/\/(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9]+$/.test(originalUrl)) {
    return res.status(400).json({ error: 'Ungültiger Discord-Link' });
  }
  if (!customId || !/^[a-z0-9_-]{3,32}$/.test(customId)) {
    return res.status(400).json({ error: 'Ungültiger Wunsch-Link' });
  }
  const links = JSON.parse(fs.readFileSync(LINKS_DB, 'utf8'));
  if (links.find(l => l.customId === customId)) {
    return res.status(409).json({ error: 'Dieser Link ist bereits vergeben.' });
  }
  const entry = {
    id: uuidv4(),
    originalUrl,
    customId,
    clicks: 0,
    createdAt: new Date().toISOString()
  };
  links.unshift(entry);
  fs.writeFileSync(LINKS_DB, JSON.stringify(links, null, 2));
  res.json({ short: `https://dcs.lol/${customId}` });
});


app.get('/:customId', (req, res) => {
  const { customId } = req.params;
  const links = JSON.parse(fs.readFileSync(LINKS_DB, 'utf8'));
  const link = links.find(l => l.customId === customId);
  if (!link) return res.status(404).send('Link nicht gefunden');
  link.clicks++;
  fs.writeFileSync(LINKS_DB, JSON.stringify(links, null, 2));
  res.redirect(link.originalUrl);
});


app.get('/api/recents', (req, res) => {
  const links = JSON.parse(fs.readFileSync(LINKS_DB, 'utf8'));
  const recent = links.slice(0,6).map(l => ({
    id: l.customId,
    originalUrl: l.originalUrl,
    shortUrl: `https://dcs.lol/${l.customId}`,
    clicks: l.clicks,
    createdAt: timeSince(new Date(l.createdAt))
  }));
  res.json(recent);
});

function timeSince(date) {
  const mins = Math.floor((Date.now()-date)/60000);
  if (mins < 1) return 'gerade eben';
  if (mins === 1) return 'vor 1 Min';
  return `vor ${mins} Min`;
}




app.get('/api/showcase', (req, res) => {
  const data = JSON.parse(fs.readFileSync(SHOWCASE_DB, 'utf8'));
  res.json(data);
});


app.post('/api/showcase', upload.single('logo'), async (req, res) => {
  try {
    const { name, description, inviteLink, category, tags } = req.body;
    
    const errs = {};
    if (!name?.trim()) errs.name = 'Name ist Pflicht';
    if (!description?.trim()) errs.description = 'Beschreibung ist Pflicht';
    if (!inviteLink?.trim() || !/^dcs\.lol\/[A-Za-z0-9_-]+$/.test(inviteLink)) {
      errs.inviteLink = 'Nur dcs.lol Links erlaubt';
    }
    if (!category) errs.category = 'Kategorie ist Pflicht';
    let tagArray = [];
    if (tags) {
      try { tagArray = JSON.parse(tags); }
      catch { tagArray = tags.split(',').map(t=>t.trim()).filter(t=>t); }
    }
    if (tagArray.length>5) errs.tags = 'Maximal 5 Tags erlaubt';
    if (!req.file) errs.logo = 'Logo ist Pflicht';
    if (Object.keys(errs).length) return res.status(400).json({ error: errs });

    
    const id = uuidv4();
    const filename = `${id}.webp`;
    const outPath = path.join(UPLOADS_DIR, filename);
    await sharp(req.file.buffer)
      .resize(512,512,{fit:'cover'})
      .webp({quality:80})
      .toFile(outPath);

    
    const entry = {
      id,
      name,
      description,
      inviteLink,
      category,
      tags: tagArray,
      logoUrl: `/uploads/${filename}`,
      createdAt: new Date().toISOString()
    };
    const arr = JSON.parse(fs.readFileSync(SHOWCASE_DB, 'utf8'));
    arr.unshift(entry);
    fs.writeFileSync(SHOWCASE_DB, JSON.stringify(arr, null, 2));

    res.status(201).json(entry);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server-Fehler beim Upload' });
  }
});


app.listen(PORT, () => console.log(`✅ Backend läuft auf http://localhost:${PORT}`));
