// Baseline smoke test — confirms the app shell and key screens exist.
// Runs with the built-in runner: `npm test` (node --test). No dependencies.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(join(root, 'index.html'), 'utf8');

test('page has the SmartVend title', () => {
  assert.match(html, /<title>SmartVend<\/title>/);
});

test('student + admin portals are present', () => {
  assert.match(html, /id="portal-screen"/);
  assert.match(html, /id="sc-admin-login"/);
});

test('print flow screens exist', () => {
  for (const id of ['sc-rfid', 'sc-upload', 'sc-pages', 'sc-options', 'sc-printing', 'sc-done']) {
    assert.ok(html.includes(`id="${id}"`), `missing screen ${id}`);
  }
});
