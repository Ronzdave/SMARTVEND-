# SmartVend UI

Captive-portal web interface for **SmartVend** — an IoT self-service printing
kiosk (BSIT capstone, DNSC). The page is served from the ESP32-S2 over its WiFi
access point (`DNSC_Smart_Printing_Station`, `192.168.4.1`) and talks to the
firmware over HTTP. See the API contract at the top of the `<script>` in
`index.html`.

## Requirements
- Node.js 18+ (uses the built-in test runner and ES modules — **no npm install
  needed**, everything runs offline).

## Commands
| Command | What it does |
|---|---|
| `npm start` | Serve the UI at http://localhost:8080 — open `/#preview` for sample data |
| `npm test` | Run unit + smoke tests (`node --test`) |
| `npm run type-check` | Static syntax check of the build/serve scripts |
| `npm run build` | Validate the page + emit deploy-ready `dist/index.html` |
| `npm run validate` | All of the above — the evidence bundle |

## Preview / mock data
Open the UI with `#preview` (e.g. `http://localhost:8080/#preview`). A built-in
sample backend simulates an RFID tap, a student wallet, and admin data so you
can walk every screen without the ESP32. On the real kiosk, no `#preview` is
used and the page calls the firmware.

## Deploy
`npm run build` writes `dist/index.html`. Copy it (plus `pdf.min.js` and
`pdf.worker.min.js`) into the ESP32-S2 LittleFS and flash. The SoftAP has no
internet, so the PDF.js CDN URLs in `index.html` must be changed to those local
files before flashing.

## Structure
```
index.html          the whole app (inline CSS/JS, single-file for LittleFS)
src/pricing.mjs      tested source of truth: pricing + validation
test/                node --test unit + smoke tests
scripts/build.mjs    validate + emit dist/index.html
scripts/serve.mjs    local static server
CLAUDE.md            rules for AI-agent-assisted work
AGENT_WORKSHOP.md    seminar workshop playbook (branch, loop, checkpoints)
```
