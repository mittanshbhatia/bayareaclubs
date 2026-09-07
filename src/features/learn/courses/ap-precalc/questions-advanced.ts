/**
 * Advanced original AP Precalculus items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "rational-hole-vs-asymptote",
    lessonSlug: "rational-graphs-zeros-and-holes",
    prompt:
      "A bake-sale profit model is p(x) = (x^2 - 9)/(x - 3) dollars at mark x. What happens at x = 3?",
    choices: [
      "A vertical asymptote because the denominator is zero.",
      "A hole: the factor x - 3 cancels, and the simplified value is 6.",
      "The function equals 0 at x = 3.",
      "End behavior is the only issue at x = 3.",
    ],
    answer: "b",
    explanation:
      "x^2 - 9 = (x - 3)(x + 3). For x ≠ 3 the model is x + 3. The missing point is a hole at (3, 6), not a vertical asymptote.",
    codes: ["1.7.A", "1.10.A"],
  }),
  originalItem({
    slug: "average-rate-not-instant",
    lessonSlug: "change-rates-and-polynomial-shape",
    prompt:
      "f(x) = x^2 on the price mark. Average rate of change from 2 to 5 is which value?",
    choices: ["3", "7", "9", "14"],
    answer: "b",
    explanation:
      "(f(5) - f(2)) / (5 - 2) = (25 - 4) / 3 = 7. 2x at a point would be an instantaneous rate, which this course treats later as a slope of a tangent, not this average.",
    codes: ["1.3.A"],
  }),
  originalItem({
    slug: "log-undo-exponential",
    lessonSlug: "exponential-change-and-log-inverses",
    prompt:
      "A club fund is modeled by A = 400 * 2^(t/3). When is A first 3200?",
    choices: ["t = 3", "t = 6", "t = 9", "t = 12"],
    answer: "c",
    explanation:
      "3200 = 400 * 2^(t/3) → 8 = 2^(t/3) → t/3 = 3 → t = 9. Logs are the undo of the exponential, but here the power of two is already visible.",
    codes: ["2.4.A", "2.8.A"],
  }),
  originalItem({
    slug: "sinusoid-period-from-b",
    lessonSlug: "periodic-sine-and-transforms",
    prompt:
      "A tide height is h(t) = 4 sin(π t / 6) + 7 feet, t in hours. What is the period?",
    choices: ["3 hours", "6 hours", "12 hours", "2π hours"],
    answer: "c",
    explanation:
      "Period is 2π / |b|. Here b = π/6, so 2π / (π/6) = 12. The 4 and 7 change amplitude and midline, not the period.",
    codes: ["3.5.A"],
  }),
  originalItem({
    slug: "polar-same-point",
    lessonSlug: "polar-graphs-and-polar-rates",
    prompt:
      "Which pair names the same point as (2, π/3) in polar coordinates?",
    choices: [
      "(2, 4π/3)",
      "(-2, 4π/3)",
      "(2, -π/3)",
      "(-2, π/3)",
    ],
    answer: "b",
    explanation:
      "A negative radius points the opposite direction. -2 at 4π/3 is the same as 2 at 4π/3 - π = π/3.",
    codes: ["3.13.A"],
  }),
  originalItem({
    slug: "parametric-speed-not-slope",
    lessonSlug: "parametric-motion-in-the-plane",
    prompt:
      "A drone path is x = 3t, y = 4t. At t = 2, which claim is true?",
    choices: [
      "The speed is 5 and the slope dy/dx is 4/3.",
      "The speed is 7 and the slope is 12.",
      "The speed is 5 and the slope is 12.",
      "Parametric speed equals dy/dx.",
    ],
    answer: "a",
    explanation:
      "dx/dt = 3, dy/dt = 4. Speed is sqrt(9+16)=5. Slope dy/dx = (dy/dt)/(dx/dt)=4/3. Position at t=2 is not needed.",
    codes: ["4.2.A"],
  }),
  originalItem({
    slug: "matrix-not-commutative",
    lessonSlug: "vectors-and-matrix-functions",
    prompt:
      "A 2×2 rotation R and a shear S are applied to a poster vector. Which statement is reliable?",
    choices: [
      "RS always equals SR.",
      "Matrix multiplication is associative but not generally commutative, so RS may differ from SR.",
      "You cannot multiply two 2×2 matrices.",
      "The order of R and S never changes a vector.",
    ],
    answer: "b",
    explanation:
      "You can compose 2×2 matrices. The product exists either order, but the results can differ. Association still holds for triples.",
    codes: ["4.13.A"],
  }),
  originalItem({
    slug: "vector-resultant-club-walk",
    lessonSlug: "vectors-and-matrix-functions",
    prompt:
      "A walk is <3, -1> then <0, 4>. What is the resultant?",
    choices: ["<3, 3>", "<3, 5>", "<0, 3>", "<3, -5>"],
    answer: "a",
    explanation:
      "Add componentwise: 3+0 and -1+4. The resultant is <3, 3>, not the sum of the lengths.",
    codes: ["4.7.A"],
  }),
] as const;
