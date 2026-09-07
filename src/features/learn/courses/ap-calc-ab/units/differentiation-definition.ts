/**
 * Unit 2 lessons. source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { ApCalcAbLesson } from "@/features/learn/courses/ap-calc-ab/units/limits-and-continuity";

export const lessons: readonly ApCalcAbLesson[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "difference-quotients-and-the-derivative",
    title: "Difference quotients and the derivative",
    unitSlug: "differentiation-definition",
    position: 1,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["CHA-1.A", "CHA-2.B", "CHA-2.D", "LIM-3.A"],
    bodyPlain: [
      "Average rate of change is a slope between two points on a graph: [f(b) - f(a)] / (b - a). The cross-country club times a runner on the Crystal Springs loop. If distance from the start is s(t) meters after t seconds, the average velocity from t = 20 to t = 50 is [s(50) - s(20)] / 30. That number is honest about the whole interval and silent about any surge in the middle.",
      "Instantaneous rate asks a tighter question: what is the runner doing at one instant? We keep the second clock time close to the first and watch the average velocities. The difference quotient [f(a + h) - f(a)] / h is that family of slopes. The derivative f'(a) is the limit of those slopes as h approaches 0, when the limit exists. A single instant is recovered as a limiting case of nearby intervals.",
      "The same limit can be written [f(x) - f(a)] / (x - a) as x approaches a. Both forms measure the slope of the secant and ask what that slope approaches. If the two-sided limit exists, the graph has a unique tangent line at that point. A corner, a vertical tangent, or a jump in the function can make the derivative fail to exist even when the function itself is defined.",
      "Units travel with the rate. Meters per second, degrees per minute, and dollars per week are not decorations. When a club report says the derivative of temperature with respect to time is 0.4, the sentence is unfinished until it says 0.4 degrees per minute and names the clock time. The definition is a limit, but the interpretation is a rate in context.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "power-product-and-quotient-rules",
    title: "Power, product, and quotient rules",
    unitSlug: "differentiation-definition",
    position: 2,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["FUN-2.A", "FUN-3.A"],
    bodyPlain: [
      "Once the definition is in place, a short list of rules computes most classroom derivatives. The power rule says the derivative of x^n is n x^(n-1) for a constant n you are allowed to use. Constants factor out, and the derivative of a sum is the sum of the derivatives. Those two facts let you differentiate any polynomial term by term: 4x^3 - 7x + 2 has derivative 12x^2 - 7.",
      "The product rule is for a product of two changing factors. If u and v are differentiable, the derivative of uv is u'v + uv'. One factor's rate times the other factor, plus the symmetric term. The solar club's power output might be current times voltage, both changing with time. Differentiating the product requires both rates, not just one.",
      "The quotient rule is the sibling for a ratio. The derivative of u/v is (u'v - uv') / v^2, with v not zero. The minus sign is ordered: differentiate the top first. A common error is swapping that order or forgetting to square the bottom. When the bottom is a constant, you do not need the full quotient rule; divide the constant out and use the power rule.",
      "Sine and cosine start their own cycle: the derivative of sin x is cos x, and the derivative of cos x is -sin x. Exponential and logarithmic rules join later work, but the same algebra applies: sums, constant multiples, products, and quotients. The definition still sits underneath. A rule is a shortcut for a limit you could, in principle, compute by hand.",
    ].join("\n\n"),
  },
];
