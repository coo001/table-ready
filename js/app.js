(function () {
  'use strict';
  var KEY = 'tableready.v1';
  var $ = function (id) { return document.getElementById(id); };
  var state = { serve: '18:30', burners: 2, dishes: [] };

  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.dishes) state = s; } catch (e) {}
    if (!state.dishes.length) state.dishes = [blankDish()];
  }
  function blankDish() { return { name: '', steps: [{ name: '', min: 10, type: 'hands' }] }; }
  function toMin(hhmm) { var p = hhmm.split(':'); return (+p[0]) * 60 + (+p[1]); }

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k]; else if (k.slice(0, 2) === 'on') e[k] = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }

  function renderDishes() {
    var box = $('dishes'); box.innerHTML = '';
    state.dishes.forEach(function (d, di) {
      var card = el('div', { class: 'dish' });
      var top = el('div', { class: 'top' }, [
        el('input', { placeholder: 'Dish name', value: d.name, 'aria-label': 'Dish name', oninput: function (e) { d.name = e.target.value; save(); } }),
        el('button', { class: 'x', title: 'Remove dish', 'aria-label': 'Remove dish', text: '×', onclick: function () { state.dishes.splice(di, 1); if (!state.dishes.length) state.dishes.push(blankDish()); save(); renderDishes(); } })
      ]);
      card.appendChild(top);
      d.steps.forEach(function (s, si) {
        var type = el('select', { 'aria-label': 'Step type', onchange: function (e) { s.type = e.target.value; save(); renderDishes(); } },
          Scheduler.TYPES.map(function (t) { var o = el('option', { value: t, text: t }); if (t === s.type) o.selected = true; return o; }));
        var temp = el('input', { type: 'number', placeholder: '°C', value: s.type === 'oven' ? (s.temp || '') : '', 'aria-label': 'Oven temperature', oninput: function (e) { s.temp = +e.target.value; save(); } });
        if (s.type !== 'oven') temp.disabled = true;
        card.appendChild(el('div', { class: 'step' }, [
          el('input', { placeholder: 'Step', value: s.name, 'aria-label': 'Step name', oninput: function (e) { s.name = e.target.value; save(); } }),
          el('input', { type: 'number', min: 1, value: s.min, 'aria-label': 'Minutes', oninput: function (e) { s.min = Math.max(1, +e.target.value || 1); save(); } }),
          type, temp,
          el('button', { class: 'x', 'aria-label': 'Remove step', text: '×', onclick: function () { d.steps.splice(si, 1); if (!d.steps.length) d.steps.push({ name: '', min: 10, type: 'hands' }); save(); renderDishes(); } })
        ]));
      });
      card.appendChild(el('button', { class: 'ghost mini', type: 'button', text: '+ step', onclick: function () { d.steps.push({ name: '', min: 10, type: 'hands' }); save(); renderDishes(); } }));
      box.appendChild(card);
    });
  }

  function plan() {
    state.serve = $('serve').value || '18:30'; state.burners = Math.max(1, +$('burners').value || 1); save();
    var dishes = state.dishes.map(function (d, i) {
      return { name: d.name.trim() || 'Dish ' + (i + 1), steps: d.steps.filter(function (s) { return s.min > 0; }).map(function (s) {
        return { name: s.name.trim() || 'Step', min: s.min, type: s.type, temp: s.type === 'oven' ? (s.temp || 180) : null };
      }) };
    }).filter(function (d) { return d.steps.length; });
    var input = { serve: toMin(state.serve), burners: state.burners, dishes: dishes };
    var r = Scheduler.plan(input);
    render(input, r);
  }

  function render(input, r) {
    $('result').hidden = false;
    $('headline').textContent = 'Start at ' + Scheduler.fmt(r.startAt) + ' to serve at ' + Scheduler.fmt(r.serve) + ' (' + (r.serve - r.startAt) + ' min total)';
    var w = $('warnings'); w.innerHTML = '';
    r.warnings.forEach(function (t) { w.appendChild(el('div', { class: 'warn', text: t })); });

    var g = $('gantt'); g.innerHTML = '';
    var t0 = Math.floor(r.startAt / 15) * 15, t1 = r.serve, span = t1 - t0, pct = function (m) { return ((m - t0) / span * 100) + '%'; };
    var axis = el('div', { class: 'axis' });
    for (var m = Math.ceil(t0 / 30) * 30; m <= t1; m += 30) axis.appendChild(el('span', { class: 'tick', style: 'left:' + pct(m), text: Scheduler.fmt(m) }));
    g.appendChild(axis);
    var names = []; r.tasks.forEach(function (t) { if (names.indexOf(t.dish) < 0) names.push(t.dish); });
    names.forEach(function (n) {
      var row = el('div', { class: 'g-row' }, [el('span', { class: 'g-label', text: n })]);
      r.tasks.filter(function (t) { return t.dish === n; }).forEach(function (t) {
        row.appendChild(el('div', { class: 'bar ' + t.type, title: t.step + ' ' + Scheduler.fmt(t.start) + '–' + Scheduler.fmt(t.end), style: 'left:' + pct(t.start) + ';width:calc(' + ((t.end - t.start) / span * 100) + '% - 1px)', text: t.step }));
      });
      g.appendChild(row);
    });
    g.appendChild(el('div', { class: 'legend' }, ['hands', 'oven', 'stove', 'rest'].map(function (t) {
      var i = el('i'); i.style.background = 'var(--' + t + ')'; return el('span', {}, [i, document.createTextNode(t)]);
    })));

    var ol = $('checklist'); ol.innerHTML = '';
    r.tasks.forEach(function (t) {
      var cb = el('input', { type: 'checkbox', 'aria-label': 'Done: ' + t.step });
      var li = el('li', {}, [cb, el('span', { class: 't', text: Scheduler.fmt(t.start) }),
        el('span', {}, [document.createTextNode(t.dish + ': ' + t.step + ' (' + t.min + ' min)'), el('div', { class: 'tag', text: t.type === 'oven' ? 'oven at ' + t.temp + '°C' : t.type })])]);
      cb.onchange = function () { li.className = cb.checked ? 'done' : ''; };
      ol.appendChild(li);
    });
  }

  $('addDish').onclick = function () { state.dishes.push(blankDish()); save(); renderDishes(); };
  $('plan').onclick = plan;
  $('print').onclick = function () { window.print(); };
  $('sample').onclick = function () {
    state.dishes = JSON.parse(JSON.stringify(window.SAMPLE)); state.serve = '18:30'; state.burners = 2;
    $('serve').value = state.serve; $('burners').value = state.burners; save(); renderDishes(); plan();
  };
  load(); $('serve').value = state.serve; $('burners').value = state.burners; renderDishes();
})();
