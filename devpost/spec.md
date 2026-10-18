---
doc: spec
status: draft
---
# Table Ready — Technical Spec

## How This Works, In Plain Language
A single web page. A small planner function takes the serve time and the menu and returns a list of timed steps. The page draws that list as a chart and a checklist. Nothing is sent anywhere.

## The Core Journey Through the System
The cook edits the menu → `js/app.js` keeps it in a state object and saves it to localStorage → "Plan my dinner" converts it to minutes and calls `Scheduler.plan` → the planner places steps backwards from serve time → `app.js` renders the headline, warnings, chart and checklist. PRD ref: `prd.md > The Core Journey`.

## Stack
Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies. Tests run on Node's built-in `assert`. Rationale: free to run, works offline, nothing to deploy.

## Where It Runs and How Someone Tries It
In any modern browser. Start: `python3 -m http.server 8000` in `app/`, open http://localhost:8000 (double-clicking `index.html` also works). Requires a modern browser and, for tests only, Node 18+. Press "Load sample dinner" then "Plan my dinner" for the demo. Tests: `node test/scheduler.test.js`. No API keys.
Required for submission: a short demo video and a public GitHub repository. Deployment is not used (a static site; not needed).

## Look and Feel
Carried from `prd.md > Look and Feel`. Warm recipe-card feel: cream (#fbf6ee) background, Georgia serif headings, system-ui for controls, one terracotta (#c2410c) accent, step-type colors hands blue / oven terracotta / stove purple / rest gray. Spacious, readable at arm's length, plain copy. Plain CSS can honor all of this; nothing is constrained by the stack.

## Components
### Scheduler (`js/scheduler.js`)
Pure function `plan({serve, burners, dishes})`. Orders dishes (hot dishes first, make-ahead dishes after), then for each dish places steps from last to first; if a step collides, it slides earlier to just before the blocking step. `verify` independently re-checks every rule. PRD ref: `prd.md > Planner`.
### Page (`index.html`, `style.css`, `js/app.js`)
Menu editor, chart, checklist, print styles. PRD ref: `prd.md > Menu editor`, `Plan view`.
### Sample menu (`js/sample.js`)
Five dishes with one oven-temperature conflict.

## Data Model
`state = {serve:'HH:MM', burners:n, dishes:[{name, steps:[{name, min, type, temp}]}]}` in localStorage key `tableready.v1`. Plan results are recomputed, never stored.

## File Structure
```
app/
├── index.html
├── style.css
├── js/ scheduler.js, sample.js, app.js
├── test/scheduler.test.js       # Node assert tests
├── LICENSE, README.md
└── devpost/ scope.md, prd.md, spec.md, checklist.md, app-map.html   # learner-profile.md is local only (gitignored)
```

## External Services and Dependencies
None.

## Important Failure Modes
- **Impossible menu (very long chain)** → plan just starts earlier, possibly the previous day; the headline shows total minutes.
- **Dish forced to wait** → warning names the dish and the wait.
- **localStorage blocked** → app works, nothing is remembered.

## What Was Simplified and Why
- **Greedy scheduler** instead of an optimal solver — simple to explain; optimal would search all orders.
- **Hands-free oven steps** instead of modeling loading time.

## Decisions and Open Issues
- **Plain HTML/CSS/JS, no framework** — proposed by the agent because it is free, offline and needs no deploy. Tradeoff: more manual DOM code. [Learner to confirm]
- **Greedy back-scheduling** — proposed by the agent; explainable in one sentence. Tradeoff: not the globally shortest plan.
- **Hot dishes first, make-ahead dishes flex** — found during the build: the first version moved the chicken 95 minutes early because the pie (180 C) claimed the oven first. Fixed by ordering dishes by their trailing rest time. Evidence: `test/scheduler.test.js`.
- **Learner uncertainty:** none was recorded in a planning interview. [Learner to confirm: one thing that was unclear or new while building, if any.]
- **Open:** learner approval of scope, PRD and this spec; repository URL and demo video URL are added after the learner publishes them (sharing: public GitHub repo plus a public YouTube/Vimeo link).
