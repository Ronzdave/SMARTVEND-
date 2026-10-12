// Unit tests for the pricing module. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { computeCost, affordablePages, validatePhone, fmt, RATE, COLOR_SURCHARGE } from '../src/pricing.mjs';

test('short bond, B&W, 1 copy', () => {
  assert.equal(computeCost({ pages: 3, paper: 'SHORT', mode: 'BW', copies: 1 }), 6);
});

test('long bond, B&W, 2 copies', () => {
  assert.equal(computeCost({ pages: 5, paper: 'LONG', mode: 'BW', copies: 2 }), 30);
});

test('color adds the surcharge per page', () => {
  // short bond color = (2 + 1) * pages
  assert.equal(computeCost({ pages: 4, paper: 'SHORT', mode: 'COLOR', copies: 1 }), 12);
});

test('accepts an array of selected pages', () => {
  assert.equal(computeCost({ pages: [1, 3, 5], paper: 'LONG', mode: 'BW', copies: 1 }), 9);
});

test('rejects an unknown paper size', () => {
  assert.throws(() => computeCost({ pages: 1, paper: 'A4', mode: 'BW', copies: 1 }));
});

test('rejects invalid copies', () => {
  assert.throws(() => computeCost({ pages: 1, paper: 'SHORT', mode: 'BW', copies: 0 }));
});

test('affordablePages uses the cheapest rate and floors', () => {
  assert.equal(affordablePages(150), 75);  // 150 / 2
  assert.equal(affordablePages(9), 4);      // floor(9/2)
  assert.equal(affordablePages(0), 0);
  assert.equal(affordablePages(-5), 0);
});

test('phone validation accepts 09XXXXXXXXX and rejects others', () => {
  assert.ok(validatePhone('09171234567'));
  assert.ok(validatePhone('0917-123-4567'));
  assert.ok(!validatePhone('12345'));
  assert.ok(!validatePhone('9171234567'));
});

test('fmt renders pesos with two decimals', () => {
  assert.equal(fmt(150), '₱150.00');
  assert.equal(fmt(), '₱0.00');
});

test('rate constants are the agreed prices', () => {
  assert.equal(RATE.SHORT, 2);
  assert.equal(RATE.LONG, 3);
  assert.equal(COLOR_SURCHARGE, 1);
});
