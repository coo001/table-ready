---
doc: prd
status: draft
---
# Table Ready — Product Requirements

One line: a back-timing planner for a home cook hosting a dinner. Source: `scope.md > The Core Loop`.

## The Core Journey
1. The cook opens the app. One empty dish card is shown (or they press "Load sample dinner").
2. They set "Serve at" (for example 6:30 PM) and the number of burners.
3. They add dishes. Each dish has ordered steps with minutes and a type: hands, oven (with °C), stove, rest.
4. They press "Plan my dinner".
5. The app shows a headline ("Start at 3:50 PM to serve at 6:30 PM"), any warnings, a timeline chart, and a checklist in clock order.
6. They tick off steps as they cook. They can change the menu or serve time and plan again.

## Screens and Layout
One page, two columns. Left: menu editor. Right (appears after planning): headline, warnings, timeline, checklist. On narrow screens the columns stack.

## Look and Feel
Cream background, serif headings, terracotta accent. Step types have fixed colors: hands blue, oven terracotta, stove purple, rest gray. Plain copy, no jargon. Reference: printed recipe cards.

## Features and Behavior
### Menu editor
- As a host, I want to enter dishes and steps so the app knows my menu.
  - [ ] Add/remove dishes and steps.
  - [ ] Oven steps take a temperature; other types disable it.
  - [ ] The menu survives a page reload.
### Planner
- As a host, I want every dish to finish at serve time so everything is hot together.
  - [ ] Every dish's last step ends at serve time, or earlier only when the cook or a burner is busy at serve time; then the plan warns that the dish will be ready early.
  - [ ] Steps of a dish keep their order.
  - [ ] Only one "hands" step at any minute.
  - [ ] Never more simultaneous stove steps than burners.
  - [ ] Oven steps at different temperatures never overlap; same temperature may share the oven.
  - [ ] Make-ahead dishes (long final rest) move earlier before hot dishes do.
  - [ ] If a dish must wait 20+ minutes between steps, show a warning.
### Plan view
- [ ] Headline with the start time and total minutes.
- [ ] Timeline with one row per dish, colored by step type, serve time at the right edge.
- [ ] Checklist sorted by start time with clock time, dish, step, minutes, oven temperature; steps can be checked off.
- [ ] Print shows only the checklist.

## States and Boundaries
- **First use** — one blank dish card, no result panel.
- **Empty menu** — dishes with no steps are ignored.
- **Persistence** — menu, serve time and burners are saved in the browser only; check marks are not saved.

## Product Decisions
[Learner to confirm] These were proposed while planning with the agent; they count as the learner's decisions only after approval.

- Greedy back-scheduling, not an optimal solver — easy to explain and fast; the fuller version would search for the least waiting.
- Oven steps do not need the cook's hands — loading time is ignored to keep the model simple.

## What We're Building
Everything in Features and Behavior above.

## Deferred From the POC
Recipe import, shopping list, timers/notifications, multiple ovens, sharing by link.

## Possible Later Enhancements
Recipe import from a pasted list; a shopping list built from the menu; browser notifications at each start time; a second oven; a shareable plan link.

## Non-Goals
Nutrition, accounts, recipe suggestions, any server or paid API.

## Open Questions
- [Learner to confirm] Approval of this PRD as written (needed before `4-spec` is final).
- [Learner to confirm] Any look-and-feel preference beyond the cream, serif, terracotta recipe-card direction. Can wait.
