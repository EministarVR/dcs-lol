const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 49623;
const DB_FILE = path.join(__dirname, 'links.json');

// Initialisiere Datenbank falls nicht vorhanden
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '[]');
}

let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

app.use(cors());
app.use(express.json());

// POST: Link kürzen
app.post('/api/shorten', (req, res) => {
  const { originalUrl, customId } = req.body;

  if (!originalUrl || !originalUrl.startsWith('https://discord.gg/')) {
    return res.status(400).json({ error: 'Ungültiger Discord-Link' });
  }

  if (!customId || !/^[a-zA-Z0-9_-]{3,32}$/.test(customId)) {
    return res.status(400).json({ error: 'Ungültige ID' });
  }

  if (db.find(link => link.customId === customId)) {
    return res.status(409).json({ error: 'Diese ID existiert bereits' });
  }

  const newLink = {
    originalUrl,
    customId,
    clicks: 0,
    createdAt: new Date().toISOString()
  };

  db.push(newLink);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

  res.json({ short: `https://dcs.lol/${customId}` });
});

// GET: Weiterleitung
app.get('/:id', (req, res) => {
  const link = db.find(l => l.customId === req.params.id);

  if (!link) {
    return res.status(404).send('Link nicht gefunden');
  }

  link.clicks += 1;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

  res.redirect(link.originalUrl);
});

// GET: Aktuelle Links für Frontend
app.get('/api/recents', (req, res) => {
  const recentLinks = db.slice(-6).reverse().map(link => ({
    id: link.customId,
    originalUrl: link.originalUrl,
    shortUrl: `https://dcs.lol/${link.customId}`,
    clicks: link.clicks,
    createdAt: timeSince(new Date(link.createdAt))
  }));

  res.json(recentLinks);
});

// Hilfsfunktion für Zeitangabe
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return 'gerade eben';
  if (minutes === 1) return 'vor 1 Min';
  return `vor ${minutes} Min`;
}

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
