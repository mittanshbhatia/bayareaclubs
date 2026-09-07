# AP Computer Science A (`ap-csa`)

- `source_basis`: **ORIGINAL**
- `framework_code`: **AP-CSA**
- `framework_year`: **2025** (public Fall 2025 CED identifiers only)
- `status`: **original_course**
- Official public units: **4**
- Shipped units: **4**
- Lessons: **8** (2 per official unit)
- Questions: **23** original multiple-choice items
- Tools: practice, quiz, review, notes, readiness

Official units shipped:

1. `using-objects-and-methods` — Using Objects and Methods (includes the original Java foundations lessons)
2. `selection-and-iteration` — Selection and Iteration
3. `class-creation` — Class Creation
4. `data-collections` — Data Collections

Objective codes in metadata are public CED identifiers only (for example `1.3.C`, `2.8.A`, `4.8.A`). CED prose is not reproduced. Inheritance is omitted because it is outside the Fall 2025 public CED. Recursion appears only as tracing.

All lesson text and questions are original BayAreaClubs teaching material. They are not copied or rewritten from College Board item banks, Unlimited Voices, Stellar Learning, or any other third-party bank. No Stellar assets are committed in this namespace.

`loadApCsaCourse()` in `manifest.ts` returns `{ manifest, lessons, questions, tools }`. Lesson bodies live in `content.ts`. Items live in `questions.ts`. Tools live in `tools.ts`. Overview copy lives in `overview.ts`. Course art lives in `card.tsx`.
