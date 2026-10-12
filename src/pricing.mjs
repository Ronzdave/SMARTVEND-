// SmartVend pricing & validation — the tested source of truth.
// The UI (index.html) mirrors these rules inline for the single-file build;
// scripts/build.mjs fails if the two ever drift apart.

/** Per-page rate in pesos, by paper size. */
export const RATE = { SHORT: 2, LONG: 3 };

/** Extra pesos per page for COLOR vs Black & White. */
export const COLOR_SURCHARGE = 1;

/**
 * Total cost of a print job.
 * @param {{pages:number|Array, paper:'SHORT'|'LONG', mode:'BW'|'COLOR', copies:number}} job
 * @returns {number} pesos
 */
export function computeCost({ pages, paper, mode, copies }) {
  const base = RATE[paper];
  if (base == null) throw new Error('Unknown paper size: ' + paper);
  const count = Array.isArray(pages) ? pages.length : Number(pages);
  if (!Number.isFinite(count) || count < 0) throw new Error('Invalid page count');
  const c = Number(copies);
  if (!Number.isInteger(c) || c < 1) throw new Error('Invalid copies');
  const surcharge = mode === 'COLOR' ? COLOR_SURCHARGE : 0;
  return count * (base + surcharge) * c;
}

/**
 * How many pages a balance can cover at the cheapest rate
 * (Short Bond, Black & White). Used for the dashboard hint.
 * @param {number} balance pesos
 * @returns {number} whole pages (never negative)
 */
export function affordablePages(balance) {
  const per = RATE.SHORT; // cheapest per-page price
  const b = Number(balance);
  if (!Number.isFinite(b) || b <= 0) return 0;
  return Math.floor(b / per);
}

/** Philippine mobile number check: 09XXXXXXXXX (11 digits). */
export function validatePhone(v) {
  return /^09\d{9}$/.test(String(v).replace(/[-\s]/g, ''));
}

/** Format pesos for display. */
export function fmt(n) {
  return '₱' + Number(n || 0).toFixed(2);
}
