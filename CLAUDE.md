# SmartVend — agent working rules

SmartVend is a BSIT capstone: an ESP32-S2 self-service printing kiosk with a
mobile captive-portal UI, RFID e-wallet, and dual-format paper feeding.
This repo is the **captive-portal web UI** served from the ESP32 LittleFS.

## What this codebase is
- `index.html` — the whole app: one self-contained HTML file (inline CSS + JS)
  because the ESP32 serves a single file over its WiFi access point.
- `src/pricing.mjs` — the tested source of truth for pricing / validation.
- `test/` — `node --test` unit + smoke tests.
- `scripts/build.mjs` — validates the page, checks it against `src/pricing.mjs`,
  and writes the deploy-ready `dist/index.html`.

## Rules for the AI agent (read before you act)
1. **Stay in scope.** Only touch the files needed for the requested change.
   Do NOT edit the firmware API contract (the `/api/...` endpoints) or the
   ESP32-side behavior.
2. **Protect secrets.** Never read, print, or accept `.env` / API keys. The UI
   needs no secrets. The admin password is verified server-side (hashed on SD).
3. **Propose a plan first**, list the files you will change, then implement.
4. **Preserve the baseline.** The app must keep working: all existing screens
   and the print flow (RFID → upload → pages → options → print → done) intact.
5. **Verify before done.** Run `npm run validate` (type-check + test + build)
   and confirm it passes. Add/adjust unit tests for any logic you change.
6. **Accessibility.** Keep WCAG AA contrast, 44px touch targets, ARIA roles,
   and light/dark theming that are already in place.

## Commands
- `npm run validate` — full evidence: syntax check + tests + build
- `npm test` — unit + smoke tests
- `npm run build` — emit `dist/index.html` for the ESP32
- `npm start` — serve locally at http://localhost:8080 (`#preview` = sample data)
