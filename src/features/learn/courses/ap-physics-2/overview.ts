/**
 * Original course overview. source_basis: ORIGINAL. Plain text only.
 */

import {
  AP_PHYSICS_2_FRAMEWORK_CODE,
  AP_PHYSICS_2_FRAMEWORK_YEAR,
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";

export const overview = {
  namespace: AP_PHYSICS_2_NAMESPACE,
  frameworkCode: AP_PHYSICS_2_FRAMEWORK_CODE,
  frameworkYear: AP_PHYSICS_2_FRAMEWORK_YEAR,
  sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
  title: "AP Physics 2 at BayAreaClubs",
  bodyPlain: [
    "This course is original BayAreaClubs teaching for algebra-based AP Physics 2. Students learn to model gases and heat, electric force and potential, circuits, magnetism, images, waves, and modern physics, then defend a claim with a diagram, a proportion, or a measured number.",
    "The seven units follow the public 2024 course sequence: thermodynamics; electric force, field, and potential; electric circuits; magnetism and electromagnetism; geometric optics; waves, sound, and physical optics; and modern physics. Lessons stay algebra-based. They use club labs and Bay Area settings—weather balloons, robotics buses, bike dynamos, theater light-pipes, and orchestra rooms—so a symbol always names a thing a student could touch.",
    "Objective codes are public 2024 CED identifiers only. Lesson text and questions were written here from scratch. This is not College Board, Stellar, or any other bank, and it is not a copy of the Physics 1 course.",
  ].join("\n\n"),
} as const;

export const OVERVIEW_PLAIN = overview.bodyPlain;

export default overview;
