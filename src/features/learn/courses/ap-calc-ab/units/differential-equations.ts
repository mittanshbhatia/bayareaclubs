/**
 * Unit 7 lessons. source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { ApCalcAbLesson } from "@/features/learn/courses/ap-calc-ab/units/limits-and-continuity";

export const lessons: readonly ApCalcAbLesson[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "slope-fields-and-solutions",
    title: "Slope fields and solutions",
    unitSlug: "differential-equations",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["FUN-7.A", "FUN-7.B", "FUN-7.C"],
    bodyPlain: [
      "A first-order differential equation states how a slope depends on the current point. The equation dy/dx = x - y does not give y as a formula. It gives a rule for the tangent slope at each (x, y). A slope field draws short segments of those slopes on a grid. The science club sketches one on graph paper before anyone solves the equation in closed form.",
      "A solution curve must follow the short segments. Through a typical point there is one smooth curve that matches the field. An initial condition picks that curve out of a family. The general solution has an arbitrary constant. The particular solution pins the constant with a known point, such as y(0) = 2.",
      "You can check a proposed formula without drawing. Differentiate it and substitute into the differential equation. If both sides match for the domain you care about, the formula is a solution. If an initial point fails, you have a solution of the equation but not of the initial-value problem.",
      "Qualitative reading matters as much as algebra. Where the field is horizontal, solutions flatten. Where segments get steep, solutions rise or fall quickly. Equilibrium solutions are horizontal lines that stay put because the slope is zero along them. A slope field is a map of tendencies, not a decoration behind an answer key.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "separable-equations-and-growth",
    title: "Separable equations and growth",
    unitSlug: "differential-equations",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["FUN-7.D", "FUN-7.E", "FUN-7.F"],
    bodyPlain: [
      "A separable equation can be written so every y sits with dy and every x sits with dx. Then you integrate both sides. The model dy/dx = 2x / y with y not zero becomes y dy = 2x dx. Integrating produces y^2 / 2 = x^2 + C. An initial condition such as y(0) = 4 fixes C and chooses the positive or negative branch if the context demands one.",
      "Exponential growth and decay are the separable equations students meet most often. If a quantity grows at a rate proportional to itself, dy/dt = ky. Separating and integrating yields ln|y| = kt + C, so y = A e^(kt). The garden club's yeast starter in a warm kitchen is a friendly picture of k positive. A cooling mug on a foggy morning is k negative when the model is written as a drop toward an ambient value.",
      "The constant A is not a decoration. It is the value of y when t = 0 for the pure exponential model, or a translated value when the equation is y' = k(y - L). Always return to the story: what is y, what is t, and what does a positive k claim about the club's quantity.",
      "Not every differential equation in this course is separable, but the ones you are asked to solve in closed form will separate or already be a familiar exponential. When a closed form is ugly or unavailable, a slope field plus an Euler-step sketch still answers qualitative questions: increasing or decreasing, concave which way, approaching which line. The equation is a rule for change. The solution is a history that obeys that rule.",
    ].join("\n\n"),
  },
];
