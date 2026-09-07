/**
 * Advanced original AP Calculus BC items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "series-ratio-converge",
    lessonSlug: "sequences-series-and-convergence-tests",
    prompt:
      "For Σ n! / n^n, the ratio |a_{n+1}/a_n| tends to 0. What does the ratio test say?",
    choices: [
      "The series diverges.",
      "The series converges absolutely.",
      "The test is inconclusive.",
      "The series equals 0.",
    ],
    answer: "b",
    explanation:
      "If the limit of the absolute ratio is L<1, the series converges absolutely. L=0 is less than 1. The test does not give the sum.",
    codes: ["10.8.A"],
  }),
  originalItem({
    slug: "taylor-error-bound",
    lessonSlug: "taylor-polynomials-and-error-bounds",
    prompt:
      "A first-degree Taylor polynomial for e^x about 0 on [0,1] has Lagrange remainder involving e^c / 2 * x^2. Which bound is valid on that interval?",
    choices: [
      "Error ≤ 1/2",
      "Error ≤ e/2",
      "Error ≤ e",
      "The remainder is exactly 0.",
    ],
    answer: "b",
    explanation:
      "On [0,1], e^c ≤ e and x^2 ≤ 1, so |R1| ≤ e/2. 1/2 would require bounding e^c by 1, which fails for c>0.",
    codes: ["10.12.A"],
  }),
  originalItem({
    slug: "polar-area-petal",
    lessonSlug: "polar-slopes-and-swept-area",
    prompt:
      "Area inside r=2sin(2θ) for one petal uses (1/2)∫ r^2 dθ. Over a petal of length π/2, r^2=4 sin^2(2θ). The integral (1/2)∫ 4 sin^2(2θ) dθ over that petal equals:",
    choices: ["π/4", "π/2", "π", "2"],
    answer: "b",
    explanation:
      "sin^2 averages 1/2 over a full period of the square. One petal of 2θ covering π (θ covering π/2) gives (1/2)*4*(1/2)*(π/2)=π/2. Sketching the interval is required; do not use 0 to 2π for one petal.",
    codes: ["9.8.A"],
  }),
  originalItem({
    slug: "parametric-second-deriv",
    lessonSlug: "parametric-paths-and-vector-velocity",
    prompt:
      "x=t^2, y=t^3. d^2y/dx^2 at t=1 is:",
    choices: ["3/2", "3/4", "6", "3"],
    answer: "b",
    explanation:
      "dy/dx=(3t^2)/(2t)=3t/2 for t≠0. Then d/dt of that is 3/2, divide by dx/dt=2t: (3/2)/(2t)=3/(4t). At t=1 that is 3/4.",
    codes: ["9.3.A"],
  }),
  originalItem({
    slug: "improper-integral-p",
    lessonSlug: "parts-partial-fractions-and-improper",
    prompt:
      "∫ from 1 to ∞ of x^{-2} dx converges to:",
    choices: ["0", "1", "2", "The integral diverges."],
    answer: "b",
    explanation:
      "Antiderivative -1/x. Limit as b→∞ of -1/b - (-1)=1. p=2>1 so the p-integral from 1 to ∞ converges.",
    codes: ["6.13.A"],
  }),
  originalItem({
    slug: "euler-step-overshoot",
    lessonSlug: "euler-steps-and-logistic-growth",
    prompt:
      "Euler with step 0.5 on y'=y, y(0)=1 estimates y(1) as:",
    choices: ["1.5", "2.0", "2.25", "e"],
    answer: "c",
    explanation:
      "y1=1+0.5*1=1.5. y2=1.5+0.5*1.5=2.25. The true value is e≈2.72. Euler with a coarse step underestimates this growing solution.",
    codes: ["7.5.A"],
  }),
] as const;
