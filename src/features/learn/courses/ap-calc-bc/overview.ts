/**
 * Short original course overview. source_basis: ORIGINAL.
 */

import {
  AP_CALC_BC_FRAMEWORK_CODE,
  AP_CALC_BC_FRAMEWORK_YEAR,
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";

export const overview = {
  namespace: AP_CALC_BC_NAMESPACE,
  frameworkCode: AP_CALC_BC_FRAMEWORK_CODE,
  frameworkYear: AP_CALC_BC_FRAMEWORK_YEAR,
  sourceBasis: AP_CALC_BC_SOURCE_BASIS,
  title: "AP Calculus BC",
  bodyPlain: [
    "AP Calculus BC extends the limit-derivative-integral story into techniques and models that AB only previews. Students learn to treat a rate as a function, recover net change from that rate, and then push the same language into parametric motion, polar area, Euler steps, logistic growth, improper integrals, and infinite series.",
    "The course is written for Bay Area club and school settings: a robotics battery curve, a swim-meet timer, a hiking elevation profile, a solar-club panel angle. Each unit keeps the public 2019 CED topic codes as metadata only. The teaching prose and items are original BayAreaClubs work, not College Board, Stellar, or any other bank.",
    "Finish the ten units with a working habit: name the object (limit, derivative, integral, series), choose a justified tool, and state what the number means in the situation. That habit is what later units, especially series remainder bounds, actually require.",
  ].join("\n\n"),
} as const;

export default overview;
