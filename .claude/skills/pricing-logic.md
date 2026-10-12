# Skill: SmartVend Pricing Logic

Use this skill whenever you touch cost calculation, the pricing module,
unit tests, or any UI element that displays a price or cost estimate.

---

## Source of Truth

All pricing lives in **`src/pricing.mjs`**. The UI (`index.html`) mirrors
these values inline. The build step (`scripts/build.mjs`) **fails** if the
two ever drift apart — this is intentional and must stay in place.

---

## Current Rates

```javascript
export const RATE = { SHORT: 2, LONG: 3 };   // pesos per page
export const COLOR_SURCHARGE = 1;              // extra pesos per page for COLOR
```

| Paper | B&W | Color |
|---|---|---|
| Short Bond | ₱2 / page | ₱3 / page |
| Long Bond | ₱3 / page | ₱4 / page |

---

## Cost Formula

```javascript
cost = pageCount × (RATE[paper] + (mode === 'COLOR' ? COLOR_SURCHARGE : 0)) × copies
```

Use `computeCost()` from `src/pricing.mjs` — never rewrite the formula inline.

---

## Exported Functions

| Function | Purpose |
|---|---|
| `computeCost({ pages, paper, mode, copies })` | Total cost of a print job |
| `affordablePages(balance)` | How many Short Bond B&W pages the balance covers |
| `validatePhone(v)` | Philippine mobile number: 09XXXXXXXXX (11 digits) |
| `fmt(n)` | Format as ₱0.00 |

`pages` can be a number (count) or an array of page numbers (length is used).

---

## Adding or Changing a Price

1. Update `src/pricing.mjs` first (the source of truth)
2. Update the matching inline values in `index.html` (search for `RATE` and `COLOR_SURCHARGE`)
3. Update the unit test in `test/pricing.test.mjs` to match
4. Run `npm run validate` — the build drift-check will confirm both match

**Never** change only `index.html` without updating `src/pricing.mjs` — the build will fail.

---

## Unit Test Coverage Required

Every pricing function must have tests in `test/pricing.test.mjs`.
Current coverage (13 tests total):
- `computeCost` — short bond B&W, long bond B&W×2 copies, color surcharge, array of pages, throws on unknown paper, throws on invalid copies
- `affordablePages` — normal, floor rounding, zero balance, negative balance
- `validatePhone` — valid format, invalid formats
- `fmt` — peso formatting
- constants — RATE.SHORT, RATE.LONG, COLOR_SURCHARGE

When adding a new pricing rule, add at least one test for the happy path
and one for the edge case (zero, negative, invalid input).

---

## Dashboard Hint

The affordable pages hint shown on the dashboard balance tile:

```javascript
const affordable = Math.floor((s.balance || 0) / RATE.SHORT);
document.getElementById('dash-afford').textContent =
  affordable > 0
    ? '≈ ' + affordable + ' pages (Short Bond, B&W)'
    : 'Load credits to start printing';
```

Uses `RATE.SHORT` (the cheapest rate) so the hint is always optimistic.
