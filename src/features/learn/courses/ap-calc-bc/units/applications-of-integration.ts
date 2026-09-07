import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const applicationsOfIntegrationLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "applications-of-integration",
    slug: "area-volume-and-accumulated-change",
    title: "Area, volume, and accumulated change",
    position: 1,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["CHA-5.A", "CHA-5.B", "CHA-5.C", "CHA-4.D"],
    bodyPlain: [
      "Area between curves is the integral of the upper function minus the lower function on the interval where that order holds. If the curves cross, split the integral at the intersections. A vertical slice is dx; a horizontal slice is dy and uses right minus left. Sketch first. A solar-club graph of two irradiance models that cross at noon must be split at noon, or the signed areas cancel and understate the true region.",
      "Volumes of solids can be built from known cross sections or from disks and washers. A disk method spins a region around an axis and integrates pi times radius squared. A washer subtracts the inner radius squared. Cross sections perpendicular to an axis contribute an area A(x) that you integrate. Name the axis, name the radius in terms of the variable of integration, and check a sample slice against the sketch.",
      "Accumulation problems reuse the FTC in context. If a rate of members arriving is r(t) and a rate leaving is l(t), the net membership from a to b is the integral of r minus l. Adding an initial count gives the amount at time b. Average value of a function on [a, b] is 1 over (b-a) times the integral, which is the height of the rectangle that matches the net area. A swim-meet official who wants mean pool temperature over an hour is asking for that rectangle.",
      "Signed area versus geometric area is a wording trap. Displacement is signed. Distance traveled is the integral of speed. Volume is never negative; if a radius formula goes negative, you have the wrong expression. Read the request twice before you pick an integrand.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "applications-of-integration",
    slug: "arc-length-and-average-value",
    title: "Arc length and average value",
    position: 2,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["CHA-6.A", "CHA-4.D", "CHA-5.D"],
    bodyPlain: [
      "The arc length of a smooth graph y equals f(x) from x equals a to x equals b is the integral of the square root of 1 plus [f-prime(x)] squared. The integrand is the local stretch factor that turns a tiny dx into a tiny hypotenuse. If the curve is given as x equals g(y), swap the roles. A hiking-club elevation profile that is differentiable yields a trail length longer than the horizontal map distance; the extra length is exactly this integral.",
      "The formula assumes a continuously differentiable graph on the closed interval. A corner forces a split, just as a derivative that fails forces a split in earlier units. Algebraic simplification under the square root is worth doing: sometimes 1 plus [f-prime] squared is a perfect square and the integral collapses. If it does not collapse, a calculator-allowed numerical integral is still a legitimate evaluation of a correctly written length.",
      "Average value sits beside arc length as a second integral-as-summary. The average of f on [a, b] is the integral of f divided by the width. For a rate, that average is the constant rate that would produce the same net change. For a temperature, it is the constant temperature with the same accumulated degree-time. Do not confuse average value of a position function with average velocity; average velocity is the difference quotient of position, which equals the average value of velocity.",
      "Parametric arc length in the next unit replaces 1 plus [y-prime] squared with [x-prime] squared plus [y-prime] squared under the same square root. Learning the rectangular formula here as a Pythagorean stretch factor makes that replacement obvious instead of mysterious. Keep the picture: tiny horizontal step, tiny vertical step, hypotenuse added up.",
    ].join("\n\n"),
  },
];
