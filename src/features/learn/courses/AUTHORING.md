# AP course authoring contract

Each namespace owns only `src/features/learn/courses/<namespace>/`.
Do not edit `loader.ts`, `registry.ts`, `from-loader.ts`, shared UI, migrations, or other namespaces.

## Required files

- `manifest.ts` — units ≥ official public AP CED unit list; `sourceBasis: "ORIGINAL"`; `status: "original_course"`
- `content.ts` — original `bodyPlain` lessons (no HTML). Split into `units/*.ts` if needed and re-export.
- `questions.ts` — original multiple-choice items, multiple difficulties
- `tools.ts` — practice, quiz, review, notes, readiness (BayAreaClubs tools, not cloned chrome)
- `card.tsx` — original geometric SVG hero (`viewBox="0 0 640 400"`, 16:10). Use `--course-accent`, `--primary`, `--accent`. No photos, no third-party art.
- `overview.ts` — short original course overview (plain text)
- `README.md` — source_basis, CED year, official unit count vs shipped, question count
- `content.test.ts` — Vitest: ORIGINAL, unit count, unique slugs, 4 choices, valid answers, no HTML, all 5 tools

## Types

Match `LoaderLesson` / `LoaderQuestion` / `CourseTool` in `types.ts`.
`load<Name>Course()` must return `{ manifest, lessons, questions, tools }`.

## Copyright

`source_basis=ORIGINAL`. Public CED **codes** only — never CED prose, FRQs, or item banks.
Never copy Stellar, Unlimited Voices, College Board samples, or other banks.
No scraped images. No secrets. No AI auto-publish.

## Quality

- ≥ 2 original lessons per official unit
- ≥ 4 original questions per unit (easy / medium / hard present in the course)
- Lesson text is real teaching prose (3–6 paragraphs), not placeholders
- Questions use Bay Area club/school scenarios when natural
- `objectiveCodes` are public dotted CED identifiers only

## Card + tool rhythm (measurements only)

Public catalog recording did not yield course-card pixels (login wall). Use these BAC specs:

- Card media 16:10 (`viewBox="0 0 640 400"`)
- Chip row 40px tall
- Card body padding 20px
- Hierarchy: media → title → one status → one action
- Tool kinds to ship: practice, quiz, review, notes, readiness
- Do not clone video / ask-a-tutor / exam-calculator chrome
- Peninsula green `#0f5c44` and teal `#086874` only — no purple gradients
