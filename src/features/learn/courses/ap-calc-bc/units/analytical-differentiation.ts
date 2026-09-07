import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const analyticalDifferentiationLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "analytical-differentiation",
    slug: "mean-value-extrema-and-candidates",
    title: "Mean Value Theorem, extrema, and candidates",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-1.A", "FUN-1.B", "FUN-1.C", "FUN-4.A"],
    bodyPlain: [
      "The Mean Value Theorem says that a function continuous on a closed interval and differentiable on the open interval must have at least one interior point where the instantaneous slope equals the average slope between the endpoints. A running club that covers 8 kilometers in 40 minutes had, at some moment, speed exactly 0.2 kilometers per minute, provided the position model meets the hypotheses. The theorem does not name the minute. Rolle's theorem is the special case where the endpoints match, so some interior derivative is zero.",
      "Extreme values on a closed interval occur at critical points or at endpoints. A critical point is an interior input where the derivative is zero or undefined. The candidates test evaluates the original function at those inputs and keeps the largest and smallest outputs. Skipping an endpoint is a frequent scoring loss. Skipping a place where the derivative fails is the other.",
      "The first derivative test reads sign charts. If f-prime changes from positive to negative, f has a local maximum. The opposite change yields a local minimum. No sign change means no local extremum, even if the derivative is zero. A cubic with an inflection flat can have a horizontal tangent that is not a peak. Chart the sign, do not assume a zero of f-prime is a turn.",
      "Existence of extrema on a closed interval needs continuity. A jump can hide the true high point or refuse to attain a bound. Before you run the candidates test, confirm that the model is continuous on the interval you were given. If it is not, split the domain and treat each continuous piece separately.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "analytical-differentiation",
    slug: "concavity-optimization-and-graphs",
    title: "Concavity, optimization, and graphs",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-4.B", "FUN-4.C", "FUN-4.D", "FUN-4.E"],
    bodyPlain: [
      "Concavity is the bending of the graph. If f-double-prime is positive, the graph is concave up and the first derivative is increasing. If f-double-prime is negative, the graph is concave down. An inflection point is a domain point where concavity changes. A zero of f-double-prime is only a candidate; the sign of f-double-prime must actually switch. The second derivative test at a critical point is a shortcut: positive second derivative means a local min, negative means a local max, zero means the test is silent.",
      "Optimization in a club setting starts with a primary function and a constraint. A cardboard-box fundraiser wants maximum volume for a fixed sheet size. Solve the constraint for one variable, substitute, then differentiate the single-variable volume. Test critical points against the physical domain: side lengths cannot be negative, and a flap cannot consume more cardboard than exists. The candidates include the physical endpoints of that domain.",
      "Reading a graph of f-prime is a BC skill of its own. Where f-prime is above the axis, f increases. Where f-prime crosses from plus to minus, f has a local max. Where f-prime has a local extremum, f has an inflection. Reconstructing a sketch of f from f-prime and one given point is a regular exam task. Do not confuse the height of f-prime with the height of f.",
      "Later remainder estimates for Taylor polynomials use the size of a higher derivative on an interval. The habit of bounding f-double-prime or f-triple-prime on a closed interval starts here. If you can name the maximum of an absolute higher derivative on a window, you already have the raw material for a Lagrange-style error bound.",
    ].join("\n\n"),
  },
];
