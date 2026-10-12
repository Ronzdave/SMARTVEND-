# SmartVend — Project Knowledge Base

Reference document for AI agents and developers. Covers hardware, API contract,
pricing rules, UI screens, and constraints.

---

## Hardware

| Component | Part | Role |
|---|---|---|
| Microcontroller | ESP32-S2 Mini (LOLIN) | Hosts captive portal, drives printer via USB OTG |
| RFID reader | RC522 | Reads student e-wallet cards |
| Storage | MicroSD (SPI) | students.csv, transactions.csv, ink.csv |
| Printer | Epson L3210 | USB A-B cable from ESP32 USB OTG |
| GSM module | SIM800L EVB | SMS alerts for low ink / low balance |
| Temp sensor | DHT22 | Hardware health monitoring |
| Paper sensors | E3F-DS30C4 (×2) | Short Bond and Long Bond stock detection |

## Network
- SSID: `DNSC_Smart_Printing_Station` (SoftAP, no internet)
- IP: `192.168.4.1`
- The UI runs entirely on the student's phone browser — no internet required
- PDF.js must be served from LittleFS (copy `pdf.min.js` + `pdf.worker.min.js`)

---

## Pricing Rules (source of truth: src/pricing.mjs)

| Paper | B&W | Color |
|---|---|---|
| Short Bond | ₱2 / page | ₱3 / page |
| Long Bond | ₱3 / page | ₱4 / page |

- Color surcharge: ₱1 per page on top of B&W rate
- Copies multiply the total: `cost = pages × (rate + surcharge) × copies`
- Cheapest rate (Short Bond B&W) used for "affordable pages" hint on dashboard

---

## HTTP API Contract (firmware — DO NOT CHANGE from the UI side)

All endpoints are relative to `http://192.168.4.1`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/session` | Poll for RFID tap — returns student data or `{waiting:true}` |
| POST | `/api/register` | Register a new student (name, phone, initial balance) |
| POST | `/api/print/start` | Reserve credits for a print job — returns `job_id` |
| POST | `/api/print/page` | Upload one JPEG page (multipart) |
| POST | `/api/print/finish` | Commit job, deduct credits, trigger printer |
| GET | `/api/history` | Student's transaction history |
| POST | `/api/admin/login` | Admin login (password verified server-side) |
| GET | `/api/admin/status` | Hardware health (ink, paper, temp, printer) |
| POST | `/api/admin/credits` | Add credits to a student account |
| GET | `/api/admin/student` | Look up a student by RFID |
| GET | `/api/admin/ink` | Ink level per colour |
| POST | `/api/admin/refill` | Mark ink as refilled |
| GET | `/api/admin/transactions` | All transactions (admin view) |

**Security note:** Admin password is hashed on the SD card and verified
server-side. Never store or transmit the plaintext password from the UI.

---

## UI Screens

| Screen ID | Name | Description |
|---|---|---|
| `screen-tap` | RFID Tap | Waiting screen — polls `/api/session` every 1.5s |
| `screen-register` | Register | New student form (name, phone) |
| `screen-dashboard` | Dashboard | Balance tile, affordable pages hint, navigation |
| `screen-upload` | Upload | PDF file picker + PDF.js renderer |
| `screen-pages` | Page Select | Thumbnail grid, select/deselect pages |
| `screen-options` | Print Options | Paper size, B&W/Color, copies, cost preview |
| `screen-printing` | Printing | Progress indicator during print job |
| `screen-done` | Done | Receipt summary |
| `screen-history` | History | Student transaction list |
| `screen-admin` | Admin Login | Password entry with show/hide toggle |
| `screen-admin-dash` | Admin Dashboard | Hardware status, credit management, transactions |

---

## Key Config Values (index.html)

```javascript
const CONFIG = {
  API_BASE: '',           // Empty = same origin (192.168.4.1)
  RFID_POLL_MS: 1500,    // How often to poll for card tap
  STATUS_POLL_MS: 8000,  // Admin hardware status refresh
  PRINT_DPI: 150,        // JPEG render DPI for each page
  JPEG_QUALITY: 0.85,    // Canvas toDataURL quality
  IDLE_LOGOUT_MS: 90000, // Student idle timeout (90s)
  IDLE_WARN_MS: 15000,   // Warning before logout
  ADMIN_IDLE_MS: 180000, // Admin idle timeout (3 min)
  MAX_COPIES: 10,        // Maximum copies per job
};
```

---

## Accessibility Requirements
- WCAG AA contrast: 4.5:1 minimum for all text
- Touch targets: 44px minimum height/width
- Focus management: `goScreen()` moves focus to new screen on navigation
- ARIA: live regions for status, `aria-invalid` on form errors, `role` on custom controls
- Light/dark theme: all colors defined as CSS tokens, both themes supported

---

## Single-File Constraint
The entire UI **must stay as one HTML file** (`index.html`). The ESP32 LittleFS
serves a single file. All CSS, JS, and SVG sprites are inlined. The build step
validates the file size stays under 512KB (LittleFS budget).
