/**
 * Unit 6 lessons. source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { ApCalcAbLesson } from "@/features/learn/courses/ap-calc-ab/units/limits-and-continuity";

export const lessons: readonly ApCalcAbLesson[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "riemann-sums-and-definite-integrals",
    title: "Riemann sums and definite integrals",
    unitSlug: "integration-accumulation",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["CHA-4.A", "LIM-5.A", "LIM-5.B"],
    bodyPlain: [
      "A definite integral starts as a sum of many thin contributions. Split an interval [a, b] into n pieces, pick a sample input in each piece, multiply the function value by the width of that piece, and add. That Riemann sum is an estimate of accumulated change. The sailing club estimates water collected in a rain barrel by sampling rainfall rate every ten minutes and multiplying by the time width.",
      "Left, right, and midpoint sums disagree on a monotone curve. If the rate is increasing, left samples undershoot and right samples overshoot. Midpoints often sit between them. The disagreements shrink as the widths shrink. The definite integral from a to b of f(x) dx is the limit of those Riemann sums as the mesh goes to zero, when the limit exists.",
      "Geometry still helps. If f is positive, the integral is the area under the graph. If f changes sign, the integral is net area: regions below the axis subtract. The environmental club's creek-flow graph can dip negative in a model that treats outflow as negative inflow. The integral then reports net volume, not the total water that physically moved.",
      "Units are rate times time, or height times width, depending on the axes. Integrating gallons per hour with respect to hours produces gallons. Integrating a velocity in meters per second with respect to seconds produces meters of displacement. A Riemann sum is not an abstract pile of rectangles. It is a dimensioned estimate of a pile of change.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "antiderivatives-and-the-ftc",
    title: "Antiderivatives and the FTC",
    unitSlug: "integration-accumulation",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["FUN-5.A", "FUN-6.B", "FUN-6.C", "FUN-6.D", "FUN-6.E"],
    bodyPlain: [
      "An antiderivative of f is a function F whose derivative is f. The family of all antiderivatives is F(x) + C, because constants vanish when you differentiate. The power rule runs backward with a shift: an antiderivative of x^n is x^(n+1) / (n+1) when n is not -1. Checking by differentiating the candidate is the cheapest insurance in the course.",
      "The Fundamental Theorem of Calculus ties accumulation to derivatives in two directions. If you define A(x) as the integral of f from a fixed a to the moving upper limit x, then A'(x) = f(x) when f is continuous. The accumulated pile grows at the current rate. That is why a running total of rain is a function whose derivative is the rainfall rate.",
      "The evaluation half says that if F is any antiderivative of f, the definite integral from a to b equals F(b) - F(a). You do not rebuild a Riemann sum by hand. You find an antiderivative, plug in the ends, and subtract. For the integral of 2x + 1 from 0 to 3, an antiderivative is x^2 + x, and the difference is 12.",
      "A chain-rule upper limit needs the chain rule again. The derivative of the integral from 0 to x^2 of sin t dt is sin(x^2) times 2x, not merely sin(x^2). Substitution in the opposite direction helps when the integrand is a composition times the inner derivative. The same pairing of derivative and integral is the whole point of the theorem: they undo each other, with limits of integration keeping the arithmetic honest.",
    ].join("\n\n"),
  },
];
