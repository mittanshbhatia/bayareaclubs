/**
 * BayAreaClubs study tools for AP Physics 1.
 * Five kinds: practice, quiz, review, notes, readiness.
 * Not cloned from any commercial AP chrome.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "mixed-mechanics-practice",
    title: "Mixed mechanics practice",
    description:
      "Original multiple-choice items drawn from kinematics through fluids. Use these to check algebra and free-body bookkeeping, not to memorize a bank.",
    questionSlugs: [
      "cart-distance-versus-displacement",
      "crate-static-friction-threshold",
      "chassis-kinetic-energy-double-speed",
      "bumper-impulse-delta-v",
      "wrench-torque-perpendicular",
      "constant-torque-work",
      "shm-period-independent-of-amplitude",
      "hose-nozzle-continuity",
    ],
  },
  {
    kind: "quiz",
    slug: "eight-unit-checkpoint-quiz",
    title: "Eight-unit checkpoint quiz",
    description:
      "One harder original item from each official 2024 unit. Submit each choice; explanations stay with the course answer key.",
    questionSlugs: [
      "projectile-highest-point-velocity",
      "two-object-pulley-acceleration",
      "friction-work-on-track",
      "spring-explosion-opposite-momenta",
      "turntable-angular-displacement",
      "turntable-pull-weights-in",
      "spring-oscillator-max-speed",
      "tank-hole-exit-speed",
    ],
  },
  {
    kind: "review",
    slug: "walk-the-eight-units",
    title: "Walk the eight units",
    description:
      "A lesson path through all official AP Physics 1 units in public 2024 order, one teaching pair at a time.",
    lessonSlugs: [
      "scalars-vectors-and-one-d-motion",
      "graphs-relative-motion-and-projectiles",
      "forces-free-body-diagrams-and-newtons-laws",
      "friction-springs-and-circular-motion",
      "work-kinetic-energy-and-potential-energy",
      "mechanical-energy-conservation-and-power",
      "impulse-and-momentum-change",
      "conservation-and-collisions",
      "rotational-kinematics-and-torque",
      "rotational-inertia-and-newtons-second-for-rotation",
      "rotational-kinetic-energy-and-work",
      "angular-momentum-and-conservation",
      "defining-simple-harmonic-motion",
      "energy-and-period-of-oscillators",
      "density-pressure-and-buoyancy",
      "continuity-and-bernoulli",
    ],
  },
  {
    kind: "notes",
    slug: "equation-ledger-notes",
    title: "Equation ledger notes",
    description:
      "Lesson-tied notes for the algebra relations used in this course: motion equations, energy ledgers, impulse, torque, SHM periods, and fluid constants.",
    lessonSlugs: [
      "scalars-vectors-and-one-d-motion",
      "work-kinetic-energy-and-potential-energy",
      "impulse-and-momentum-change",
      "rotational-kinematics-and-torque",
      "energy-and-period-of-oscillators",
      "density-pressure-and-buoyancy",
    ],
  },
  {
    kind: "readiness",
    slug: "unit-test-readiness",
    title: "Unit-test readiness",
    description:
      "A readiness mix that samples easy identification items and multi-step algebra items before a club or class test.",
    questionSlugs: [
      "vertical-toss-top-acceleration",
      "backpack-third-law-pair",
      "backpack-lift-average-power",
      "equal-mass-elastic-transfer",
      "disk-net-torque-alpha",
      "rolling-disk-versus-hoop-speed",
      "pendulum-length-period",
      "full-submersion-buoyant-force",
    ],
    lessonSlugs: [
      "graphs-relative-motion-and-projectiles",
      "friction-springs-and-circular-motion",
      "mechanical-energy-conservation-and-power",
      "conservation-and-collisions",
    ],
  },
];

export default tools;
