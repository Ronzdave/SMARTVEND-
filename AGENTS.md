# SmartVend — Agent Entry Point

This file tells AI agents (Claude, OpenAI, etc.) how to work in this repo.
Read this before doing anything else.

## What this project is
SmartVend is an IoT self-service printing kiosk built as a BSIT capstone at
Davao del Norte State College (DNSC), Panabo City. An ESP32-S2 Mini hosts a
captive-portal web UI over WiFi; students tap an RFID card, upload a PDF on
their phone, select pages and options, and print to an Epson L3210 via USB OTG.

## Repository layout
```
index.html          ← The entire captive-portal app (inline CSS + JS, one file)
src/pricing.mjs     ← Tested source of truth for pricing / validation
test/               ← node --test unit + smoke tests
scripts/build.mjs   ← Validates index.html, drift-checks pricing, writes dist/
scripts/serve.mjs   ← Zero-dependency local dev server (port 8080)
.claude/skills/     ← Custom agent skills for this project
CLAUDE.md           ← Agent working rules (read this too)
knowledge.md        ← Project domain knowledge and hardware reference
```

## Commands
```bash
npm run validate    # Full evidence: type-check + test + build (run this last)
npm test            # Unit + smoke tests only
npm run build       # Emit dist/index.html for the ESP32
npm start           # Serve at http://localhost:8080  (#preview = sample data)
```

## Agent loop for this project
1. **Inspect** — Read only the files needed. Start with `index.html` and `src/pricing.mjs`.
2. **Plan** — Propose what you'll change and which files. Wait for approval.
3. **Implement** — Write the change. Stay in scope.
4. **Verify** — Run `npm run validate`. All checks must pass.
5. **Review** — Show the diff. Confirm no backend or secret changes.

## Hard rules
- Only touch `index.html`, `src/pricing.mjs`, and `test/` unless told otherwise
- Never read, expose, or accept `.env` or API keys
- Never modify the `/api/...` firmware contract
- Always run `npm run validate` before declaring done
- Keep WCAG AA contrast (4.5:1), 44px touch targets, and ARIA roles intact
