# 🎯 dcs.lol — Der schönste Discord-Linkverkürzer im Internet

<p align="center">
  <img src="https://dcs.lol/assets/logo.png" alt="dcs.lol Logo" width="150" />
</p>

<div align="center">
  <b>Discord-Einladungslinks verkürzen, aber stylisch.</b><br />
  <code>https://discord.gg/irgendwas</code> wird zu <code>https://dcs.lol/deinlink</code>
</div>

---

## ✨ Features

- 🔗 **Eigene Kurzlinks** wie `dcs.lol/meinserver`
- 🎨 **Atemberaubendes Frontend** mit Tailwind & React
- ⚡ **Blitzschnell & kostenlos**
- 🔐 SSL via Let's Encrypt
- 📊 Analytics-ready (in Arbeit)
- 🧠 Keine Registrierung nötig

---

## 🖼️ Screenshot

<img src="https://dcs.lol/assets/screenshot.png" alt="Screenshot von dcs.lol" width="100%" />

---

## 🛠️ Tech Stack

| Bereich      | Technologie                     |
| ------------ | --------------------------------|
| Frontend     | React, TypeScript, Tailwind CSS |
| Backend      | Express.js (Node.js)            |
| Hosting      | Apache2 + PM2                   |
| SSL          | Let's Encrypt via Certbot       |
| Deployment   | Linux Ubuntu 22.04              |

---

## 🚀 Deployment (local)

```
# 1) Dependencies installieren (Root)
npm install

# 2) MySQL vorbereiten
# - Datenbank anlegen, z. B. "dcs"
# - Benutzer anlegen und Berechtigungen geben
# - Beispiel (MySQL Shell):
#   CREATE DATABASE dcs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
#   CREATE USER 'dcs_user'@'%' IDENTIFIED BY 'change_me';
#   GRANT ALL PRIVILEGES ON dcs.* TO 'dcs_user'@'%';
#   FLUSH PRIVILEGES;

# 3) .env anlegen (im Projekt-Root)
cp .env.example .env
# und Werte anpassen (Host, User, Passwort, DB-Name, optional PORT)

# 4) Backend starten (Express bedient auch das Frontend aus /dist)
npm run start

# 5) Development Frontend (optional, wenn du Vite Dev nutzen willst)
# Das Backend läuft weiter auf PORT aus .env (Standard 49623)
npm run dev
```
> 💡 Standard-Port für das Backend ist 49623. In Deployments (z. B. nixpacks) kann `PORT` vorgegeben sein (Standard dort: 3000).
---

## 🧾 Beispiel-Link
```
Original: https://discord.gg/kcGCDRB2x6
Kurz:     https://dcs.lol/dcs
```
---
# 🧑‍💻 Maintainer

**EministarVR**
- 👨‍💻 Developer bei [YukiCraft](https://discord.yukicraft.net)
- 💻 GitHub: ``@EministarVR``

---

## 📄 Lizenz

MIT License — freie Nutzung erlaubt, Credits wären sexy.
Logo, Style & Marke dcs.lol © EministarVR 2025.
---

# 🌐 Live-Version

👉 https://dcs.lol


---
