/**
 * Unit 8 lessons. source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { ApCalcAbLesson } from "@/features/learn/courses/ap-calc-ab/units/limits-and-continuity";

export const lessons: readonly ApCalcAbLesson[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "area-between-curves",
    title: "Area between curves",
    unitSlug: "applications-of-integration",
    position: 1,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["CHA-4.B", "CHA-4.C", "CHA-4.D"],
    bodyPlain: [
      "Area between two graphs is an integral of a difference. If f sits above g on [a, b], the area is the integral of f(x) - g(x) from a to b. The top-minus-bottom order keeps the integrand nonnegative, so the result is area rather than a signed cancellation. The art club paints a banner whose upper edge follows y = x and whose lower edge follows y = x^2 on [0, 1]. The enclosed paint area is the integral of x - x^2, which equals 1/6.",
      "Sometimes the curves cross. Split the interval at each intersection so that on every piece you know which function is on top. Integrating a single difference across a crossing will subtract a region you meant to add. Finding intersections is part of the setup, not an optional sketch.",
      "You can slice with respect to y when the left and right edges are easier to name as functions of y. Then the integrand is right minus left, and the limits are the lower and upper y-values. The same painted banner can be described either way if you rewrite the edges. Choose the variable that avoids splitting, when you can.",
      "A definite integral of a rate still means accumulated change even in this unit. Area language is geometry. Accumulation language is context. Both are the same arithmetic: add many thin contributions and pass to the limit. The sentence you write should match the quantity the club actually cares about.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "volume-and-accumulated-change",
    title: "Volume and accumulated change",
    unitSlug: "applications-of-integration",
    position: 2,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["CHA-5.A", "CHA-5.B", "CHA-5.C"],
    bodyPlain: [
      "Volume from known cross sections is another integral of a slice area. If every cross section perpendicular to the x-axis has area A(x), the volume is the integral of A(x) dx along the solid. Squares, semicircles, and equilateral triangles are the usual slice shapes in this course. The robotics club's foam bumper can be modeled that way when each slice is a known polygon.",
      "Solids of revolution are the special case where each slice is a disk or a washer. Rotate y = sqrt(x) from x = 0 to x = 4 about the x-axis and each slice is a disk of radius sqrt(x), so A(x) = π x and the volume is 8π. A washer appears when a hole is left by a second function: π times (outer radius squared minus inner radius squared). Draw the radius in the same direction you integrate.",
      "Displacement is the integral of velocity. Distance traveled is the integral of speed, which means you split wherever velocity changes sign and add the absolute contributions. A ferry-club model that goes forward and then reverse can have displacement near zero while the hull still traveled a long path. Mixing those two words is a scoring error, not a rounding error.",
      "Every application in this unit is the same habit: name the thin piece, write its contribution, add, and take a limit that becomes an integral. Area, volume, and net change are different nouns for that habit. If you can explain the piece, you can set up the integral even when the antiderivative is messy.",
    ].join("\n\n"),
  },
];
