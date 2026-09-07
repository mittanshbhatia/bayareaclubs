/**
 * Original BayAreaClubs multiple-choice items for AP Precalculus.
 * Written from scratch. Not derived from College Board, Stellar,
 * Unlimited Voices, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_PRECALC_NAMESPACE,
  AP_PRECALC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-precalc/manifest";

export type ApPrecalcChoiceId = "a" | "b" | "c" | "d";

export type ApPrecalcChoice = {
  id: ApPrecalcChoiceId;
  text: string;
};

export type ApPrecalcDifficulty = "easy" | "medium" | "hard";

export type ApPrecalcQuestion = {
  namespace: typeof AP_PRECALC_NAMESPACE;
  slug: string;
  lessonSlug: string;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApPrecalcChoice, ApPrecalcChoice, ApPrecalcChoice, ApPrecalcChoice];
  answerId: ApPrecalcChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApPrecalcDifficulty;
  sourceBasis: typeof AP_PRECALC_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApPrecalcQuestion[] = [
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "bake-sale-average-rate",
    lessonSlug: "change-rates-and-polynomial-shape",
    questionType: "multiple_choice",
    prompt:
      "Lincoln High Bake Sale Club models profit with f(x) = x^2 dollars when the price mark is x. What is the average rate of change of f from x = 1 to x = 3?",
    choices: [
      { id: "a", text: "2 dollars per mark" },
      { id: "b", text: "4 dollars per mark" },
      { id: "c", text: "8 dollars per mark" },
      { id: "d", text: "9 dollars per mark" },
    ],
    answerId: "b",
    explanation:
      "Average rate of change is (f(3) − f(1)) / (3 − 1) = (9 − 1) / 2 = 4.",
    objectiveCodes: ["1.2.A"],
    difficulty: "easy",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "cubic-end-behavior",
    lessonSlug: "change-rates-and-polynomial-shape",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Robotics fits remaining charge with f(x) = −2x^3 + 5x. Which statement matches the end behavior of f?",
    choices: [
      {
        id: "a",
        text: "As x → ∞, f(x) → ∞, and as x → −∞, f(x) → −∞.",
      },
      {
        id: "b",
        text: "As x → ∞, f(x) → −∞, and as x → −∞, f(x) → ∞.",
      },
      {
        id: "c",
        text: "As |x| → ∞, f(x) → 0 from both sides.",
      },
      {
        id: "d",
        text: "As |x| → ∞, f(x) → 5 from both sides.",
      },
    ],
    answerId: "b",
    explanation:
      "The leading term is −2x^3. Odd degree with a negative leading coefficient sends the graph down on the right and up on the left.",
    objectiveCodes: ["1.6.A"],
    difficulty: "medium",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "canceled-factor-hole",
    lessonSlug: "rational-graphs-zeros-and-holes",
    questionType: "multiple_choice",
    prompt:
      "East Bay Carpool simplifies a cost model to f(x) = (x^2 − 1) / (x − 1) for x ≠ 1. What feature does the graph have at x = 1?",
    choices: [
      { id: "a", text: "A vertical asymptote only" },
      { id: "b", text: "A hole, because the factor x − 1 cancels" },
      { id: "c", text: "A zero of multiplicity two" },
      { id: "d", text: "A horizontal asymptote y = 1" },
    ],
    answerId: "b",
    explanation:
      "x^2 − 1 = (x − 1)(x + 1), so the (x − 1) factor cancels for x ≠ 1. The graph matches y = x + 1 with a hole at x = 1, not a vertical asymptote.",
    objectiveCodes: ["1.10.A"],
    difficulty: "medium",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "matching-degree-horizontal",
    lessonSlug: "rational-graphs-zeros-and-holes",
    questionType: "multiple_choice",
    prompt:
      "A club writes r(x) = (3x^2 + 1) / (x^2 − 4). What is the horizontal asymptote?",
    choices: [
      { id: "a", text: "y = 0" },
      { id: "b", text: "y = 3" },
      { id: "c", text: "y = 1/3" },
      { id: "d", text: "There is no horizontal asymptote." },
    ],
    answerId: "b",
    explanation:
      "Numerator and denominator have equal degree, so the horizontal asymptote is the ratio of leading coefficients, 3/1 = 3.",
    objectiveCodes: ["1.7.A"],
    difficulty: "hard",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "compost-geometric-next",
    lessonSlug: "exponential-change-and-log-inverses",
    questionType: "multiple_choice",
    prompt:
      "Mission Compost Club records weekly masses 4 kg, 12 kg, and 36 kg. If the list is geometric, what is the next mass?",
    choices: [
      { id: "a", text: "60 kg" },
      { id: "b", text: "72 kg" },
      { id: "c", text: "108 kg" },
      { id: "d", text: "144 kg" },
    ],
    answerId: "c",
    explanation:
      "Each term is multiplied by 3. The next term is 36 · 3 = 108. Adding 24 would treat the list as arithmetic.",
    objectiveCodes: ["2.1.A"],
    difficulty: "easy",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "exponential-evaluation",
    lessonSlug: "exponential-change-and-log-inverses",
    questionType: "multiple_choice",
    prompt:
      "A fundraising model is f(x) = 5 · 2^x dollars after x doubling periods. What is f(3)?",
    choices: [
      { id: "a", text: "15" },
      { id: "b", text: "30" },
      { id: "c", text: "40" },
      { id: "d", text: "80" },
    ],
    answerId: "c",
    explanation: "f(3) = 5 · 2^3 = 5 · 8 = 40.",
    objectiveCodes: ["2.3.A", "2.3.B"],
    difficulty: "medium",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "log-base-two-of-thirty-two",
    lessonSlug: "exponential-change-and-log-inverses",
    questionType: "multiple_choice",
    prompt:
      "Which equation is equivalent to log_2(32) = 5?",
    choices: [
      { id: "a", text: "2^5 = 32" },
      { id: "b", text: "5^2 = 32" },
      { id: "c", text: "32^2 = 5" },
      { id: "d", text: "2^32 = 5" },
    ],
    answerId: "a",
    explanation:
      "By definition, log_b(y) = x means b^x = y. Here b = 2, y = 32, and x = 5.",
    objectiveCodes: ["2.9.A"],
    difficulty: "medium",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "semi-log-linear-test",
    lessonSlug: "composition-equations-and-semi-log",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Astronomy Club plots log(brightness) against night number and the points sit near a straight line. Which model for brightness versus night is the best first candidate?",
    choices: [
      { id: "a", text: "A linear model, because the raw brightness values must form a line." },
      { id: "b", text: "An exponential model, because a semi-log plot that is linear matches constant multiplicative change." },
      { id: "c", text: "A quadratic model, because logs always produce parabolas." },
      { id: "d", text: "No model is possible until the club switches to a polar plot." },
    ],
    answerId: "b",
    explanation:
      "A linear pattern in log(y) versus x is the semi-log signature of y = a · b^x. It does not force the raw y-values to be linear.",
    objectiveCodes: ["2.15.A"],
    difficulty: "hard",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "sine-fundamental-period",
    lessonSlug: "periodic-sine-and-transforms",
    questionType: "multiple_choice",
    prompt:
      "Alameda Sailing Club uses y = sin(x) as a first tide sketch, with x in radians. What is the fundamental period of this parent function?",
    choices: [
      { id: "a", text: "π" },
      { id: "b", text: "2π" },
      { id: "c", text: "1" },
      { id: "d", text: "π/2" },
    ],
    answerId: "b",
    explanation:
      "Sine repeats every 2π radians. π is a half-turn and does not complete the full wave.",
    objectiveCodes: ["3.1.A"],
    difficulty: "easy",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "sine-amplitude-and-period",
    lessonSlug: "periodic-sine-and-transforms",
    questionType: "multiple_choice",
    prompt:
      "A daylight model is y = 4 sin(2x). What are the amplitude and the period?",
    choices: [
      { id: "a", text: "Amplitude 4 and period π" },
      { id: "b", text: "Amplitude 4 and period 2π" },
      { id: "c", text: "Amplitude 2 and period π" },
      { id: "d", text: "Amplitude 2 and period 4" },
    ],
    answerId: "a",
    explanation:
      "Amplitude is |4| = 4. Period is 2π / |2| = π.",
    objectiveCodes: ["3.4.A", "3.5.A"],
    difficulty: "medium",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "polar-to-rectangular-point",
    lessonSlug: "polar-graphs-and-polar-rates",
    questionType: "multiple_choice",
    prompt:
      "A robotics lidar returns the polar point (r, θ) = (2, π/3). What is the matching rectangular point (x, y)?",
    choices: [
      { id: "a", text: "(1, √3)" },
      { id: "b", text: "(√3, 1)" },
      { id: "c", text: "(2, 2)" },
      { id: "d", text: "(0, 2)" },
    ],
    answerId: "a",
    explanation:
      "x = r cos θ = 2 cos(π/3) = 2 · 1/2 = 1, and y = r sin θ = 2 sin(π/3) = 2 · √3/2 = √3.",
    objectiveCodes: ["3.13.A"],
    difficulty: "medium",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "tide-midline-and-phase",
    lessonSlug: "periodic-sine-and-transforms",
    questionType: "multiple_choice",
    prompt:
      "A tide model is h(x) = 3 + 2 cos(x − π/2). Which reading is correct?",
    choices: [
      {
        id: "a",
        text: "Midline 2, amplitude 3, and a shift π/2 left.",
      },
      {
        id: "b",
        text: "Midline 3, amplitude 2, and a shift π/2 right.",
      },
      {
        id: "c",
        text: "Midline 3, amplitude 2, and period π/2.",
      },
      {
        id: "d",
        text: "Midline 5, amplitude 1, and no horizontal shift.",
      },
    ],
    answerId: "b",
    explanation:
      "D = 3 is the midline, |A| = 2 is the amplitude, and (x − π/2) shifts the cosine peak right by π/2. The period is still 2π.",
    objectiveCodes: ["3.5.A"],
    difficulty: "hard",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "drone-parametric-point",
    lessonSlug: "parametric-motion-in-the-plane",
    questionType: "multiple_choice",
    prompt:
      "Mission Drone Club flies x(t) = 2t and y(t) = t + 1, with t in seconds. Where is the craft at t = 3?",
    choices: [
      { id: "a", text: "(3, 4)" },
      { id: "b", text: "(5, 4)" },
      { id: "c", text: "(6, 4)" },
      { id: "d", text: "(6, 3)" },
    ],
    answerId: "c",
    explanation: "x(3) = 6 and y(3) = 4, so the point is (6, 4).",
    objectiveCodes: ["4.1.A"],
    difficulty: "easy",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "vector-magnitude-three-four",
    lessonSlug: "vectors-and-matrix-functions",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Theater Club records a lighting move as the vector (3, 4) meters. What is the magnitude of that vector?",
    choices: [
      { id: "a", text: "3" },
      { id: "b", text: "4" },
      { id: "c", text: "5" },
      { id: "d", text: "7" },
    ],
    answerId: "c",
    explanation: "Magnitude is √(3^2 + 4^2) = √(9 + 16) = √25 = 5.",
    objectiveCodes: ["4.8.A"],
    difficulty: "medium",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "diagonal-matrix-action",
    lessonSlug: "vectors-and-matrix-functions",
    questionType: "multiple_choice",
    prompt:
      "A graphics club applies M = [[2, 0], [0, 3]] to the vector (1, 1). What output vector does M produce?",
    choices: [
      { id: "a", text: "(1, 1)" },
      { id: "b", text: "(2, 3)" },
      { id: "c", text: "(3, 2)" },
      { id: "d", text: "(2, 0)" },
    ],
    answerId: "b",
    explanation:
      "The product is (2 · 1 + 0 · 1, 0 · 1 + 3 · 1) = (2, 3). A diagonal matrix scales each axis separately.",
    objectiveCodes: ["4.13.A"],
    difficulty: "medium",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    slug: "two-by-two-determinant",
    lessonSlug: "vectors-and-matrix-functions",
    questionType: "multiple_choice",
    prompt:
      "Stage coordinates are transformed by A = [[2, 1], [4, 3]]. What is det(A), and is A invertible?",
    choices: [
      { id: "a", text: "det(A) = 2, so A is invertible." },
      { id: "b", text: "det(A) = 10, so A is invertible." },
      { id: "c", text: "det(A) = 0, so A is not invertible." },
      { id: "d", text: "det(A) = −2, so A is not invertible." },
    ],
    answerId: "a",
    explanation:
      "det([[a, b], [c, d]]) = ad − bc = 2 · 3 − 1 · 4 = 2. A nonzero determinant means a unique inverse exists.",
    objectiveCodes: ["4.11.A"],
    difficulty: "hard",
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    version: 1,
  },
];

export default questions;
