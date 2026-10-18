// Back-scheduler: given a serve time and dishes, place every step so all dishes finish at serve time
// without double-booking the cook's hands, the burners, or the oven temperature.
(function (root) {
  'use strict';
  var TYPES = ['hands', 'oven', 'stove', 'rest'];

  function overlaps(aS, aE, bS, bE) { return aS < bE && bS < aE; }

  // Returns the earliest start of any placed task that blocks [s, e], or null if free.
  function blocker(placed, task, s, e, burners) {
    var hit = null, stoveCount = 0, stoveStarts = [];
    for (var i = 0; i < placed.length; i++) {
      var p = placed[i];
      if (!overlaps(s, e, p.start, p.end)) continue;
      if (task.type === 'hands' && p.type === 'hands') hit = hit === null ? p.start : Math.min(hit, p.start);
      if (task.type === 'oven' && p.type === 'oven' && p.temp !== task.temp) hit = hit === null ? p.start : Math.min(hit, p.start);
      if (task.type === 'stove' && p.type === 'stove') { stoveCount++; stoveStarts.push(p.start); }
    }
    if (task.type === 'stove' && stoveCount >= burners) {
      var m = Math.min.apply(null, stoveStarts);
      hit = hit === null ? m : Math.min(hit, m);
    }
    return hit;
  }

  function plan(input) {
    var serve = input.serve, burners = input.burners || 4, warnings = [];
    var dishes = (input.dishes || []).filter(function (d) { return d.steps && d.steps.length; });
    var total = function (d) { return d.steps.reduce(function (a, s) { return a + s.min; }, 0); };
    // Dishes that must be served hot (short or no final rest) get their ideal slot first;
    // make-ahead dishes (long final rest, like a pie) flex around them.
    var tail = function (d) { var n = 0; for (var i = d.steps.length - 1; i >= 0 && d.steps[i].type === 'rest'; i--) n += d.steps[i].min; return n; };
    var order = dishes.slice().sort(function (a, b) { return tail(a) - tail(b) || total(b) - total(a); });
    var placed = [];
    order.forEach(function (d) {
      var cursor = serve;
      for (var i = d.steps.length - 1; i >= 0; i--) {
        var st = d.steps[i];
        var task = { dish: d.name, step: st.name, type: st.type, temp: st.type === 'oven' ? st.temp : null, min: st.min, stepIndex: i };
        var end = cursor, guard = 0;
        while (guard++ < 5000) {
          var b = blocker(placed, task, end - st.min, end, burners);
          if (b === null) break;
          end = Math.min(end - 1, b);
        }
        task.end = end; task.start = end - st.min;
        placed.push(task);
        cursor = task.start;
      }
    });
    // Waiting time: gap between consecutive steps of the same dish.
    order.forEach(function (d) {
      var mine = placed.filter(function (t) { return t.dish === d.name; }).sort(function (a, b) { return a.start - b.start; });
      for (var i = 1; i < mine.length; i++) {
        var gap = mine[i].start - mine[i - 1].end;
        if (gap >= 20) warnings.push(d.name + ': "' + mine[i - 1].step + '" will wait ' + gap + ' min before "' + mine[i].step + '" because another dish needs the cook, a burner, or the oven.');
      }
    });
    // A dish can finish early when the cook or burners are saturated at serve time; say so.
    order.forEach(function (d) {
      var last = 0;
      placed.forEach(function (t) { if (t.dish === d.name && t.end > last) last = t.end; });
      var early = serve - last;
      if (early >= 5) warnings.push(d.name + ' will be ready ' + early + ' min before serving, because the cook or a burner is busy at serve time.');
    });
    placed.sort(function (a, b) { return a.start - b.start || a.end - b.end; });
    var first = placed.length ? placed[0].start : serve;
    return { tasks: placed, startAt: first, serve: serve, warnings: warnings };
  }

  function fmt(min) {
    var m = ((min % 1440) + 1440) % 1440, h = Math.floor(m / 60), mm = m % 60;
    var ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap;
  }

  // Independent check used by tests: no conflicts, no dish ends after serve time, step order kept.
  function verify(input, result) {
    var errs = [], t = result.tasks, burners = input.burners || 4;
    for (var i = 0; i < t.length; i++) for (var j = i + 1; j < t.length; j++) {
      var a = t[i], b = t[j];
      if (!overlaps(a.start, a.end, b.start, b.end)) continue;
      if (a.type === 'hands' && b.type === 'hands') errs.push('hands overlap: ' + a.dish + '/' + b.dish);
      if (a.type === 'oven' && b.type === 'oven' && a.temp !== b.temp) errs.push('oven temp clash: ' + a.dish + '/' + b.dish);
    }
    t.filter(function (x) { return x.type === 'stove'; }).forEach(function (x) {
      var n = t.filter(function (y) { return y.type === 'stove' && overlaps(x.start, x.end, y.start, y.end); }).length;
      if (n > burners) errs.push('too many burners at ' + x.start);
    });
    (input.dishes || []).forEach(function (d) {
      var mine = t.filter(function (x) { return x.dish === d.name; }).sort(function (a, b) { return a.stepIndex - b.stepIndex; });
      if (mine.length && mine[mine.length - 1].end > input.serve) errs.push(d.name + ' finishes after serve time');
      for (var k = 1; k < mine.length; k++) if (mine[k].start < mine[k - 1].end) errs.push(d.name + ' steps out of order');
    });
    return errs;
  }

  var api = { plan: plan, fmt: fmt, verify: verify, TYPES: TYPES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Scheduler = api;
})(typeof window !== 'undefined' ? window : this);
