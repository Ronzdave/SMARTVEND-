# Skill: SmartVend Print Flow

Use this skill when making any change that touches the student print journey:
upload → page selection → options → printing → done.

---

## The Print Flow (in order)

```
screen-tap  →  screen-dashboard  →  screen-upload
→  screen-pages  →  screen-options  →  screen-printing  →  screen-done
```

Each screen transition uses `goScreen('screen-id')` which:
1. Hides all screens
2. Shows the target screen
3. Moves keyboard focus to the new screen (accessibility)
4. Resets the idle logout timer

---

## Critical: Atomic Credit Handling

The print job uses a two-phase commit to protect the student's balance:

1. **`POST /api/print/start`** — Reserves the credits (balance frozen)
2. **`POST /api/print/page`** — Upload each JPEG page (one at a time)
3. **`POST /api/print/finish`** — Deducts credits and triggers the printer

If the connection drops after step 1 but before step 3, the reservation
expires server-side. Never deduct credits before pages are confirmed uploaded.

---

## Page Rendering

Each selected page is rendered to JPEG before upload:
- DPI: `CONFIG.PRINT_DPI` (150 by default)
- Quality: `CONFIG.JPEG_QUALITY` (0.85)
- B&W mode: apply ITU-R grayscale filter on the canvas before `toDataURL`
  ```javascript
  // Grayscale conversion in renderPageJPEG()
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.data.length; i += 4) {
    const g = 0.299*data.data[i] + 0.587*data.data[i+1] + 0.114*data.data[i+2];
    data.data[i] = data.data[i+1] = data.data[i+2] = g;
  }
  ctx.putImageData(data, 0, 0);
  ```

---

## Session State Shape

```javascript
let session = {
  student: null,      // { id, name, balance }
  pdf: null,          // PDF.js document object
  doc: null,          // { name, pageCount }
  selectedPages: [],  // [1, 3, 5] — 1-indexed
  paper: 'SHORT',     // 'SHORT' | 'LONG'
  copies: 1,
  mode: 'BW',         // 'BW' | 'COLOR'
};
```

---

## Rules for changes in this flow
- Always keep all 6 print screens intact (`screen-upload` through `screen-done`)
- Never skip the reserve step at `print/start`
- If adding UI logic that affects cost, update `src/pricing.mjs` and add a unit test
- Keep the copies stepper clamped: min 1, max `CONFIG.MAX_COPIES` (10)
- Paper and mode selectors must update `session.paper` and `session.mode` live
