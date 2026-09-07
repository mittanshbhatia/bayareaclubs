import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const contextualDifferentiationLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "contextual-differentiation",
    slug: "related-rates-in-club-settings",
    title: "Related rates in club settings",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["CHA-3.A", "CHA-3.B", "CHA-3.C", "CHA-3.D"],
    bodyPlain: [
      "A related-rate problem starts with a relation that remains true while several quantities move. Draw the scene, name the variables, write the relation, differentiate with respect to time, then substitute the snapshot you were given. A debate-team water cooler shaped like a cylinder has volume equal to pi r-squared h. If the radius is fixed and the height falls, the volume rate is pi r-squared times dh/dt. If both radius and height move, the product rule appears.",
      "Particle motion is related rates on a line. Position s(t) has velocity s-prime and acceleration s-double-prime. Speed is the absolute value of velocity. The particle is at rest when velocity is zero. It moves right when velocity is positive. Total distance over an interval adds the lengths of the one-way trips, which means you split at rest times. A BART-platform thought experiment that only subtracts endpoints reports net displacement, not walking distance if someone reversed.",
      "Units and snapshots are the usual failure points. You may not substitute a changing length into the relation until after you differentiate, unless that length is truly constant. A 12-foot ladder sliding down a wall has constant length 12, so that number may enter before or after differentiation. The distance from the wall is not constant, so it stays a variable until the final substitution. Say out loud which quantities are constant before you write the derivative.",
      "Interpretation is part of the answer. A negative dh/dt for a draining tank is not a sign error; it is the model saying the water level is falling. Report the requested rate with a unit and a direction in words. Later Euler and logistic work will ask for the same sentence: the number is a rate, and the sign is a story.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "contextual-differentiation",
    slug: "linearization-and-indeterminate-forms",
    title: "Linearization and indeterminate forms",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-4.A", "LIM-4.A", "CHA-3.E"],
    bodyPlain: [
      "Near a point where a function is differentiable, the tangent line is the best linear stand-in. The linearization of f at a is L(x) = f(a) + f-prime(a) times (x - a). A solar-club student who knows brightness at a measured angle can estimate brightness a few degrees away without rerunning the full model. The estimate is local. Far from a, the tangent can be a poor guest, which is exactly why the series unit later adds quadratic and higher terms.",
      "The first-degree Taylor polynomial is this same line. BC students should already hear that sentence in this unit. When you later write a degree-n polynomial at a center, the n equals 1 case is linearization. The error is the leftover after that line. For now, judge the leftover by comparing L(x) to a known nearby value or to a graph. If the function bends hard, the leftover grows quickly.",
      "Indeterminate forms such as 0/0 and infinity/infinity are not answers. They are invitations to rewrite. Algebraic rewriting still comes first. When a rewrite is ugly or hidden, L'Hospital's rule may apply: if the conditions hold, the limit of the original quotient equals the limit of the quotient of derivatives. The rule is not a license to differentiate numerators and denominators of every fraction you meet. The limit must be an indeterminate quotient, and the derivative limit must exist in the extended sense the theorem allows.",
      "Other indeterminate shapes, including 1 to the infinity and 0 times infinity, are rewritten into quotients before the rule is used. Logs turn exponential standoffs into quotients. This rewriting later appears in sequence limits such as (1 + 1/n) to the n, which connect to e and to series for the exponential. Treat L'Hospital as a structured rewrite, not as a reflex.",
    ].join("\n\n"),
  },
];
