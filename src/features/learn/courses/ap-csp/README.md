# AP Computer Science Principles (`ap-csp`)

- `source_basis`: **ORIGINAL**
- `framework_code`: **AP-CSP**
- `framework_year`: **2020** (public AP CSP Course and Exam Description, effective Fall 2020)
- `status`: **original_course**
- `discipline`: **computer_science**
- Registers with `registerCourseLoader("ap-csp", loadApCspCourse)` from `manifest.ts`.

## Official CED Big Ideas versus shipped units

The Fall 2020 public CED organizes the course around **5** Big Ideas. This namespace ships **all 5**:

| Official Big Idea | Slug | Lessons | Original MC (via lesson or codes) |
| --- | --- | --- | --- |
| Creative Development (CRD) | `creative-development` | 2 | 6 attached + related skeleton items |
| Data (DAT) | `data` | 2 | 4 |
| Algorithms and Programming (AAP) | `algorithms-and-programming` | 2 | 4 attached (+ 2 skeleton items still on the CRD lesson) |
| Computing Systems and Networks (CSN) | `computing-systems-and-networks` | 2 | 4 attached (+ 1 skeleton item with `lessonSlug` null) |
| Impact of Computing (IOC) | `impact-of-computing` | 2 | 4 attached (+ 1 skeleton item with `lessonSlug` null) |

- Official unit count: **5**
- Shipped unit count: **5**
- Lesson count: **10** (2 per unit; existing skeleton lessons kept)
- Question count: **24** original multiple-choice items (existing 10 kept, 14 added)
- Difficulties present: easy, medium, hard
- Tools: practice, quiz, review, notes, readiness

Objective codes in metadata are public CED identifiers only (`CRD-*`, `DAT-*`, `AAP-*`, `CSN-*`, `IOC-*`). CED prose is not reproduced.

All lesson text and questions are original BayAreaClubs teaching material. They are not copied or rewritten from College Board item banks, Unlimited Voices, Stellar Learning, or any other third-party bank. No third-party course assets are committed here.
