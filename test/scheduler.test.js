const assert = require('assert');
const S = require('../js/scheduler.js');
const sample = require('../js/sample.js');
const input = { serve: 18 * 60 + 30, burners: 2, dishes: sample };
const r = S.plan(input);
const errs = S.verify(input, r);
assert.deepStrictEqual(errs, [], errs.join('; '));
assert.ok(r.startAt < input.serve);
// two oven dishes at different temps must not overlap
const ov = r.tasks.filter(t => t.type === 'oven');
for (const a of ov) for (const b of ov) if (a !== b && a.temp !== b.temp) assert.ok(a.end <= b.start || b.end <= a.start);
// same-temp dishes may share the oven
const same = S.plan({ serve: 600, dishes: [
  { name: 'A', steps: [{ name: 'bake', min: 30, type: 'oven', temp: 200 }] },
  { name: 'B', steps: [{ name: 'bake', min: 30, type: 'oven', temp: 200 }] }] });
assert.strictEqual(same.startAt, 570);

// regression: make-ahead pie must not push the hot chicken far earlier (was 95 min)
const chicken = r.tasks.filter(t => t.dish === 'Roast chicken').sort((a, b) => a.start - b.start);
assert.ok(chicken[0].start >= 16 * 60 + 30, 'chicken should start no earlier than 4:30 PM');
// with 2 burners every dish ends exactly at serve time
const dishes = [...new Set(r.tasks.map(t => t.dish))];
for (const d of dishes) assert.strictEqual(Math.max(...r.tasks.filter(t => t.dish === d).map(t => t.end)), input.serve, d + ' must end at serve time');
// step order inside a dish is kept
for (const d of dishes) { const m = r.tasks.filter(t => t.dish === d).sort((a, b) => a.stepIndex - b.stepIndex); for (let i = 1; i < m.length; i++) assert.ok(m[i - 1].end <= m[i].start); }
// one burner: stove steps never overlap
const one = S.plan({ serve: 18 * 60 + 30, burners: 1, dishes: sample });
assert.deepStrictEqual(S.verify({ serve: 18 * 60 + 30, burners: 1, dishes: sample }, one), []);
// with one burner a stove dish may finish early; the plan must say so
assert.ok(one.warnings.some(w => /will be ready \d+ min before serving/.test(w)));
const st = one.tasks.filter(t => t.type === 'stove');
for (const a of st) for (const b of st) if (a !== b) assert.ok(a.end <= b.start || b.end <= a.start);
// empty menu does not crash
assert.ok(S.plan({ serve: 600, dishes: [] }).tasks.length === 0);
console.log('OK: ' + r.tasks.length + ' tasks, start ' + S.fmt(r.startAt) + ', serve ' + S.fmt(input.serve));
