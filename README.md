# Table Ready

Tell it when dinner is served and list your dishes. It works backwards and tells you when to start every step so everything is hot at the same minute. It respects one cook, a limited number of burners, and one oven temperature at a time.

For: a home cook hosting 4 to 8 people (holiday or birthday dinner) who now juggles a paper list and a phone timer.

## Try it
```
python3 -m http.server 8000     # then open http://localhost:8000
```
(Opening `index.html` directly also works.) Press **Load sample dinner**, then **Plan my dinner**. Sample: 6:30 PM dinner, 5 dishes, plan starts at 3:50 PM; the 180°C pie is moved ahead of the 200°C chicken and potatoes.

## Test
```
node test/scheduler.test.js     # Node 18+, no install
```
Checks: no double-booked hands, burners or oven temperature, step order, no dish after serve time, hot dishes not pushed hours early, one-burner case, empty menu.

## How it works
`index.html` + `js/app.js` (menu editor, rendering, localStorage) -> `js/scheduler.js` (`plan`, `verify`). No dependencies, no server, no API keys, nothing is sent anywhere. Map: `devpost/app-map.html`.

Limits (proof of concept): greedy planner (not the shortest possible plan), oven steps do not need your hands, one oven, a dish may be ready early when burners or hands are busy (the plan warns).

## Built for Devpost "Build With AI: Basics"
Started from an empty folder during the submission period using the Devpost Learn Skill Pack (`npx skills add challengepost/learn-ai-basics --all -y`, installed in `.agents/skills`, pinned in `skills-lock.json`) and an AI coding agent (Claude). Planning documents: `devpost/scope.md`, `devpost/prd.md`, `devpost/spec.md`, `devpost/checklist.md`.

## License
MIT, see `LICENSE`.
