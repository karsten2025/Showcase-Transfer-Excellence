<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/32de35cb-ac50-4793-8961-dd039775b7e7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# Montan-AG Transfer Excellence Portal

Ein KI-gestütztes Steuerungstool für großangelegte Restrukturierungen (2.500 MA) basierend auf der CPMAI-Methodik.

## Features
- Dynamische Kostenkalkulation (Remanenz & Abfindungen)
- Stakeholder-spezifische Dashboards (Vorstand, BR, PMO)
- Skill-Index basiertes Speed-Profiling
- ETL-Pipeline für unstrukturierte Montan-Regelwerke

## Tech Stack
- React 19 + Vite
- Tailwind CSS 4
- Zustand (State Management)
- Gemini 2.0 Pro (Logik & Extraktion)

## Deployment auf Render

**Empfohlen: Static Site**
- Service Type: **Static Site**
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Root Directory: (leer lassen)

**Alternativ: Web Service** (wenn Start-Command benötigt)
- Build Command: `npm ci && npm run build`
- Start Command: `npx vite preview --host 0.0.0.0 --port $PORT`
- Environment: `NODE_VERSION=20`

Die `render.yaml` im Projektroot enthält die Blueprint-Konfiguration.