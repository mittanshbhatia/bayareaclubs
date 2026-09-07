import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const parametricPolarVectorLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "parametric-polar-vector",
    slug: "parametric-paths-and-vector-velocity",
    title: "Parametric paths and vector velocity",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["CHA-3.F", "CHA-3.G", "CHA-3.H", "CHA-4.C"],
    bodyPlain: [
      "A parametric path gives x(t) and y(t) separately. The slope dy/dx on the path is (dy/dt) divided by (dx/dt), provided the horizontal rate is not zero. A second derivative d squared y over dx squared is the derivative of that slope with respect to t, again divided by dx/dt. A sailing-club GPS track is already parametric: easting and northing versus clock time. The tangent slope at a moment is the ratio of those two clock rates.",
      "A vector-valued function r(t) equals x(t) i plus y(t) j packages the same path. Velocity is the derivative vector, acceleration is the second derivative vector. Speed is the magnitude of velocity: the square root of [x-prime] squared plus [y-prime] squared. Displacement over an interval is the integral of the velocity vector, componentwise. Distance traveled is the integral of speed. Those two numbers disagree whenever the path turns back or curves.",
      "Arc length of a parametric curve from t equals a to t equals b is the integral of speed. That is the same Pythagorean stretch as rectangular arc length, with both coordinates allowed to move. If a particle traces a loop, length counts the whole trip, not the chord from start to finish. Initial conditions matter when you recover position from velocity: integrate each component and add the starting coordinates.",
      "Horizontal and vertical tangents occur when one component of velocity vanishes and the other does not. Both vanishing at once is a singular moment that needs a separate look; the slope formula is silent there. Sketch the path from a table of t, x, y, and mark those special times before you compute a slope.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "parametric-polar-vector",
    slug: "polar-slopes-and-swept-area",
    title: "Polar slopes and swept area",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["CHA-5.A", "FUN-8.A", "CHA-5.B"],
    bodyPlain: [
      "Polar coordinates name a point by a radius r and an angle theta from the positive x-axis. The conversions x equals r cos theta and y equals r sin theta turn a polar curve r(theta) into a parametric curve with parameter theta. Differentiating those conversions and forming dy/dx produces the polar slope formula. At a given angle, you need r and r-prime; the slope is not r-prime alone.",
      "A cardioid, a rose, or a limaçon can pass through the origin. At the origin the angle may still be meaningful as a direction of arrival. Tangents at the pole occur at angles that make r equal zero. Count petals of a rose by watching r return to zero; a sine rose with even coefficient has twice as many petals as the coefficient, while an odd coefficient matches the coefficient. Those counts are geometry, not decoration.",
      "Area in polar form accumulates (1/2) r squared d(theta). The factor one-half r squared is the area of a thin sector. Integrate over the theta-interval that actually traces the region once. Overlapping a petal twice double-counts. Area between two polar curves is the integral of one-half times (r-outer squared minus r-inner squared) on the angles they share. Sketch and find the intersection angles before you write limits.",
      "Polar work is still calculus of change: a derivative for slope, an integral for swept area. The new habit is to let the angle be the parameter and to remember the Jacobian-like r in the area element. A campus map that plots a sprinkler radius versus angle is a polar area problem, not a rectangular one. Translate only if the rectangular form is truly simpler.",
    ].join("\n\n"),
  },
];
