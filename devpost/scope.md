---
doc: scope
status: draft
---
# Table Ready

One line: a small web app that works backwards from the time dinner is served and tells you exactly when to start every step so all dishes are hot at the same minute.

## The Unique Kernel
Back-scheduling with real kitchen limits. Most recipe apps give one dish a timeline. Table Ready plans a whole menu at once and respects the three things that actually collide: one cook (hands), a limited number of burners, and one oven that can only be at one temperature. If the pie needs 180°C and the chicken 200°C, the plan moves the pie earlier instead of pretending both fit.

## Who It's For
A home cook hosting 4 to 8 people for a holiday or birthday dinner, who today keeps a paper list and a phone timer and still ends up with cold potatoes and a rushed gravy.

## The Core Loop
Open the app, set the serve time, list dishes with their steps, press "Plan my dinner", follow the checklist from the first clock time to the last. Change the menu or the serve time and plan again. They come back for every dinner they host.

## Inspiration & Identity
Warm, printed-recipe-card feel: cream background, serif headings, one terracotta accent. Calm and readable at arm's length in a kitchen. Reference for the idea: the "work backwards from serving time" habit in professional kitchens (mise en place and back-timing). No other URLs referenced.

## Why This Matters to the Learner
[Learner to confirm: personal reason for choosing this idea, in the learner's own words.] Hosting a meal is a small, concrete planning problem that fits this hackathon's theme of planning before building.

## What "Working" Looks Like
Load a five-dish menu, press Plan, and see a timeline plus a checklist beginning at 3:50 PM for a 6:30 PM dinner. The "oh, that's cool" beat: the apple pie (180°C) is automatically scheduled before the chicken (200°C), while the potatoes (also 200°C) share the oven with the chicken.

## The POC Boundary
- Serve time, burner count, any number of dishes, each with ordered steps (name, minutes, type, oven temperature).
- Four step types: hands, oven, stove, rest.
- One plan: timeline chart, checklist with clock times, warnings when a dish has to wait.
- Saved in the browser (localStorage). Print the checklist.

## Later
Recipe import, multiple ovens, shopping list, push reminders, sharing a plan by link.

## Explicitly Cut
- Accounts and sync: no server, no cost, not needed to prove the kernel.
- Recipe database: users type their own steps.
- Timers and notifications: the checklist with clock times is enough for the POC.
