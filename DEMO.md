# SmartVend — Seminar Demo Build

**Capstone project**: ESP32-S2 Self-Service Printing Kiosk · BSIT 4E · DNSC

This build runs the complete UI **without the hardware** — perfect for seminar
demos, defense, and class presentations. All ESP32 / RFID / Epson / SIM800L /
DHT22 calls are routed to an in-browser mock, so every screen works offline.

## How to run

```bash
# From this folder:
npm start         # serves at http://localhost:8080
# or just open index.html directly in your browser
```

## Demo credentials
- **Admin password**: `admin123`
- **Pre-seeded students**: 8 (including the capstone team)
- **Pre-seeded transactions**: 15 across the day

## How to walk the demo

### Student flow
1. From the Portal, tap **Student Portal**
2. On the RFID screen, use the **Seminar Demo** panel at the bottom:
   - **Returning Student** → logs in as Maria Santos (balance ₱150)
   - **New Card** → opens the registration form with a fresh UID
3. From the Dashboard:
   - **Print Document** → upload any PDF → pick pages → set options → **Review & Print**
   - **How to Print** → opens the 5-step help modal
   - **My Transactions** → shows the student's history
4. After printing, an SMS receipt popup appears (simulated SIM800L)

### Admin flow
1. Back to Home → **Admin Portal** → password `admin123`
2. **Overview** — live hardware health (temp, stock, printer, SIM, SD)
3. **Load Credits** — look up a student ID (try `2021-0042`), pick amount, confirm
4. **Check Balance** — search by name or ID
5. **Students** *(new)* — full roster with balances and search
6. **Ink & Stock** — set ink levels, mark paper refilled
7. **Transactions** — complete transaction log
8. **Reports** *(new)* — weekly revenue chart + stats + CSV export
9. **Settings** *(new)* — pricing, SMS toggle, idle timeout, admin password
   - Also includes a **Hardware Simulation** panel to trigger overheat,
     low paper, low ink, and printer-offline events during the demo

## Screens included (14 student + 9 admin)

**Student**: Portal · RFID Tap · Register · Dashboard · Upload · Page Select ·
Print Options · Pre-print Review · Printing Progress · Done/Receipt ·
SMS Notification · History · Error · Help

**Admin**: Login · Overview · Load Credits · Check Balance · Students ·
Ink & Stock · Transactions · Reports · Settings (+ Hardware Simulation)

## Switching back to real hardware

In `index.html`, change:
```js
PREVIEW: true,   // DEMO BUILD
```
to:
```js
PREVIEW: location.hash === '#preview',
```
and flash to the ESP32-S2. The firmware HTTP API contract documented in
`knowledge.md` is unchanged.
