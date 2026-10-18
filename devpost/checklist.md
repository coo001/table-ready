---
doc: checklist
status: draft
---

# Build Checklist

Build mode: fast (the agent built and verified each slice; the learner has not yet tried the app: [Learner to confirm])

## Slices

- [x] **1. A planner that works backwards and never double-books**
  Becomes usable: `Scheduler.plan` turns a serve time and menu into timed steps; `Scheduler.verify` independently checks every rule.
  Why now: The kernel (back-scheduling with real kitchen limits) is the riskiest part, so it comes first.
  PRD ref: `prd.md > Planner`
  Spec ref: `spec.md > Components`
  Build: Pure functions in `js/scheduler.js` and a Node test.
  Verify (mechanical): `node test/scheduler.test.js` prints OK.
  Learner check: Run the test and read the line it prints.
  Commit: `Add back-scheduler and tests`

- [x] **2. Menu editor with the sample dinner and saved menu**
  Becomes usable: Add dishes and steps, load the sample, reload the page and keep the menu.
  Why now: Gives the planner real input.
  PRD ref: `prd.md > Menu editor`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Data Model`
  Build: `index.html`, `style.css`, `js/app.js`, `js/sample.js`, localStorage key `tableready.v1`.
  Verify (mechanical): Open the page, press Load sample dinner, reload, menu is still there.
  Learner check: Open the app and add your own dish.
  Commit: `Add menu editor`

- [x] **3. Timeline, checklist, warnings, print**
  Becomes usable: Press Plan my dinner and see the headline, timeline chart, clock-time checklist and warnings; print shows the checklist only.
  Why now: This is the "oh, that's cool" moment.
  PRD ref: `prd.md > Plan view`
  Spec ref: `spec.md > Components`
  Build: Rendering code in `js/app.js` and print styles.
  Verify (mechanical): Sample menu at 6:30 PM shows "Start at 3:50 PM".
  Learner check: Plan the sample dinner and tick off steps.
  Commit: `Add plan view`

- [x] **4. Hot dishes before make-ahead dishes**
  Becomes usable: A pie that can rest no longer pushes the chicken 95 minutes early.
  Why now: Found while reviewing the first run.
  PRD ref: `prd.md > Planner` (make-ahead criterion)
  Spec ref: `spec.md > Components > Scheduler`
  Build: Order dishes by trailing rest time.
  Verify (mechanical): `node test/scheduler.test.js` passes; sample start is 3:50 PM.
  Learner check: Plan the sample and confirm the chicken starts at 4:50 PM.
  Commit: `Order hot dishes before make-ahead dishes`

## Hands-on Checkpoints

- [ ] Early usable behavior explored: [Learner to confirm: the learner has not yet tried slice 2-3 themselves]
- [ ] Final kick-the-tires exploration and feedback completed: [Learner to confirm]

## Final Review

- [ ] Final review complete: the agent ran the app in a browser and recorded the demo video from it; the learner's own review and readiness confirmation are still needed.

## Code Tour and App Map

- [ ] Learning activity complete: not done interactively; a static route is in `app-map.html`. [Learner to confirm]
- [ ] Optional edit and transfer reflection addressed: not offered yet.
- [x] `devpost/app-map.html` generated from finished code (static), including a practice to reuse.

Activity and evidence: static recap only.
Route and stops: `index.html` -> `js/app.js` `plan()` -> `js/scheduler.js` `plan`, `verify`.
Edit outcome: not applicable.
Reflection: not offered (personal answers belong in the ignored learner profile).
Activity mode: recap

## Revisions

- Hot dishes are scheduled before make-ahead dishes: the first version put the chicken 95 minutes early because the pie claimed the oven first.
- With one burner a stove dish cannot also end at serve time; the strict "every dish ends at serve time" check failed in a new test. The planner now warns "will be ready N min before serving" and `verify` only rejects dishes that finish after serve time. PRD criterion reworded.
