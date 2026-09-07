import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const differentialEquationsLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "differential-equations",
    slug: "slope-fields-and-separable-models",
    title: "Slope fields and separable models",
    position: 1,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-7.A", "FUN-7.B", "FUN-7.C", "FUN-7.E", "FUN-7.F"],
    bodyPlain: [
      "A first-order differential equation names the slope at each point in the plane. A slope field draws short segments with those slopes. A solution curve is a path that follows the field. You can sketch a solution through a given starting point without solving algebraically by stepping along the segments. An environmental club's lake-temperature model that says dT/dt equals k times (ambient minus T) produces a field that always points toward the ambient line.",
      "Separable equations can be rewritten so that each variable sits with its own differential. Integrate both sides, then apply the initial condition to fix the constant. Exponential models dy/dt equals k y separate as dy/y equals k dt and produce y equals A e to the k t. Verify a proposed solution by differentiating it and substituting back into the differential equation. Verification does not require that you were the person who guessed the formula.",
      "Particular solutions need an initial condition. A general solution still has a family parameter. If a problem gives y of 0 equals 4, that number pins the family to one curve. If the field has an equilibrium line where the slope is zero, constant solutions may sit on that line. Check constant solutions separately; separation can lose them if you divide by an expression that is zero there.",
      "Units and sign of k decide growth versus decay. A positive k in dy/dt equals k y is explosive growth; a negative k is decay toward zero. In Newton's-law-style cooling, the sign is arranged so that T is pulled toward ambient. Write a sentence about the long-run behavior before you celebrate the closed form.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "differential-equations",
    slug: "euler-steps-and-logistic-growth",
    title: "Euler steps and logistic growth",
    position: 2,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-7.D", "FUN-7.G", "FUN-7.A"],
    bodyPlain: [
      "Euler's method walks a slope field with a fixed step size. From a point (x, y), compute the slope from the differential equation, then step to x plus h and y plus h times that slope. Repeat. The path is a polygonal approximation, not the true solution. Smaller h usually tracks the field more closely, but each step still uses only the slope at the current left endpoint. A coding club that simulates a cooling mug with h equal to 5 minutes will miss the curvature that a 30-second step would catch.",
      "Keep a table: old x, old y, slope, new y. Arithmetic errors compound, so write more digits than you think you need until the last report. Euler can overshoot an equilibrium or drift off a tight curve. That is not a defect in the idea; it is the cost of a first-order tangent step. Later, series solutions and better numerical methods exist, but BC asks you to execute Euler by hand on a short run and interpret the estimate.",
      "A logistic model has the form dy/dt equals k y times (L minus y), or an equivalent scaling. The solutions stay between 0 and L when they start there. L is the carrying capacity: the population, membership, or infected-count ceiling the model believes in. The graph is S-shaped. Growth is fastest at y equals L/2, where the product y(L-y) peaks. As t grows, y approaches L. As a club-membership story, early recruiting is slow, mid-year is steep, and late-year stalls as the school runs out of free afternoons.",
      "Equilibrium solutions of the logistic equation sit at y equals 0 and y equals L. A phase-line view shows 0 unstable and L attracting for the usual positive k. You can separate variables and integrate with partial fractions to obtain an explicit formula, but many exam tasks only need the field, the carrying capacity, the fastest-growth height, and a sentence about long-run behavior. Write those four before you hunt a closed form.",
    ].join("\n\n"),
  },
];
