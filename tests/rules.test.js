// Run from the repo root: node --test
// Expected values are worked out by hand from each firm's published rule, not copied from the code.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const rulesFile = path.join(root, 'supabase/functions/_shared/rules.js');
require(rulesFile);
const R = globalThis.FTRules;

const account = (programId, capital, trades) => ({
  id: 'test', capital, status: 'Challenge', phase: 1,
  ruleSnapshot: R.profile(programId), phases: [{ trades }],
});
const trade = (date, pnl) => ({ date, pnl, result: pnl >= 0 ? 'Win' : 'Loss', asset: 'EURUSD' });

test('FundedNext Stellar 2-Step $6,000: daily 5% of initial capital from the day-start balance', () => {
  const a = account('fn-stellar-2', 6000, [trade('2026-10-08', 500), trade('2026-10-09', -150), trade('2026-10-09', 100)]);
  const r = R.risk(a, '2026-10-09');
  // Day starts at 6,500; budget 5% x 6,000 = 300; floor 6,200; balance 6,450.
  assert.equal(r.balance, 6450);
  assert.equal(r.dailyBudget, 300);
  assert.equal(r.dailyFloor, 6200);
  assert.equal(r.dailyRemaining, 250);
  // Static max loss 10%: floor 5,400.
  assert.equal(r.floor, 5400);
  assert.equal(r.maxRemaining, 1050);
  assert.equal(r.breached, false);
});

test('FundedNext: touching the daily floor exactly counts as a breach', () => {
  const a = account('fn-stellar-2', 6000, [trade('2026-10-08', 500), trade('2026-10-09', -300)]);
  const r = R.risk(a, '2026-10-09');
  assert.equal(r.dailyRemaining, 0);
  assert.equal(r.breached, true);
});

test('FundingPips 2-Step Standard $10,000: daily 5% of the day-opening high', () => {
  const a = account('fp-2-standard', 10000, [trade('2026-10-08', 1000), trade('2026-10-09', -200)]);
  const r = R.risk(a, '2026-10-09');
  // Opening 11,000; budget 5% x 11,000 = 550; floor 10,450; balance 10,800.
  assert.equal(r.dailyBudget, 550);
  assert.equal(r.dailyFloor, 10450);
  assert.equal(r.dailyRemaining, 350);
  assert.equal(r.floor, 9000);
});

test('FTMO 1-Step $10,000: max loss trails the highest end-of-day balance', () => {
  const a = account('ftmo-1-standard', 10000, [trade('2026-10-07', 1000), trade('2026-10-08', -200)]);
  const r = R.risk(a, '2026-10-09');
  // Best close 11,000 -> floor 10,000. Day starts at 10,800; daily 3% x 10,000 = 300 -> 10,500.
  assert.equal(r.balance, 10800);
  assert.equal(r.floor, 10000);
  assert.equal(r.maxRemaining, 800);
  assert.equal(r.dailyFloor, 10500);
  assert.equal(r.dailyRemaining, 300);
});

test('FTMO 1-Step: yesterday\'s close already raises today\'s floor', () => {
  const a = account('ftmo-1-standard', 10000, [trade('2026-10-07', 500), trade('2026-10-08', 500)]);
  // Closes 10,500 then 11,000 -> floor today is 11,000 - 1,000 = 10,000.
  assert.equal(R.risk(a, '2026-10-09').floor, 10000);
});

test('the browser copy (js/17-ft-rules-catalogue-v56.js) is the same rules code as the server copy', () => {
  const browser = fs.readFileSync(path.join(root, 'js/17-ft-rules-catalogue-v56.js'), 'utf8').trim();
  const server = fs.readFileSync(rulesFile, 'utf8').trim();
  assert.equal(browser.replace('window.FTRules=', 'globalThis.FTRules='), server);
});
