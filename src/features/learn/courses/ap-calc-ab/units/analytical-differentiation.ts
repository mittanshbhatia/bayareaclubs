/**
 * Unit 5 lessons. source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { ApCalcAbLesson } from "@/features/learn/courses/ap-calc-ab/units/limits-and-continuity";

export const lessons: readonly ApCalcAbLesson[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "extrema-and-the-first-derivative",
    title: "Extrema and the first derivative",
    unitSlug: "analytical-differentiation",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["FUN-1.B", "FUN-1.C", "FUN-4.A"],
    bodyPlain: [
      "A critical point of f is an interior input where f' is zero or f' fails to exist, provided f itself is defined there. Those are the only interior candidates for a local max or min. Endpoints of a closed interval are candidates too, but they are not called critical points. The math club's snack-profit model on a four-hour bake sale is analyzed on a closed time window, so both critical times and the opening and closing bells matter.",
      "The first derivative test reads a sign chart. If f' changes from positive to negative at a critical point, f has a local maximum there. If f' changes from negative to positive, f has a local minimum. If f' does not change sign, that critical point is not a local extremum. A horizontal tangent can be a terrace rather than a peak.",
      "The Mean Value Theorem connects average slope to an instantaneous slope. If f is continuous on [a, b] and differentiable on (a, b), then some c in (a, b) satisfies f'(c) = [f(b) - f(a)] / (b - a). On a calm stretch of the Bay Trail, if a cyclist's net average velocity is 6 meters per second, then at least once the instantaneous velocity equals 6. The theorem guarantees existence. It does not hand you the clock time without more work.",
      "Extreme Value Theorem is the closed-interval partner: a continuous function on [a, b] attains both a global max and a global min. To find them, evaluate f at every critical point in the open interval and at the two endpoints, then compare those output values. Skipping an endpoint is a common way to miss the actual high or low on a restricted domain.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "concavity-and-optimization",
    title: "Concavity and optimization",
    unitSlug: "analytical-differentiation",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["FUN-4.A", "FUN-4.B", "FUN-4.C", "FUN-4.D"],
    bodyPlain: [
      "Concavity describes how the derivative itself is changing. If f' is increasing, the graph of f is concave up: a cup that holds water. If f' is decreasing, the graph is concave down. The second derivative makes that test mechanical. When f''(x) is positive, f is concave up there. When f''(x) is negative, f is concave down. An inflection point is where concavity changes and the point sits on the graph.",
      "The second derivative test is a local shortcut at a critical point where f' is zero. If f''(c) is positive, f has a local min at c. If f''(c) is negative, f has a local max. If f''(c) is zero, the test is silent and you return to the first derivative test. Silence is not a conclusion.",
      "Optimization turns a word problem into that machinery. The yearbook club wants a rectangular poster with 240 square inches of print and a 2-inch margin on each side. You name the printed width and height, write the total paper area in one variable, restrict the domain to positive sizes that fit the print, then take a derivative. Critical points and endpoints of the realistic domain are the only candidates for cheapest paper.",
      "A finished optimization write-up states the objective, the constraint, the domain, the candidate values, and which candidate wins. A derivative of zero is not automatically the answer. You still compare values and say what the winning dimensions mean in the club's units. The calculus finds candidates. The comparison decides.",
    ].join("\n\n"),
  },
];
