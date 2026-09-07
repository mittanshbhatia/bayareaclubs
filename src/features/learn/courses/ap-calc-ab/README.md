# AP Calculus AB (`ap-calc-ab`)

- `source_basis`: **ORIGINAL**
- `framework_code`: **AP-CALC-AB**
- `framework_year`: **2019** (public AP Calculus AB/BC Course and Exam Description, effective Fall 2019)
- `status`: **original_course**
- `discipline`: **mathematics**

## Official units vs shipped

| | Count |
| --- | --- |
| Official public CED AB units | 8 |
| Shipped units | 8 |
| Lessons (at least 2 per unit) | 16 |
| Original multiple-choice items (at least 4 per unit) | 32 |
| Tools (practice, quiz, review, notes, readiness) | 5 |

Official unit slugs:

1. `limits-and-continuity` — Limits and Continuity
2. `differentiation-definition` — Differentiation: Definition and Fundamental Properties
3. `differentiation-composite` — Differentiation: Composite, Implicit, and Inverse Functions
4. `contextual-differentiation` — Contextual Applications of Differentiation
5. `analytical-differentiation` — Analytical Applications of Differentiation
6. `integration-accumulation` — Integration and Accumulation of Change
7. `differential-equations` — Differential Equations
8. `applications-of-integration` — Applications of Integration

Objective codes in metadata are public CED identifiers only (`LIM-1.A`, `CHA-2.B`, `FUN-4.A`, and siblings). CED prose is not reproduced. No FRQs, Stellar, Unlimited Voices, or other banks. No scraped images.

Loader entry: `loadApCalcAbCourse()` in `manifest.ts`. `toCourseManifest()` matches `CourseManifest` and sets `discipline: "mathematics"`.
