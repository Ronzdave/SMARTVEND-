// Build step: validate the captive-portal page and emit the deploy-ready
// single file for the ESP32-S2 LittleFS. Zero dependencies (runs offline).
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_BYTES = 512 * 1024; // LittleFS page budget guard

async function main() {
  const src = join(root, 'index.html');
  const html = await readFile(src, 'utf8');

  const errors = [];
  if (!html.includes('<title>SmartVend</title>')) errors.push('missing <title>SmartVend</title>');
  if (!html.includes('id="shell"')) errors.push('missing app shell (#shell)');
  if (!html.includes('/api/print/start')) errors.push('print API wiring missing');
  const bytes = Buffer.byteLength(html, 'utf8');
  if (bytes > MAX_BYTES) errors.push(`page too large for LittleFS: ${bytes} > ${MAX_BYTES} bytes`);

  // If the pricing module exists (feature branch), confirm the app and the
  // tested source of truth still agree — this is the "confirm existing
  // behavior" check from the agent-dev loop.
  try {
    const { RATE, COLOR_SURCHARGE } = await import('../src/pricing.mjs');
    const short = new RegExp(`SHORT:\\s*${RATE.SHORT}\\b`).test(html);
    const long  = new RegExp(`LONG:\\s*${RATE.LONG}\\b`).test(html);
    const color = new RegExp(`COLOR_SURCHARGE:\\s*${COLOR_SURCHARGE}\\b`).test(html);
    if (!(short && long && color)) errors.push('pricing in index.html drifted from src/pricing.mjs');
  } catch { /* baseline: no pricing module yet */ }

  if (errors.length) {
    console.error('Build FAILED:\n - ' + errors.join('\n - '));
    process.exit(1);
  }

  await mkdir(join(root, 'dist'), { recursive: true });
  await writeFile(join(root, 'dist', 'index.html'), html);
  console.log(`Build OK — ${bytes} bytes -> dist/index.html (LittleFS budget ${MAX_BYTES} bytes)`);
}
main();
