/**
 * Unit 4 lessons. source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { ApCalcAbLesson } from "@/features/learn/courses/ap-calc-ab/units/limits-and-continuity";

export const lessons: readonly ApCalcAbLesson[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "related-rates-in-context",
    title: "Related rates in context",
    unitSlug: "contextual-differentiation",
    position: 1,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["CHA-3.A", "CHA-3.B", "CHA-3.C"],
    bodyPlain: [
      "Related rates start with a geometric or physical link that stays true while several quantities move. The garden club inflates a spherical balloon at the county fair. Volume and radius are tied by V = (4/3) π r^3 at every instant. If the club can measure how fast the volume is growing, the chain rule turns that into how fast the radius is growing.",
      "The method is a short ritual. Name the variables and the independent time variable. Write the linking equation. Differentiate both sides with respect to time, inserting each related derivative. Substitute the known values at the instant you care about, then solve for the unknown rate. Substituting the snapshot numbers before you differentiate will freeze a quantity that is still changing and give a wrong rate.",
      "A second Bay Area picture: a kayak club tows a rope from a dock 6 feet above the water. The rope length s and the horizontal distance x satisfy s^2 = x^2 + 36. Differentiating with respect to t yields 2s s' = 2x x'. If the rope is hauled in at 2 feet per second when 10 feet of rope remain, then x is 8 feet and you can solve for x'. The algebra is ordinary; the modeling step is naming which rate is given.",
      "Units and signs carry meaning. A negative ds/dt means the rope is shortening. A positive dV/dt means the balloon is filling. A related-rates sentence should name the instant, the known rate, the unknown rate, and the units of each. The derivative is not a decorative slope. It is a changing quantity in the club's actual setup.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "linearization-and-indeterminate-limits",
    title: "Linearization and indeterminate limits",
    unitSlug: "contextual-differentiation",
    position: 2,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["CHA-3.D", "CHA-3.E", "LIM-4.A"],
    bodyPlain: [
      "Near a point where a function is differentiable, the tangent line is the best linear stand-in. The linearization of f at a is L(x) = f(a) + f'(a)(x - a). The robotics club uses this when a sensor curve is messy but a local slope is trustworthy. To estimate f(2.1) when they know f(2) and f'(2), they walk 0.1 units along the tangent instead of rebuilding the whole model.",
      "The estimate is local. Far from a, the curve can peel away from the line, especially if the second derivative is large. An approximation sentence should say which center point was used and how far the input sat from that center. Calling a tangent estimate exact is a category error.",
      "Some limits of the form 0/0 or infinity/infinity are indeterminate: the algebra has not yet revealed the value. If the functions are differentiable near the approach point and the derivative ratio has a limit, L'Hospital's rule says the original limit matches that derivative ratio. You may apply the rule only to a qualifying indeterminate form. A limit that is already 5/2 is not a job for L'Hospital.",
      "A standard check is lim x→0 sin(5x) / x. Direct substitution is 0/0. Differentiating top and bottom gives 5 cos(5x) / 1, which approaches 5. You can also rewrite the expression as 5 * [sin(5x) / (5x)] and use the standard sine limit. Both routes are original classroom algebra. The point is to replace an indeterminate clash with a limit you can finish.",
    ].join("\n\n"),
  },
];
