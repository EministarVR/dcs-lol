const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const PORT = 49623;
const linksFile = path.join(__dirname, 'links.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Optional, falls du statische Dateien hostest

// Stelle sicher, dass links.json existiert
if (!fs.existsSync(linksFile)) {
  fs.writeFileSync(linksFile, '{}');
}

app.post('/api/shorten', (req, res) => {
  const { originalUrl, customId } = req.body;

  if (!originalUrl || !customId) {
    return res.status(400).json({ error: 'URL oder Wunsch-Link fehlt.' });
  }

  const isValidDiscordLink = /^(https:\/\/)?(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+$/.test(originalUrl);
  if (!isValidDiscordLink) {
    return res.status(400).json({ error: 'Ungültiger Discord-Link' });
  }

  const links = JSON.parse(fs.readFileSync(linksFile, 'utf8'));
  if (links[customId]) {
    return res.status(409).json({ error: 'Dieser Wunsch-Link ist bereits vergeben.' });
  }

  links[customId] = originalUrl;
  fs.writeFileSync(linksFile, JSON.stringify(links, null, 2));

  res.json({ short: `https://dcs.lol/${customId}` });
});

// Weiterleitung
app.get('/:id', (req, res) => {
  const links = JSON.parse(fs.readFileSync(linksFile, 'utf8'));
  const target = links[req.params.id];

  if (target) {
    res.redirect(target);
  } else {
    res.status(404).send('Link nicht gefunden.');
  }
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
