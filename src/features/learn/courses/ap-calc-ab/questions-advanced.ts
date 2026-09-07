/**
 * Advanced original AP Calculus AB items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "limit-piecewise-disagree",
    lessonSlug: "continuity-and-existence",
    prompt:
      "f(x) = x+1 for x<2 and f(x) = 5-x for x>2, with f(2)=0. Does lim x→2 f(x) exist?",
    choices: [
      "Yes, the limit is 0 because f(2)=0.",
      "Yes, both one-sided limits are 3, so the two-sided limit is 3 even though f(2) is 0.",
      "No, because f is undefined at 2.",
      "No, because the left and right values differ.",
    ],
    answer: "b",
    explanation:
      "Left: 2+1=3. Right: 5-2=3. The limit is 3. The function value at 2 is a removable mismatch, not a reason the limit fails.",
    codes: ["1.2.A", "1.7.A"],
  }),
  originalItem({
    slug: "definition-match-power",
    lessonSlug: "difference-quotients-and-the-derivative",
    prompt:
      "Which limit is f'(4) if f(x)=x^2?",
    choices: [
      "lim h→0 ((4+h)^2 - 16)/h",
      "lim h→0 (16 - 4)/h",
      "(f(4+h)+f(4))/h",
      "8, so no limit is needed",
    ],
    answer: "a",
    explanation:
      "The definition is lim h→0 (f(4+h)-f(4))/h. f(4)=16. The value 8 is the result after the limit, not a replacement for the definition.",
    codes: ["2.2.A"],
  }),
  originalItem({
    slug: "chain-inside-trig",
    lessonSlug: "chain-rule-in-layers",
    prompt:
      "d/dx sin(3x^2) at x=0 is:",
    choices: ["0", "1", "3", "6"],
    answer: "a",
    explanation:
      "Outer cosine, inner 6x. Derivative is cos(3x^2)*6x. At 0 that product is 1*0=0. Forgetting the inner 6x is the usual miss.",
    codes: ["3.1.A"],
  }),
  originalItem({
    slug: "related-circle-radius",
    lessonSlug: "related-rates-in-context",
    prompt:
      "A circular puddle has A=πr^2. If dA/dt=10π when r=5, what is dr/dt?",
    choices: ["0.5", "1", "2", "10"],
    answer: "b",
    explanation:
      "dA/dt = 2πr dr/dt. 10π = 2π*5*dr/dt → dr/dt=1. Units of area over time do not equal dr/dt without the 2πr factor.",
    codes: ["4.5.A"],
  }),
  originalItem({
    slug: "mvt-guarantees-c",
    lessonSlug: "extrema-and-the-first-derivative",
    prompt:
      "f is continuous on [1,5] and differentiable on (1,5) with f(1)=2 and f(5)=10. What must be true?",
    choices: [
      "f'(c)=2 for some c in (1,5).",
      "f'(x)=2 for every x.",
      "f has a root in (1,5).",
      "f is linear.",
    ],
    answer: "a",
    explanation:
      "MVT gives f'(c)=(10-2)/(5-1)=2 for at least one c. It does not force the derivative everywhere or a root.",
    codes: ["5.1.A"],
  }),
  originalItem({
    slug: "ftc-variable-upper",
    lessonSlug: "antiderivatives-and-the-ftc",
    prompt:
      "g(x)=∫ from 1 to x^2 of t dt. What is g'(x)?",
    choices: ["x^2", "2x", "2x * x^2", "2x^3"],
    answer: "d",
    explanation:
      "FTC with a chain: d/dx ∫_a^{u(x)} f = f(u) u'. Here f(t)=t, u=x^2, so (x^2)*2x=2x^3.",
    codes: ["6.7.A"],
  }),
  originalItem({
    slug: "separable-ivp-exp",
    lessonSlug: "separable-equations-and-growth",
    prompt:
      "dy/dt = 2y, y(0)=5. What is y(1)?",
    choices: ["5", "5e^2", "5e", "10"],
    answer: "b",
    explanation:
      "Separate: dy/y=2 dt. ln|y|=2t+C. y=5e^{2t}. At t=1, 5e^2. The 2 is the growth constant, not a factor of 2 on 5.",
    codes: ["7.6.A"],
  }),
  originalItem({
    slug: "area-between-not-volume",
    lessonSlug: "area-between-curves",
    prompt:
      "Area between y=x and y=x^2 from 0 to 1 is:",
    choices: ["1/2", "1/3", "1/6", "1"],
    answer: "c",
    explanation:
      "∫_0^1 (x-x^2) dx = [x^2/2 - x^3/3]_0^1 = 1/2-1/3=1/6. Disk volume would be a different integral.",
    codes: ["8.4.A"],
  }),
] as const;
