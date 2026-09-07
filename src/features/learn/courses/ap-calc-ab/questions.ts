/**
 * Original BayAreaClubs multiple-choice items for AP Calculus AB.
 * Written from scratch. Not derived from College Board, Unlimited Voices,
 * Stellar Learning, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { LoaderQuestion } from "@/features/learn/courses/types";

export type ApCalcAbChoiceId = "a" | "b" | "c" | "d";

export type ApCalcAbChoice = {
  id: ApCalcAbChoiceId;
  text: string;
};

export type ApCalcAbDifficulty = "easy" | "medium" | "hard";

export type ApCalcAbQuestion = LoaderQuestion & {
  namespace: typeof AP_CALC_AB_NAMESPACE;
  questionType: "multiple_choice";
  choices: readonly [ApCalcAbChoice, ApCalcAbChoice, ApCalcAbChoice, ApCalcAbChoice];
  answerId: ApCalcAbChoiceId;
  objectiveCodes: readonly string[];
  difficulty: ApCalcAbDifficulty;
  sourceBasis: typeof AP_CALC_AB_SOURCE_BASIS;
};

export const questions: readonly ApCalcAbQuestion[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "lim-nearby-voltage",
    lessonSlug: "approaching-a-value",
    questionType: "multiple_choice",
    prompt:
      "The robotics log has no voltage at t = 4, but nearby times cluster near 11.8 volts. What does lim t→4 V(t) = 11.8 claim?",
    choices: [
      { id: "a", text: "V(4) must equal 11.8." },
      {
        id: "b",
        text: "Nearby voltages can be forced close to 11.8 by taking t close to 4, other than 4 itself.",
      },
      { id: "c", text: "The voltage is undefined for every t except 4." },
      { id: "d", text: "The left-hand and right-hand limits must disagree." },
    ],
    answerId: "b",
    explanation:
      "A limit describes nearby outputs in a deleted neighborhood. It does not require the function to take that value at the approach point.",
    objectiveCodes: ["LIM-1.A", "LIM-1.B"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "lim-cancel-factor",
    lessonSlug: "approaching-a-value",
    questionType: "multiple_choice",
    prompt: "What is lim x→3 (x^2 - 9) / (x - 3)?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "3" },
      { id: "c", text: "6" },
      { id: "d", text: "The limit does not exist." },
    ],
    answerId: "c",
    explanation:
      "Factor the top as (x - 3)(x + 3), cancel the shared factor for x not equal to 3, then evaluate x + 3 at 3 to get 6.",
    objectiveCodes: ["LIM-1.E"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "lim-piecewise-hole",
    lessonSlug: "continuity-and-existence",
    questionType: "multiple_choice",
    prompt:
      "Let f(x) = x + 1 when x < 2, f(2) = 5, and f(x) = 2x - 1 when x > 2. Which statement is true?",
    choices: [
      { id: "a", text: "lim x→2 f(x) does not exist because f(2) = 5." },
      { id: "b", text: "lim x→2 f(x) = 3, so f has a removable discontinuity at 2." },
      { id: "c", text: "f is continuous at 2 because both formulas are linear." },
      { id: "d", text: "The left-hand limit is 5 and the right-hand limit is 3." },
    ],
    answerId: "b",
    explanation:
      "The left side approaches 3 and the right side approaches 3, so the two-sided limit is 3. The function value 5 does not match, which is a removable discontinuity.",
    objectiveCodes: ["LIM-2.A", "LIM-2.B"],
    difficulty: "hard",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "lim-ivt-creek",
    lessonSlug: "continuity-and-existence",
    questionType: "multiple_choice",
    prompt:
      "Creek height H is continuous from 8 a.m. to noon. H(8) = 2.1 feet and H(12) = 2.8 feet. Which conclusion follows?",
    choices: [
      { id: "a", text: "H equals 2.4 feet at least once in that interval." },
      { id: "b", text: "H is differentiable at every time that morning." },
      { id: "c", text: "H never equals 2.1 feet after 8 a.m." },
      { id: "d", text: "H must be linear between the two readings." },
    ],
    answerId: "a",
    explanation:
      "The Intermediate Value Theorem says a continuous function on a closed interval attains every output between its endpoint values. 2.4 sits between 2.1 and 2.8.",
    objectiveCodes: ["FUN-1.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "diff-average-velocity",
    lessonSlug: "difference-quotients-and-the-derivative",
    questionType: "multiple_choice",
    prompt:
      "A Crystal Springs runner has s(20) = 80 m and s(50) = 200 m. What is the average velocity from t = 20 to t = 50?",
    choices: [
      { id: "a", text: "2.4 meters per second" },
      { id: "b", text: "4 meters per second" },
      { id: "c", text: "6 meters per second" },
      { id: "d", text: "120 meters per second" },
    ],
    answerId: "b",
    explanation:
      "Average velocity is [200 - 80] / [50 - 20] = 120 / 30 = 4 meters per second.",
    objectiveCodes: ["CHA-1.A"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "diff-power-rule",
    lessonSlug: "power-product-and-quotient-rules",
    questionType: "multiple_choice",
    prompt: "If f(x) = 3x^4 - 5x + 8, what is f'(x)?",
    choices: [
      { id: "a", text: "12x^3 - 5" },
      { id: "b", text: "3x^3 - 5" },
      { id: "c", text: "12x^3 - 5x" },
      { id: "d", text: "x^4 - 5" },
    ],
    answerId: "a",
    explanation:
      "The power rule and the constant-multiple rule give 12x^3 - 5. The constant 8 differentiates to 0.",
    objectiveCodes: ["FUN-3.A"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "diff-definition-match",
    lessonSlug: "difference-quotients-and-the-derivative",
    questionType: "multiple_choice",
    prompt: "Which limit equals f'(2), when the derivative exists?",
    choices: [
      { id: "a", text: "lim h→0 [f(2 + h) + f(2)] / h" },
      { id: "b", text: "lim h→0 [f(2 + h) - f(2)] / h" },
      { id: "c", text: "lim h→0 [f(2 + h) - f(2)] / 2" },
      { id: "d", text: "lim h→2 [f(h) - 2] / h" },
    ],
    answerId: "b",
    explanation:
      "The derivative at 2 is the limit of the difference quotient with base point 2 and increment h.",
    objectiveCodes: ["LIM-3.A", "CHA-2.D"],
    difficulty: "hard",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "diff-product-rule",
    lessonSlug: "power-product-and-quotient-rules",
    questionType: "multiple_choice",
    prompt: "What is d/dx [x^2 sin x]?",
    choices: [
      { id: "a", text: "2x cos x" },
      { id: "b", text: "2x sin x + x^2 cos x" },
      { id: "c", text: "x^2 cos x" },
      { id: "d", text: "2x sin x - x^2 cos x" },
    ],
    answerId: "b",
    explanation:
      "Product rule: (2x)(sin x) + (x^2)(cos x).",
    objectiveCodes: ["FUN-3.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "comp-chain-identify",
    lessonSlug: "chain-rule-in-layers",
    questionType: "multiple_choice",
    prompt:
      "Why is the ordinary sine rule not enough to differentiate B = sin(3t) for the theater fade?",
    choices: [
      { id: "a", text: "Sine is not differentiable." },
      {
        id: "b",
        text: "The input to sine is a function of t, so the chain rule supplies the inner factor 3.",
      },
      { id: "c", text: "The product rule is required whenever sine appears." },
      { id: "d", text: "You must first convert sine to a polynomial." },
    ],
    answerId: "b",
    explanation:
      "B is a composition. Differentiate the outer sine and multiply by the derivative of the inner 3t.",
    objectiveCodes: ["FUN-3.B"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "comp-chain-compute",
    lessonSlug: "chain-rule-in-layers",
    questionType: "multiple_choice",
    prompt: "What is d/dx [sin(3x^2)]?",
    choices: [
      { id: "a", text: "cos(3x^2)" },
      { id: "b", text: "6x cos(3x^2)" },
      { id: "c", text: "3x^2 cos(3x^2)" },
      { id: "d", text: "6x sin(3x^2)" },
    ],
    answerId: "b",
    explanation:
      "Outer derivative cosine, inner 3x^2 stays inside, times inner derivative 6x.",
    objectiveCodes: ["FUN-3.C"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "comp-implicit-circle",
    lessonSlug: "implicit-and-inverse-derivatives",
    questionType: "multiple_choice",
    prompt: "For x^2 + y^2 = 25, what is dy/dx at the point (3, 4)?",
    choices: [
      { id: "a", text: "3/4" },
      { id: "b", text: "-3/4" },
      { id: "c", text: "-4/3" },
      { id: "d", text: "4/3" },
    ],
    answerId: "b",
    explanation:
      "Differentiate: 2x + 2y y' = 0, so y' = -x/y. At (3, 4) that is -3/4.",
    objectiveCodes: ["FUN-3.D"],
    difficulty: "hard",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "comp-inverse-reciprocal",
    lessonSlug: "implicit-and-inverse-derivatives",
    questionType: "multiple_choice",
    prompt:
      "f and g are inverses, f(5) = 2, and f'(5) = 4. What is g'(2)?",
    choices: [
      { id: "a", text: "4" },
      { id: "b", text: "2" },
      { id: "c", text: "1/4" },
      { id: "d", text: "1/5" },
    ],
    answerId: "c",
    explanation:
      "The inverse derivative at 2 is the reciprocal of f' at the matching input 5, so 1/4.",
    objectiveCodes: ["FUN-3.E"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "ctx-related-setup",
    lessonSlug: "related-rates-in-context",
    questionType: "multiple_choice",
    prompt:
      "A spherical balloon has V = (4/3) π r^3. The garden club knows dV/dt at an instant and wants dr/dt. What should they do first after naming variables?",
    choices: [
      { id: "a", text: "Substitute the snapshot radius, then differentiate the resulting constant." },
      {
        id: "b",
        text: "Differentiate the linking equation with respect to time, then substitute the snapshot values.",
      },
      { id: "c", text: "Set r equal to V and solve for time." },
      { id: "d", text: "Replace dV/dt with r^2 without using the chain rule." },
    ],
    answerId: "b",
    explanation:
      "Differentiate while the variables are still changing, then plug in the instant. Substituting first freezes a changing quantity.",
    objectiveCodes: ["CHA-3.A", "CHA-3.B"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "ctx-linearization",
    lessonSlug: "linearization-and-indeterminate-limits",
    questionType: "multiple_choice",
    prompt:
      "f(2) = 5 and f'(2) = -3. What is the linearization L(x) of f at 2, and what estimate does it give for f(2.1)?",
    choices: [
      { id: "a", text: "L(x) = 5 - 3(x - 2); L(2.1) = 4.7" },
      { id: "b", text: "L(x) = 5 + 3(x - 2); L(2.1) = 5.3" },
      { id: "c", text: "L(x) = -3 + 5(x - 2); L(2.1) = -2.5" },
      { id: "d", text: "L(x) = 2 + 5(x - 3); L(2.1) = 2.1" },
    ],
    answerId: "a",
    explanation:
      "L(x) = f(a) + f'(a)(x - a) = 5 - 3(x - 2). Then L(2.1) = 5 - 3(0.1) = 4.7.",
    objectiveCodes: ["CHA-3.D"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "ctx-rope-related",
    lessonSlug: "related-rates-in-context",
    questionType: "multiple_choice",
    prompt:
      "A kayak rope satisfies s^2 = x^2 + 36. When s = 10 ft, the rope is hauled in at 2 ft/s. How fast is the horizontal distance x changing?",
    choices: [
      { id: "a", text: "x is decreasing at 2.5 ft/s" },
      { id: "b", text: "x is decreasing at 2 ft/s" },
      { id: "c", text: "x is increasing at 2.5 ft/s" },
      { id: "d", text: "x is decreasing at 8 ft/s" },
    ],
    answerId: "a",
    explanation:
      "x = 8 when s = 10. Differentiating gives s s' = x x'. Then 10(-2) = 8 x', so x' = -2.5 ft/s.",
    objectiveCodes: ["CHA-3.C"],
    difficulty: "hard",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "ctx-lhospital-sine",
    lessonSlug: "linearization-and-indeterminate-limits",
    questionType: "multiple_choice",
    prompt: "What is lim x→0 sin(5x) / x?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "1" },
      { id: "c", text: "5" },
      { id: "d", text: "The limit does not exist." },
    ],
    answerId: "c",
    explanation:
      "The form is 0/0. Differentiating top and bottom yields 5 cos(5x), which approaches 5. Equivalently, write 5 * sin(5x)/(5x).",
    objectiveCodes: ["LIM-4.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "anl-critical-point",
    lessonSlug: "extrema-and-the-first-derivative",
    questionType: "multiple_choice",
    prompt: "Which interior x-value is a critical point of f?",
    choices: [
      { id: "a", text: "A point where f is undefined." },
      { id: "b", text: "A point where f is defined and f' is zero or undefined." },
      { id: "c", text: "Every endpoint of a closed interval." },
      { id: "d", text: "Any point where f(x) equals zero." },
    ],
    answerId: "b",
    explanation:
      "Critical points require the function to exist there and the derivative to be zero or to fail to exist. Endpoints are candidates for extrema but are not critical points.",
    objectiveCodes: ["FUN-4.A"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "anl-first-derivative-test",
    lessonSlug: "extrema-and-the-first-derivative",
    questionType: "multiple_choice",
    prompt:
      "f'(x) is positive just left of x = 3 and negative just right of x = 3, and f'(3) = 0. What does the first derivative test conclude?",
    choices: [
      { id: "a", text: "f has a local minimum at x = 3." },
      { id: "b", text: "f has a local maximum at x = 3." },
      { id: "c", text: "f has an inflection point and no extremum at x = 3." },
      { id: "d", text: "f is discontinuous at x = 3." },
    ],
    answerId: "b",
    explanation:
      "A + to - sign change of f' at a critical point means a local maximum.",
    objectiveCodes: ["FUN-4.A"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "anl-optimize-poster",
    lessonSlug: "concavity-and-optimization",
    questionType: "multiple_choice",
    prompt:
      "A rectangle has printed area 240 and a 2-inch margin on every side. If the printed width is w, the printed height is 240/w, and total paper width is w + 4. Which function is the total paper area A(w)?",
    choices: [
      { id: "a", text: "A(w) = w * (240/w)" },
      { id: "b", text: "A(w) = (w + 4)(240/w + 4)" },
      { id: "c", text: "A(w) = (w + 2)(240/w + 2)" },
      { id: "d", text: "A(w) = w + 240/w + 4" },
    ],
    answerId: "b",
    explanation:
      "Each side adds two inches of margin, so both dimensions grow by 4. Total area is the product of those outer sides.",
    objectiveCodes: ["FUN-4.B", "FUN-4.C"],
    difficulty: "hard",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "anl-mvt-trail",
    lessonSlug: "extrema-and-the-first-derivative",
    questionType: "multiple_choice",
    prompt:
      "A cyclist on the Bay Trail has continuous position on [0, 10] and differentiable position on (0, 10). Average velocity on that interval is 6 m/s. What does the Mean Value Theorem guarantee?",
    choices: [
      { id: "a", text: "The cyclist never exceeds 6 m/s." },
      {
        id: "b",
        text: "At least one time in (0, 10) has instantaneous velocity 6 m/s.",
      },
      { id: "c", text: "Velocity equals 6 m/s at both endpoints." },
      { id: "d", text: "Acceleration is zero throughout the ride." },
    ],
    answerId: "b",
    explanation:
      "MVT produces a c in the open interval where f'(c) equals the average slope.",
    objectiveCodes: ["FUN-1.B"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "int-riemann-rain",
    lessonSlug: "riemann-sums-and-definite-integrals",
    questionType: "multiple_choice",
    prompt:
      "Rainfall rate is sampled every 10 minutes and each sample is multiplied by 10 minutes. What is this estimate?",
    choices: [
      { id: "a", text: "A derivative of the rainfall rate" },
      { id: "b", text: "A Riemann-sum estimate of accumulated rain volume" },
      { id: "c", text: "The exact second derivative of barrel height" },
      { id: "d", text: "A slope field for the rainfall equation" },
    ],
    answerId: "b",
    explanation:
      "Rate times time width, added across subintervals, is a Riemann sum for accumulated change.",
    objectiveCodes: ["CHA-4.A", "LIM-5.A"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "int-evaluate-polynomial",
    lessonSlug: "antiderivatives-and-the-ftc",
    questionType: "multiple_choice",
    prompt: "What is the definite integral of 2x + 1 from 0 to 3?",
    choices: [
      { id: "a", text: "6" },
      { id: "b", text: "10" },
      { id: "c", text: "12" },
      { id: "d", text: "15" },
    ],
    answerId: "c",
    explanation:
      "An antiderivative is x^2 + x. Evaluate: (9 + 3) - (0 + 0) = 12.",
    objectiveCodes: ["FUN-6.B", "FUN-6.C"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "int-ftc-chain",
    lessonSlug: "antiderivatives-and-the-ftc",
    questionType: "multiple_choice",
    prompt: "If A(x) = the integral from 0 to x^2 of sin(t) dt, what is A'(x)?",
    choices: [
      { id: "a", text: "sin(x^2)" },
      { id: "b", text: "2x sin(x^2)" },
      { id: "c", text: "sin(x)" },
      { id: "d", text: "2x cos(x^2)" },
    ],
    answerId: "b",
    explanation:
      "FTC plus the chain rule: evaluate the integrand at x^2 and multiply by 2x.",
    objectiveCodes: ["FUN-5.A"],
    difficulty: "hard",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "int-antiderivative-power",
    lessonSlug: "antiderivatives-and-the-ftc",
    questionType: "multiple_choice",
    prompt: "Which function is an antiderivative of 6x^2?",
    choices: [
      { id: "a", text: "12x + C" },
      { id: "b", text: "2x^3 + C" },
      { id: "c", text: "6x^3 + C" },
      { id: "d", text: "3x^2 + C" },
    ],
    answerId: "b",
    explanation:
      "d/dx [2x^3] = 6x^2. The + C records the family of antiderivatives.",
    objectiveCodes: ["FUN-6.C"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "de-slope-field-read",
    lessonSlug: "slope-fields-and-solutions",
    questionType: "multiple_choice",
    prompt:
      "In a slope field for dy/dx = x - y, a short segment at (2, 2) should be drawn with what slope?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "2" },
      { id: "c", text: "4" },
      { id: "d", text: "-2" },
    ],
    answerId: "a",
    explanation:
      "Plug the point into the right-hand side: 2 - 2 = 0, so the segment is horizontal.",
    objectiveCodes: ["FUN-7.A"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "de-exponential-form",
    lessonSlug: "separable-equations-and-growth",
    questionType: "multiple_choice",
    prompt: "The general solution of dy/dt = ky, with k constant and y not zero, has which form?",
    choices: [
      { id: "a", text: "y = A e^(kt)" },
      { id: "b", text: "y = kt + A" },
      { id: "c", text: "y = A / t + k" },
      { id: "d", text: "y = k^t + A" },
    ],
    answerId: "a",
    explanation:
      "Separating and integrating produces ln|y| = kt + C, which exponentiates to y = A e^(kt).",
    objectiveCodes: ["FUN-7.D", "FUN-7.F"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "de-separable-ivp",
    lessonSlug: "separable-equations-and-growth",
    questionType: "multiple_choice",
    prompt:
      "Solve dy/dx = 2x / y with y(0) = 4 and y > 0. Which particular solution is correct?",
    choices: [
      { id: "a", text: "y = 2x + 4" },
      { id: "b", text: "y = sqrt(2x^2 + 16)" },
      { id: "c", text: "y = sqrt(2x^2 + 4)" },
      { id: "d", text: "y = e^(x^2) + 3" },
    ],
    answerId: "b",
    explanation:
      "y dy = 2x dx integrates to y^2 / 2 = x^2 + C. With y(0) = 4, C = 8, so y^2 = 2x^2 + 16. The positive branch is the square root.",
    objectiveCodes: ["FUN-7.E"],
    difficulty: "hard",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "de-particular-vs-general",
    lessonSlug: "slope-fields-and-solutions",
    questionType: "multiple_choice",
    prompt:
      "A student finds y = x^2 + C for a differential equation. They then use y(1) = 5. What did the initial condition do?",
    choices: [
      { id: "a", text: "It proved the slope field was empty." },
      { id: "b", text: "It selected the particular solution y = x^2 + 4 from the family." },
      { id: "c", text: "It changed the differential equation to y' = 0." },
      { id: "d", text: "It showed that no solution exists." },
    ],
    answerId: "b",
    explanation:
      "5 = 1 + C gives C = 4. The initial condition picks one curve from the general family.",
    objectiveCodes: ["FUN-7.B", "FUN-7.C"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "app-area-setup",
    lessonSlug: "area-between-curves",
    questionType: "multiple_choice",
    prompt:
      "On [0, 1], y = x sits above y = x^2. Which integral equals the enclosed area?",
    choices: [
      { id: "a", text: "The integral of x + x^2 from 0 to 1" },
      { id: "b", text: "The integral of x - x^2 from 0 to 1" },
      { id: "c", text: "The integral of x^2 - x from 0 to 1" },
      { id: "d", text: "The integral of x / x^2 from 0 to 1" },
    ],
    answerId: "b",
    explanation:
      "Area is top minus bottom: x - x^2 on [0, 1].",
    objectiveCodes: ["CHA-4.B"],
    difficulty: "easy",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "app-area-value",
    lessonSlug: "area-between-curves",
    questionType: "multiple_choice",
    prompt: "The area between y = x and y = x^2 from 0 to 1 equals which number?",
    choices: [
      { id: "a", text: "1/2" },
      { id: "b", text: "1/3" },
      { id: "c", text: "1/6" },
      { id: "d", text: "1" },
    ],
    answerId: "c",
    explanation:
      "Integrate x - x^2 to get x^2/2 - x^3/3 from 0 to 1, which is 1/2 - 1/3 = 1/6.",
    objectiveCodes: ["CHA-4.C"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "app-disk-volume",
    lessonSlug: "volume-and-accumulated-change",
    questionType: "multiple_choice",
    prompt:
      "Rotate y = sqrt(x) from x = 0 to x = 4 about the x-axis. What is the volume of the solid?",
    choices: [
      { id: "a", text: "4π" },
      { id: "b", text: "8π" },
      { id: "c", text: "16π" },
      { id: "d", text: "32π" },
    ],
    answerId: "b",
    explanation:
      "Disk area is π (sqrt(x))^2 = π x. Integrate from 0 to 4: π [x^2/2] = π * 8 = 8π.",
    objectiveCodes: ["CHA-5.A", "CHA-5.C"],
    difficulty: "hard",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "app-displacement-vs-distance",
    lessonSlug: "volume-and-accumulated-change",
    questionType: "multiple_choice",
    prompt:
      "A ferry model has velocity that is positive, then negative, then positive. The integral of velocity over the trip is near 0. What is the right reading?",
    choices: [
      { id: "a", text: "The hull traveled almost no path length." },
      {
        id: "b",
        text: "Net displacement is small, but distance traveled can still be large.",
      },
      { id: "c", text: "Velocity cannot change sign on a closed interval." },
      { id: "d", text: "The integral of speed must also be near 0." },
    ],
    answerId: "b",
    explanation:
      "The integral of velocity is displacement. Distance uses speed, which stays nonnegative and adds every leg.",
    objectiveCodes: ["CHA-4.D"],
    difficulty: "medium",
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  },
];

export const AP_CALC_AB_QUESTION_COUNT = questions.length;

export default questions;
