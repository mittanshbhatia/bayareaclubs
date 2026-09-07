import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const differentiationDefinitionLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "differentiation-definition",
    slug: "difference-quotient-as-instantaneous-rate",
    title: "The difference quotient as an instantaneous rate",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["CHA-2.A", "CHA-2.B", "CHA-2.C", "CHA-1.A"],
    bodyPlain: [
      "Average rate of change is a slope between two times: change in output divided by change in input. Instantaneous rate is the limit of those slopes as the second time slides toward the first. That limit is the derivative at the point. A swim-team timer that records lap distance every two seconds can estimate velocity with a difference quotient. Shortening the window, if the data stay trustworthy, aims at the instantaneous speed the coach actually wants.",
      "The difference quotient has two common writings: [f(a+h) - f(a)] / h and [f(x) - f(a)] / (x - a). They describe the same family of secant slopes. Algebraic simplification before taking the limit is not optional decoration. For a quadratic, the h in the numerator cancels and a linear expression remains. That leftover is the slope function evaluated at a. The same cancellation later appears inside Taylor remainders: a polynomial approximation is built so that the leftover, after enough factors of h, still has a finite limit.",
      "Numerically, a symmetric difference [f(a+h) - f(a-h)] / (2h) often estimates the derivative more cleanly than a one-sided step of the same size. It is still an estimate. If a table only offers values to the right of a, you do not invent a left neighbor. BC students should state the window they used and whether the estimate is a right, left, or centered quotient. Graphically, the derivative is the slope of the tangent, not the height of the graph.",
      "Units travel with the derivative. Meters per second, members per week, volts per minute: the derivative is a rate, so its unit is the output unit over the input unit. A later series or differential-equation model that forgets units will still compute, and it will still be wrong in the club setting. Write the unit beside the first derivative you compute in a problem, then keep it.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "differentiation-definition",
    slug: "derivative-rules-and-smoothness",
    title: "Derivative rules and smoothness",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-2.A", "FUN-2.B", "FUN-3.A", "CHA-2.D"],
    bodyPlain: [
      "Once the definition is trusted, shortcut rules exist because they reproduce that definition on whole families. The power rule, constant multiple rule, and sum rule let you differentiate a polynomial term by term. Product and quotient rules handle factors that both depend on the input. Trigonometric, exponential, and logarithmic derivatives join the toolkit so that a solar-club irradiance model mixing a sine of time with an exponential fade can be differentiated without returning to difference quotients each time.",
      "Differentiability is stricter than continuity. A sharp corner, such as an absolute-value crease in a scoring function, is continuous but not differentiable there: the left-hand difference quotients and right-hand difference quotients disagree. A vertical tangent can send difference quotients to infinity. If a function fails to be continuous at a point, it cannot be differentiable there. The converse is false, and BC later needs that fact when a series of smooth polynomials still converges to a function with a corner.",
      "Higher-order derivatives are derivatives of derivatives. Velocity is the first derivative of position; acceleration is the second. Concavity later reads the sign of the second derivative. In the series unit, the nth derivative at a center is exactly the coefficient raw material for a Taylor polynomial. Computing f-prime, f-double-prime, and a few more at a point is not busywork: it is how a local polynomial model gets its terms.",
      "A function can be differentiable on an open interval and still fail at an endpoint or at an isolated crease. When a problem asks whether a model is differentiable on a closed interval, check the interior with the rules and check the endpoints with one-sided difference quotients. A club spreadsheet that only samples the interior will miss an endpoint kink. State the domain you actually verified.",
    ].join("\n\n"),
  },
];
