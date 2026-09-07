/**
 * Original BayAreaClubs multiple-choice items for AP Calculus BC.
 * Written from scratch. Not derived from College Board, Stellar Learning,
 * Unlimited Voices, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";

export type ApCalcBcChoiceId = "a" | "b" | "c" | "d";

export type ApCalcBcChoice = {
  id: ApCalcBcChoiceId;
  text: string;
};

export type ApCalcBcDifficulty = "easy" | "medium" | "hard";

export type ApCalcBcQuestion = {
  namespace: typeof AP_CALC_BC_NAMESPACE;
  slug: string;
  lessonSlug: string | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApCalcBcChoice, ApCalcBcChoice, ApCalcBcChoice, ApCalcBcChoice];
  answerId: ApCalcBcChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApCalcBcDifficulty;
  sourceBasis: typeof AP_CALC_BC_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApCalcBcQuestion[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "cancelable-quadratic-limit",
    lessonSlug: "limit-language-and-algebraic-gateways",
    questionType: "multiple_choice",
    prompt:
      "A Peninsula math club graphs f(x) = (x^2 - 4) / (x - 2) for x not equal to 2. What is the limit of f(x) as x approaches 2?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "2" },
      { id: "c", text: "4" },
      { id: "d", text: "The limit does not exist." },
    ],
    answerId: "c",
    explanation:
      "Factor the numerator as (x-2)(x+2). For x not equal to 2 the function equals x+2, which approaches 4.",
    objectiveCodes: ["LIM-1.D", "LIM-1.E"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "piecewise-two-sided-limit",
    lessonSlug: "limit-language-and-algebraic-gateways",
    questionType: "multiple_choice",
    prompt:
      "A heater follows g(t) = 2t for t less than 5 and g(t) = t + 6 for t greater than 5. What is true about the two-sided limit of g as t approaches 5?",
    choices: [
      { id: "a", text: "The limit is 10 because both pieces equal 10 at t = 5." },
      { id: "b", text: "The limit is 11 because the right-hand piece wins." },
      { id: "c", text: "The limit does not exist because the one-sided limits 10 and 11 disagree." },
      { id: "d", text: "The limit is 5 because that is the target input." },
    ],
    answerId: "c",
    explanation:
      "The left-hand limit is 2*5 = 10. The right-hand limit is 5+6 = 11. Disagreement means the two-sided limit does not exist.",
    objectiveCodes: ["LIM-1.A", "LIM-1.C"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "vertical-blow-up-squared",
    lessonSlug: "continuity-jumps-and-infinite-limits",
    questionType: "multiple_choice",
    prompt:
      "What best describes the limit of 1 / (x - 3)^2 as x approaches 3?",
    choices: [
      { id: "a", text: "The limit is 0." },
      { id: "b", text: "The limit is 1." },
      { id: "c", text: "The values grow without bound through large positives, so there is no finite limit." },
      { id: "d", text: "The left side goes to negative infinity and the right side to positive infinity." },
    ],
    answerId: "c",
    explanation:
      "The squared denominator is always positive and shrinks to 0, so the quotient becomes a large positive on both sides.",
    objectiveCodes: ["LIM-3.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "squeeze-bounded-sine",
    lessonSlug: "limit-language-and-algebraic-gateways",
    questionType: "multiple_choice",
    prompt:
      "Why does the limit of x * sin(1/x) as x approaches 0 equal 0?",
    choices: [
      { id: "a", text: "sin(1/x) approaches 1, so the product approaches 0 times 1." },
      { id: "b", text: "The product is squeezed between -|x| and |x|, both of which go to 0." },
      { id: "c", text: "Direct substitution gives 0 times sin(infinity), which is defined as 0." },
      { id: "d", text: "The function is undefined near 0, so every limit is 0." },
    ],
    answerId: "b",
    explanation:
      "Sine is between -1 and 1, so the product sits between -|x| and |x|. Those bounds share the limit 0.",
    objectiveCodes: ["LIM-1.A", "LIM-1.E"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "difference-quotient-parabola",
    lessonSlug: "difference-quotient-as-instantaneous-rate",
    questionType: "multiple_choice",
    prompt:
      "Using the definition, what is the derivative of f(x) = x^2 at x = 3?",
    choices: [
      { id: "a", text: "3" },
      { id: "b", text: "6" },
      { id: "c", text: "9" },
      { id: "d", text: "18" },
    ],
    answerId: "b",
    explanation:
      "[(3+h)^2 - 9]/h = (6h + h^2)/h = 6 + h, which approaches 6.",
    objectiveCodes: ["CHA-2.B"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "product-rule-linear-sine",
    lessonSlug: "derivative-rules-and-smoothness",
    questionType: "multiple_choice",
    prompt:
      "A swim-meet scoreboard uses s(t) = t * sin(t). What is s-prime(t)?",
    choices: [
      { id: "a", text: "cos(t)" },
      { id: "b", text: "t cos(t)" },
      { id: "c", text: "sin(t) + t cos(t)" },
      { id: "d", text: "sin(t) - t cos(t)" },
    ],
    answerId: "c",
    explanation:
      "Product rule: 1 * sin(t) + t * cos(t).",
    objectiveCodes: ["FUN-2.B"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "absolute-value-corner",
    lessonSlug: "derivative-rules-and-smoothness",
    questionType: "multiple_choice",
    prompt:
      "Why is h(x) = |x - 1| not differentiable at x = 1?",
    choices: [
      { id: "a", text: "h is not continuous at x = 1." },
      { id: "b", text: "The left-hand difference quotients approach -1 and the right-hand ones approach 1." },
      { id: "c", text: "Absolute value is never differentiable anywhere." },
      { id: "d", text: "h(1) is undefined." },
    ],
    answerId: "b",
    explanation:
      "The graph has a corner: one-sided slopes disagree, so the derivative limit does not exist, even though h is continuous.",
    objectiveCodes: ["CHA-2.D", "FUN-3.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "power-rule-and-units",
    lessonSlug: "difference-quotient-as-instantaneous-rate",
    questionType: "multiple_choice",
    prompt:
      "A robotics battery voltage is modeled by V(t) = 8 - 0.04 t^2 volts, with t in minutes. What is V-prime(5), including meaning?",
    choices: [
      { id: "a", text: "-0.4 volts, the voltage at 5 minutes" },
      { id: "b", text: "-0.4 volts per minute, the instantaneous rate of change of voltage at 5 minutes" },
      { id: "c", text: "-2 volts per minute, the instantaneous rate of change of voltage at 5 minutes" },
      { id: "d", text: "7 volts per minute, the remaining voltage after 5 minutes" },
    ],
    answerId: "b",
    explanation:
      "V-prime(t) = -0.08 t, so V-prime(5) = -0.4. Units are volts per minute, a rate, not a voltage.",
    objectiveCodes: ["CHA-2.A", "FUN-2.A"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "chain-rule-sine-triple",
    lessonSlug: "chain-rule-for-nested-motions",
    questionType: "multiple_choice",
    prompt:
      "What is the derivative of sin(3x)?",
    choices: [
      { id: "a", text: "cos(3x)" },
      { id: "b", text: "3 cos(3x)" },
      { id: "c", text: "3 sin(3x)" },
      { id: "d", text: "-3 cos(3x)" },
    ],
    answerId: "b",
    explanation:
      "Outer derivative cosine, inner derivative 3, so 3 cos(3x).",
    objectiveCodes: ["FUN-3.A"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "implicit-circle-slope",
    lessonSlug: "implicit-curves-and-inverse-rates",
    questionType: "multiple_choice",
    prompt:
      "For x^2 + y^2 = 25, what is dy/dx at the point (3, 4)?",
    choices: [
      { id: "a", text: "3/4" },
      { id: "b", text: "-3/4" },
      { id: "c", text: "-4/3" },
      { id: "d", text: "4/3" },
    ],
    answerId: "b",
    explanation:
      "2x + 2y y-prime = 0, so y-prime = -x/y = -3/4.",
    objectiveCodes: ["FUN-3.B"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "chain-rule-exp-square",
    lessonSlug: "chain-rule-for-nested-motions",
    questionType: "multiple_choice",
    prompt:
      "What is the derivative of e raised to the power x^2?",
    choices: [
      { id: "a", text: "e raised to x^2" },
      { id: "b", text: "2x e raised to x^2" },
      { id: "c", text: "2x e raised to 2x" },
      { id: "d", text: "x^2 e raised to x^2" },
    ],
    answerId: "b",
    explanation:
      "Exponential outer factor stays, inner derivative is 2x.",
    objectiveCodes: ["FUN-3.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "inverse-function-reciprocal-slope",
    lessonSlug: "implicit-curves-and-inverse-rates",
    questionType: "multiple_choice",
    prompt:
      "A coding-club runtime f is invertible and f(2) = 5 with f-prime(2) = 4. What is the derivative of the inverse at 5?",
    choices: [
      { id: "a", text: "4" },
      { id: "b", text: "1/4" },
      { id: "c", text: "1/5" },
      { id: "d", text: "2/5" },
    ],
    answerId: "b",
    explanation:
      "The inverse slope at f(a) is 1 / f-prime(a) = 1/4.",
    objectiveCodes: ["FUN-3.C"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "velocity-sign-meaning",
    lessonSlug: "related-rates-in-club-settings",
    questionType: "multiple_choice",
    prompt:
      "A particle on a hallway number line has velocity v(3) = -2 meters per second. What does that number say?",
    choices: [
      { id: "a", text: "The particle is 2 meters to the left of the origin at time 3." },
      { id: "b", text: "The particle is moving left at 2 meters per second at time 3." },
      { id: "c", text: "The particle is speeding up at 2 meters per second squared." },
      { id: "d", text: "The particle is at rest at time 3." },
    ],
    answerId: "b",
    explanation:
      "Velocity is a signed rate. Negative means motion toward smaller position values.",
    objectiveCodes: ["CHA-3.A", "CHA-3.B"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "sqrt-linearization-at-nine",
    lessonSlug: "linearization-and-indeterminate-forms",
    questionType: "multiple_choice",
    prompt:
      "Using the tangent line to y = sqrt(x) at x = 9, what is the linear estimate of sqrt(9.6)?",
    choices: [
      { id: "a", text: "3.05" },
      { id: "b", text: "3.10" },
      { id: "c", text: "3.20" },
      { id: "d", text: "4.80" },
    ],
    answerId: "b",
    explanation:
      "f(9)=3 and f-prime(x)=1/(2 sqrt(x)), so f-prime(9)=1/6. L(9.6)=3+(0.6)/6=3.10.",
    objectiveCodes: ["FUN-4.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "lhospital-zero-over-zero",
    lessonSlug: "linearization-and-indeterminate-forms",
    questionType: "multiple_choice",
    prompt:
      "Evaluate the limit as x approaches 0 of (e^x - 1) / x.",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "1" },
      { id: "c", text: "e" },
      { id: "d", text: "The limit does not exist." },
    ],
    answerId: "b",
    explanation:
      "The form is 0/0. Differentiating top and bottom yields e^x / 1, which approaches 1.",
    objectiveCodes: ["LIM-4.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "related-rates-circle-area",
    lessonSlug: "related-rates-in-club-settings",
    questionType: "multiple_choice",
    prompt:
      "A paint-club spill spreads as a circle. When the radius is 4 cm and growing at 0.5 cm per second, how fast is the area growing?",
    choices: [
      { id: "a", text: "2 pi square centimeters per second" },
      { id: "b", text: "4 pi square centimeters per second" },
      { id: "c", text: "8 pi square centimeters per second" },
      { id: "d", text: "16 pi square centimeters per second" },
    ],
    answerId: "b",
    explanation:
      "A = pi r^2, so dA/dt = 2 pi r dr/dt = 2 pi * 4 * 0.5 = 4 pi.",
    objectiveCodes: ["CHA-3.C", "CHA-3.D"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "cubic-critical-points",
    lessonSlug: "mean-value-extrema-and-candidates",
    questionType: "multiple_choice",
    prompt:
      "Where are the critical points of f(x) = x^3 - 3x?",
    choices: [
      { id: "a", text: "only x = 0" },
      { id: "b", text: "x = -1 and x = 1" },
      { id: "c", text: "x = -3 and x = 3" },
      { id: "d", text: "there are no critical points" },
    ],
    answerId: "b",
    explanation:
      "f-prime(x) = 3x^2 - 3 = 3(x^2 - 1), which is zero at x = plus or minus 1.",
    objectiveCodes: ["FUN-1.C"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "mvt-guarantees-a-slope",
    lessonSlug: "mean-value-extrema-and-candidates",
    questionType: "multiple_choice",
    prompt:
      "A running club's position is continuous on [0, 40] minutes and differentiable on (0, 40), with s(0) = 0 km and s(40) = 8 km. What does the Mean Value Theorem guarantee?",
    choices: [
      { id: "a", text: "Speed is 0.2 km per minute at every time in (0, 40)." },
      { id: "b", text: "There is at least one time in (0, 40) with instantaneous velocity 0.2 km per minute." },
      { id: "c", text: "The runners never stopped." },
      { id: "d", text: "The average velocity is 8 km per minute." },
    ],
    answerId: "b",
    explanation:
      "Average slope is 8/40 = 0.2. MVT guarantees at least one interior match, not a constant speed.",
    objectiveCodes: ["FUN-1.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "second-derivative-sign-chart",
    lessonSlug: "concavity-optimization-and-graphs",
    questionType: "multiple_choice",
    prompt:
      "For p(x) = x^4 - x^2, which statement about concavity on (0, 1/4) is correct?",
    choices: [
      { id: "a", text: "p-double-prime is negative on (0, 1/4), so p is concave down there." },
      { id: "b", text: "p-double-prime is positive on (0, 1/4), so p is concave up there." },
      { id: "c", text: "p has a vertical asymptote on (0, 1/4)." },
      { id: "d", text: "p is linear on (0, 1/4), so concavity is undefined." },
    ],
    answerId: "a",
    explanation:
      "p-prime = 4x^3 - 2x and p-double-prime = 12x^2 - 2. On (0, 1/4), 12x^2 stays below 12/16, so 12x^2 - 2 is negative and p is concave down.",
    objectiveCodes: ["FUN-4.C"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "closed-interval-candidates",
    lessonSlug: "mean-value-extrema-and-candidates",
    questionType: "multiple_choice",
    prompt:
      "On [0, 2], f(x) = x^3 - 3x has f(0) = 0, f(1) = -2, and f(2) = 2. What are the absolute min and max on [0, 2]?",
    choices: [
      { id: "a", text: "min 0 at x = 0, max 2 at x = 2" },
      { id: "b", text: "min -2 at x = 1, max 2 at x = 2" },
      { id: "c", text: "min -2 at x = 1, max 0 at x = 0" },
      { id: "d", text: "min -3 at x = 1, max 3 at x = 2" },
    ],
    answerId: "b",
    explanation:
      "Critical points in (0, 2) include x = 1. Comparing f(0), f(1), and f(2) gives min -2 and max 2.",
    objectiveCodes: ["FUN-1.B", "FUN-4.B"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "ftc-upper-limit-x",
    lessonSlug: "riemann-accumulation-and-ftc",
    questionType: "multiple_choice",
    prompt:
      "If A(x) is the integral from 0 to x of t^2 dt, what is A-prime(x)?",
    choices: [
      { id: "a", text: "2x" },
      { id: "b", text: "x^2" },
      { id: "c", text: "x^3 / 3" },
      { id: "d", text: "2x^3" },
    ],
    answerId: "b",
    explanation:
      "The FTC says the derivative of accumulation from a constant to x is the integrand evaluated at x.",
    objectiveCodes: ["FUN-6.A"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "integration-by-parts-x-exp",
    lessonSlug: "parts-partial-fractions-and-improper",
    questionType: "multiple_choice",
    prompt:
      "An antiderivative of x e^x is which of the following?",
    choices: [
      { id: "a", text: "x e^x + C" },
      { id: "b", text: "e^x (x - 1) + C" },
      { id: "c", text: "e^x (x + 1) + C" },
      { id: "d", text: "x^2 e^x / 2 + C" },
    ],
    answerId: "b",
    explanation:
      "Parts with u = x and dv = e^x dx gives x e^x - integral of e^x, which is e^x (x - 1) + C.",
    objectiveCodes: ["FUN-6.D"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "partial-fractions-two-linears",
    lessonSlug: "parts-partial-fractions-and-improper",
    questionType: "multiple_choice",
    prompt:
      "Which decomposition is correct for 1 / (x(x + 1))?",
    choices: [
      { id: "a", text: "1/x + 1/(x + 1)" },
      { id: "b", text: "1/x - 1/(x + 1)" },
      { id: "c", text: "x - (x + 1)" },
      { id: "d", text: "1/(x + 1) - 1/x" },
    ],
    answerId: "b",
    explanation:
      "1/x - 1/(x+1) has common denominator x(x+1) and numerator (x+1) - x = 1.",
    objectiveCodes: ["FUN-6.D"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "improper-p-two-converges",
    lessonSlug: "parts-partial-fractions-and-improper",
    questionType: "multiple_choice",
    prompt:
      "What is the value of the improper integral from 1 to infinity of 1/x^2 dx?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "1" },
      { id: "c", text: "2" },
      { id: "d", text: "The integral diverges." },
    ],
    answerId: "b",
    explanation:
      "The antiderivative is -1/x. The limit of 1 - 1/b as b goes to infinity is 1.",
    objectiveCodes: ["LIM-6.A"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "exponential-separable-growth",
    lessonSlug: "slope-fields-and-separable-models",
    questionType: "multiple_choice",
    prompt:
      "Solutions of dy/dt = 2y have which general form (A a constant)?",
    choices: [
      { id: "a", text: "y = 2t + A" },
      { id: "b", text: "y = A e^{2t}" },
      { id: "c", text: "y = A e^{t/2}" },
      { id: "d", text: "y = 2 A t" },
    ],
    answerId: "b",
    explanation:
      "Separate: dy/y = 2 dt. Integrate to ln|y| = 2t + C, so y = A e^{2t}.",
    objectiveCodes: ["FUN-7.E", "FUN-7.F"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "euler-one-step-linear",
    lessonSlug: "euler-steps-and-logistic-growth",
    questionType: "multiple_choice",
    prompt:
      "Use one Euler step of size h = 0.5 for dy/dx = y, starting at (0, 2). What y-value is estimated at x = 0.5?",
    choices: [
      { id: "a", text: "2.0" },
      { id: "b", text: "2.5" },
      { id: "c", text: "3.0" },
      { id: "d", text: "4.0" },
    ],
    answerId: "c",
    explanation:
      "Slope at (0, 2) is 2. New y = 2 + 0.5 * 2 = 3.",
    objectiveCodes: ["FUN-7.D"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "logistic-carrying-capacity",
    lessonSlug: "euler-steps-and-logistic-growth",
    questionType: "multiple_choice",
    prompt:
      "A club-membership model is dP/dt = 0.04 P (120 - P). What is the carrying capacity?",
    choices: [
      { id: "a", text: "0.04" },
      { id: "b", text: "60" },
      { id: "c", text: "120" },
      { id: "d", text: "480" },
    ],
    answerId: "c",
    explanation:
      "The factor (L - P) identifies L = 120 as the long-run ceiling.",
    objectiveCodes: ["FUN-7.G"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "logistic-fastest-growth",
    lessonSlug: "euler-steps-and-logistic-growth",
    questionType: "multiple_choice",
    prompt:
      "For dP/dt = 0.04 P (120 - P), at which membership is growth fastest?",
    choices: [
      { id: "a", text: "0 members" },
      { id: "b", text: "40 members" },
      { id: "c", text: "60 members" },
      { id: "d", text: "120 members" },
    ],
    answerId: "c",
    explanation:
      "The product P(120 - P) peaks at P = 60, half the carrying capacity.",
    objectiveCodes: ["FUN-7.G"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "area-line-minus-parabola",
    lessonSlug: "area-volume-and-accumulated-change",
    questionType: "multiple_choice",
    prompt:
      "The area between y = x and y = x^2 from x = 0 to x = 1 equals which number?",
    choices: [
      { id: "a", text: "1/6" },
      { id: "b", text: "1/3" },
      { id: "c", text: "1/2" },
      { id: "d", text: "2/3" },
    ],
    answerId: "a",
    explanation:
      "Integral of (x - x^2) from 0 to 1 is [x^2/2 - x^3/3] from 0 to 1 = 1/2 - 1/3 = 1/6.",
    objectiveCodes: ["CHA-5.A"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "disk-volume-x-squared",
    lessonSlug: "area-volume-and-accumulated-change",
    questionType: "multiple_choice",
    prompt:
      "The region under y = x from x = 0 to x = 2 is spun about the x-axis. What volume does the disk method give?",
    choices: [
      { id: "a", text: "2 pi" },
      { id: "b", text: "4 pi / 3" },
      { id: "c", text: "8 pi / 3" },
      { id: "d", text: "4 pi" },
    ],
    answerId: "c",
    explanation:
      "Integral of pi x^2 from 0 to 2 is pi [x^3/3] from 0 to 2 = 8 pi / 3.",
    objectiveCodes: ["CHA-5.B"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "average-value-quadratic",
    lessonSlug: "arc-length-and-average-value",
    questionType: "multiple_choice",
    prompt:
      "What is the average value of f(x) = 3x^2 on [0, 2]?",
    choices: [
      { id: "a", text: "2" },
      { id: "b", text: "4" },
      { id: "c", text: "8" },
      { id: "d", text: "12" },
    ],
    answerId: "b",
    explanation:
      "Average value is (1/2) times the integral of 3x^2 from 0 to 2, which is (1/2)*8 = 4.",
    objectiveCodes: ["CHA-4.D"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "arc-length-integrand-linear",
    lessonSlug: "arc-length-and-average-value",
    questionType: "multiple_choice",
    prompt:
      "The arc-length integrand for y = (2/3) x^{3/2} uses 1 + (y-prime)^2. What is y-prime(x) for x greater than 0?",
    choices: [
      { id: "a", text: "x^{1/2}" },
      { id: "b", text: "x^{3/2}" },
      { id: "c", text: "(2/3) x^{1/2}" },
      { id: "d", text: "x^{-1/2}" },
    ],
    answerId: "a",
    explanation:
      "Differentiate: (2/3)*(3/2) x^{1/2} = x^{1/2}. Then 1 + (y-prime)^2 = 1 + x, a standard length setup.",
    objectiveCodes: ["CHA-6.A"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "parametric-slope-power",
    lessonSlug: "parametric-paths-and-vector-velocity",
    questionType: "multiple_choice",
    prompt:
      "A path is x = t^2, y = t^3 for t greater than 0. What is dy/dx?",
    choices: [
      { id: "a", text: "3t / 2" },
      { id: "b", text: "2 / (3t)" },
      { id: "c", text: "3 t^2" },
      { id: "d", text: "2t" },
    ],
    answerId: "a",
    explanation:
      "dy/dt = 3t^2 and dx/dt = 2t, so dy/dx = 3t^2 / 2t = 3t/2.",
    objectiveCodes: ["CHA-3.F", "CHA-3.G"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "vector-speed-three-four",
    lessonSlug: "parametric-paths-and-vector-velocity",
    questionType: "multiple_choice",
    prompt:
      "A sailing-club track has velocity vector 3 i + 4 j at a given second. What is the speed?",
    choices: [
      { id: "a", text: "1" },
      { id: "b", text: "5" },
      { id: "c", text: "7" },
      { id: "d", text: "12" },
    ],
    answerId: "b",
    explanation:
      "Speed is the magnitude sqrt(9 + 16) = 5.",
    objectiveCodes: ["CHA-3.H"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "polar-area-full-circle",
    lessonSlug: "polar-slopes-and-swept-area",
    questionType: "multiple_choice",
    prompt:
      "A sprinkler traces r = 2 for theta from 0 to 2 pi. What area does (1/2) integral r^2 d(theta) report?",
    choices: [
      { id: "a", text: "2 pi" },
      { id: "b", text: "4 pi" },
      { id: "c", text: "8 pi" },
      { id: "d", text: "pi" },
    ],
    answerId: "b",
    explanation:
      "(1/2) integral of 4 from 0 to 2 pi equals 2 * 2 pi = 4 pi, the area of a circle of radius 2.",
    objectiveCodes: ["CHA-5.B"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "parametric-distance-not-displacement",
    lessonSlug: "parametric-paths-and-vector-velocity",
    questionType: "multiple_choice",
    prompt:
      "A particle travels with speed 5 from t = 0 to t = 3, then reverses and travels with speed 5 from t = 3 to t = 5. Distance traveled on [0, 5] is which number?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "10" },
      { id: "c", text: "15" },
      { id: "d", text: "25" },
    ],
    answerId: "d",
    explanation:
      "Distance is the integral of speed: 5*3 + 5*2 = 25, regardless of reversal. Displacement would need the velocity signs.",
    objectiveCodes: ["CHA-4.C", "CHA-3.H"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "geometric-half-series",
    lessonSlug: "sequences-series-and-convergence-tests",
    questionType: "multiple_choice",
    prompt:
      "What is the sum of the infinite series 1/2 + 1/4 + 1/8 + 1/16 + ... ?",
    choices: [
      { id: "a", text: "1/2" },
      { id: "b", text: "1" },
      { id: "c", text: "2" },
      { id: "d", text: "The series diverges." },
    ],
    answerId: "b",
    explanation:
      "Geometric with first term 1/2 and ratio 1/2. Sum = (1/2) / (1 - 1/2) = 1.",
    objectiveCodes: ["LIM-8.B"],
    difficulty: "easy",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "nth-term-test-nonzero",
    lessonSlug: "sequences-series-and-convergence-tests",
    questionType: "multiple_choice",
    prompt:
      "The terms of a series satisfy a_n = (n + 1) / n. What does the nth-term test conclude?",
    choices: [
      { id: "a", text: "The series converges because a_n approaches 1." },
      { id: "b", text: "The series diverges because a_n does not approach 0." },
      { id: "c", text: "The series converges by the ratio test." },
      { id: "d", text: "The test is silent because a_n approaches 1." },
    ],
    answerId: "b",
    explanation:
      "a_n approaches 1, not 0, so the series diverges. The nth-term test is decisive here.",
    objectiveCodes: ["LIM-8.C"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "maclaurin-exp-degree-two",
    lessonSlug: "taylor-polynomials-and-error-bounds",
    questionType: "multiple_choice",
    prompt:
      "The degree-2 Maclaurin polynomial for e^x is which expression?",
    choices: [
      { id: "a", text: "1 + x" },
      { id: "b", text: "1 + x + x^2" },
      { id: "c", text: "1 + x + x^2 / 2" },
      { id: "d", text: "1 + x + x^2 / 2 + x^3 / 6" },
    ],
    answerId: "c",
    explanation:
      "Coefficients are 1/k!. Degree 2 keeps 1 + x + x^2/2!. The cubic term is degree 3.",
    objectiveCodes: ["FUN-8.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    slug: "ratio-test-radius-power",
    lessonSlug: "taylor-polynomials-and-error-bounds",
    questionType: "multiple_choice",
    prompt:
      "For the series sum (n! / n^n) x^n, a ratio-test computation of |a_{n+1}/a_n| tends to 0 for every fixed x. What is the radius of convergence?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "1" },
      { id: "c", text: "e" },
      { id: "d", text: "infinity" },
    ],
    answerId: "d",
    explanation:
      "If the ratio limit is 0, which is less than 1 for every x, the series converges for all x, so the radius is infinite.",
    objectiveCodes: ["LIM-8.G", "FUN-8.C"],
    difficulty: "hard",
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    version: 1,
  },
];
