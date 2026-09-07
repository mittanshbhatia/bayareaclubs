/**
 * Original BayAreaClubs multiple-choice items for AP Physics 1.
 * Written from scratch. Not derived from College Board, Unlimited Voices,
 * Stellar Learning, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";

export type ApPhysics1ChoiceId = "a" | "b" | "c" | "d";

export type ApPhysics1Choice = {
  id: ApPhysics1ChoiceId;
  text: string;
};

export type ApPhysics1Difficulty = "easy" | "medium" | "hard";

export type ApPhysics1Question = {
  namespace: typeof AP_PHYSICS_1_NAMESPACE;
  slug: string;
  lessonSlug: string | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApPhysics1Choice, ApPhysics1Choice, ApPhysics1Choice, ApPhysics1Choice];
  answerId: ApPhysics1ChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApPhysics1Difficulty;
  sourceBasis: typeof AP_PHYSICS_1_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApPhysics1Question[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "cart-distance-versus-displacement",
    lessonSlug: "scalars-vectors-and-one-d-motion",
    questionType: "multiple_choice",
    prompt:
      "A Peninsula Robotics cart rolls 6.0 m toward the gym, then 2.0 m back toward the library. What is the displacement relative to the start if the gym direction is positive?",
    choices: [
      { id: "a", text: "8.0 m toward the gym" },
      { id: "b", text: "4.0 m toward the gym" },
      { id: "c", text: "6.0 m toward the gym" },
      { id: "d", text: "2.0 m toward the library" },
    ],
    answerId: "b",
    explanation:
      "Displacement is the net change in position: +6.0 m plus -2.0 m equals +4.0 m toward the gym. Distance would be 8.0 m, which is not asked.",
    objectiveCodes: ["1.1.A", "1.2.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "ramp-slowing-acceleration-direction",
    lessonSlug: "scalars-vectors-and-one-d-motion",
    questionType: "multiple_choice",
    prompt:
      "A cart rolls up a hallway ramp toward the north door and is slowing down. Which statement is correct if north is positive?",
    choices: [
      { id: "a", text: "Velocity is positive and acceleration is positive." },
      { id: "b", text: "Velocity is positive and acceleration is negative." },
      { id: "c", text: "Velocity is negative and acceleration is negative." },
      { id: "d", text: "Velocity is zero and acceleration is zero at every instant." },
    ],
    answerId: "b",
    explanation:
      "The cart still moves north, so velocity is positive. Slowing means acceleration is opposite velocity, so acceleration is negative.",
    objectiveCodes: ["1.2.B"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "vertical-toss-top-acceleration",
    lessonSlug: "scalars-vectors-and-one-d-motion",
    questionType: "multiple_choice",
    prompt:
      "A science-club water bottle is tossed straight up. Air resistance is ignored. At the highest point, which pair is correct?",
    choices: [
      { id: "a", text: "Velocity is zero and acceleration is zero." },
      { id: "b", text: "Velocity is zero and acceleration is g downward." },
      { id: "c", text: "Velocity is g downward and acceleration is zero." },
      { id: "d", text: "Velocity is g upward and acceleration is g downward." },
    ],
    answerId: "b",
    explanation:
      "The instantaneous velocity is zero at the top of a vertical toss, but gravity still provides acceleration g downward.",
    objectiveCodes: ["1.2.A", "1.2.B"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "projectile-highest-point-velocity",
    lessonSlug: "graphs-relative-motion-and-projectiles",
    questionType: "multiple_choice",
    prompt:
      "A physics club launches a balloon at 10 m/s at 40 degrees above the horizontal from field level. Air resistance is ignored. At the highest point, the velocity is",
    choices: [
      { id: "a", text: "zero." },
      { id: "b", text: "10 m/s at 40 degrees below the horizontal." },
      { id: "c", text: "horizontal, with size 10 cos 40° m/s." },
      { id: "d", text: "vertical, with size 10 sin 40° m/s." },
    ],
    answerId: "c",
    explanation:
      "v_x stays 10 cos 40° while v_y is zero at the top, so the velocity is horizontal and not zero.",
    objectiveCodes: ["1.5.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "backpack-third-law-pair",
    lessonSlug: "forces-free-body-diagrams-and-newtons-laws",
    questionType: "multiple_choice",
    prompt:
      "A 40 N backpack rests on a classroom floor. The floor pushes up on the backpack with 40 N. What is the third-law partner of that upward force?",
    choices: [
      { id: "a", text: "Earth pulling down on the backpack with 40 N" },
      { id: "b", text: "The backpack pushing down on the floor with 40 N" },
      { id: "c", text: "The floor pushing down on Earth with 40 N" },
      { id: "d", text: "Air pushing down on the backpack with 40 N" },
    ],
    answerId: "b",
    explanation:
      "The partner acts on the other object in the pair: backpack on floor, same size, opposite direction. Weight is a different pair with Earth.",
    objectiveCodes: ["2.3.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "two-object-pulley-acceleration",
    lessonSlug: "forces-free-body-diagrams-and-newtons-laws",
    questionType: "multiple_choice",
    prompt:
      "A 0.20 kg hallway cart is connected over a light pulley to a 0.050 kg hanging mass. Friction is negligible. What is the magnitude of the acceleration of the cart?",
    choices: [
      { id: "a", text: "9.8 m/s^2" },
      { id: "b", text: "2.5 m/s^2" },
      { id: "c", text: "2.0 m/s^2" },
      { id: "d", text: "0.98 m/s^2" },
    ],
    answerId: "c",
    explanation:
      "Treat cart plus hanging mass as the system: a = (0.050 × 9.8) / 0.25 = 2.0 m/s^2. Using only the cart's mass in the denominator is the usual error.",
    objectiveCodes: ["2.5.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "crate-static-friction-threshold",
    lessonSlug: "friction-springs-and-circular-motion",
    questionType: "multiple_choice",
    prompt:
      "An 80 N crate sits on a level club-room floor with μ_s = 0.40. What is the smallest horizontal pull that can start the crate sliding?",
    choices: [
      { id: "a", text: "20 N" },
      { id: "b", text: "32 N" },
      { id: "c", text: "80 N" },
      { id: "d", text: "200 N" },
    ],
    answerId: "b",
    explanation:
      "Maximum static friction is μ_s N = 0.40 × 80 N = 32 N. A smaller pull is balanced by a smaller static friction.",
    objectiveCodes: ["2.7.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "tethered-mass-centripetal-force",
    lessonSlug: "friction-springs-and-circular-motion",
    questionType: "multiple_choice",
    prompt:
      "A 0.15 kg mass on a string moves in a horizontal circle of radius 0.80 m at 2.0 m/s. What net inward force is required?",
    choices: [
      { id: "a", text: "0.38 N" },
      { id: "b", text: "0.75 N" },
      { id: "c", text: "1.5 N" },
      { id: "d", text: "2.4 N" },
    ],
    answerId: "b",
    explanation:
      "F_net inward equals m v^2 / r = 0.15 × 4.0 / 0.80 = 0.75 N. There is no extra outward force on the mass in the inertial lab frame.",
    objectiveCodes: ["2.9.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "chassis-kinetic-energy-double-speed",
    lessonSlug: "work-kinetic-energy-and-potential-energy",
    questionType: "multiple_choice",
    prompt:
      "A 0.50 kg robotics chassis has 0.36 J of kinetic energy at 1.2 m/s. If the speed becomes 2.4 m/s, the kinetic energy is",
    choices: [
      { id: "a", text: "0.36 J" },
      { id: "b", text: "0.72 J" },
      { id: "c", text: "1.44 J" },
      { id: "d", text: "2.88 J" },
    ],
    answerId: "c",
    explanation:
      "Kinetic energy scales as v^2. Doubling the speed multiplies K by four: 4 × 0.36 J = 1.44 J.",
    objectiveCodes: ["3.1.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "friction-work-on-track",
    lessonSlug: "mechanical-energy-conservation-and-power",
    questionType: "multiple_choice",
    prompt:
      "A 0.30 kg cart drops 0.25 m on a club track. Friction does -0.20 J of work. What is the cart's kinetic energy at the bottom if it started from rest?",
    choices: [
      { id: "a", text: "0.54 J" },
      { id: "b", text: "0.74 J" },
      { id: "c", text: "0.94 J" },
      { id: "d", text: "1.14 J" },
    ],
    answerId: "a",
    explanation:
      "m g h = 0.30 × 9.8 × 0.25 = 0.735 J. Adding W_nc = -0.20 J leaves about 0.54 J of kinetic energy.",
    objectiveCodes: ["3.4.A", "3.4.B"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "backpack-lift-average-power",
    lessonSlug: "mechanical-energy-conservation-and-power",
    questionType: "multiple_choice",
    prompt:
      "A student lifts a 120 N backpack 0.80 m onto a theater rail in 1.5 s at constant speed. The average power delivered by the student is",
    choices: [
      { id: "a", text: "64 W" },
      { id: "b", text: "96 W" },
      { id: "c", text: "144 W" },
      { id: "d", text: "160 W" },
    ],
    answerId: "a",
    explanation:
      "Work is 120 × 0.80 = 96 J. Average power is 96 J / 1.5 s = 64 W. 96 W is the work misread as power.",
    objectiveCodes: ["3.5.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "horizontal-carry-work",
    lessonSlug: "work-kinetic-energy-and-potential-energy",
    questionType: "multiple_choice",
    prompt:
      "A stage crew carries a 2.0 kg camera 8.0 m down a level aisle at constant height and constant speed. The work done by gravity during that walk is",
    choices: [
      { id: "a", text: "160 J" },
      { id: "b", text: "16 J" },
      { id: "c", text: "0 J" },
      { id: "d", text: "-160 J" },
    ],
    answerId: "c",
    explanation:
      "Gravity is vertical and the displacement is horizontal, so cos 90° is zero and gravity does no work. Height did not change.",
    objectiveCodes: ["3.2.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "bumper-impulse-delta-v",
    lessonSlug: "impulse-and-momentum-change",
    questionType: "multiple_choice",
    prompt:
      "A hallway bumper delivers an average 12 N for 0.050 s to a 0.40 kg cart. The magnitude of the cart's velocity change is",
    choices: [
      { id: "a", text: "0.60 m/s" },
      { id: "b", text: "1.5 m/s" },
      { id: "c", text: "3.0 m/s" },
      { id: "d", text: "6.0 m/s" },
    ],
    answerId: "b",
    explanation:
      "Impulse is 12 × 0.050 = 0.60 N·s = Δp. Then Δv = 0.60 / 0.40 = 1.5 m/s.",
    objectiveCodes: ["4.2.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "bounce-needs-larger-impulse",
    lessonSlug: "impulse-and-momentum-change",
    questionType: "multiple_choice",
    prompt:
      "A cart with momentum 0.30 kg·m/s to the left hits a spring stop. Which outcome requires the largest magnitude impulse from the stop?",
    choices: [
      { id: "a", text: "The cart stops and stays at rest." },
      { id: "b", text: "The cart leaves at 0.10 kg·m/s to the left." },
      { id: "c", text: "The cart leaves at 0.30 kg·m/s to the right." },
      { id: "d", text: "The cart leaves at 0.10 kg·m/s to the right." },
    ],
    answerId: "c",
    explanation:
      "Δp is final minus initial. From -0.30 to +0.30 is 0.60 kg·m/s, larger than stopping (0.30) or a weaker rebound.",
    objectiveCodes: ["4.2.B"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "equal-mass-elastic-transfer",
    lessonSlug: "conservation-and-collisions",
    questionType: "multiple_choice",
    prompt:
      "A 0.30 kg cart at 1.0 m/s strikes a resting 0.30 kg cart on a low-friction track. The collision is elastic. The best description of the velocities just after contact is",
    choices: [
      { id: "a", text: "both carts move at 0.50 m/s in the original direction." },
      { id: "b", text: "the first cart stops and the second moves at 1.0 m/s." },
      { id: "c", text: "the first cart rebounds at 1.0 m/s and the second stays at rest." },
      { id: "d", text: "both carts move at 1.0 m/s in the original direction." },
    ],
    answerId: "b",
    explanation:
      "Equal-mass one-dimensional elastic collisions exchange velocities. Sticking together would be perfectly inelastic, not elastic.",
    objectiveCodes: ["4.4.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "spring-explosion-opposite-momenta",
    lessonSlug: "conservation-and-collisions",
    questionType: "multiple_choice",
    prompt:
      "Two low-friction carts at rest push apart when a compressed spring between them is released. Cart A has twice the mass of cart B. After they separate,",
    choices: [
      { id: "a", text: "A has twice the speed of B and the same momentum magnitude." },
      { id: "b", text: "B has twice the speed of A and the momenta have equal magnitude." },
      { id: "c", text: "both speeds are equal and both momenta are zero." },
      { id: "d", text: "B has four times the speed of A because kinetic energy is conserved." },
    ],
    answerId: "b",
    explanation:
      "Total momentum stays zero, so the momenta are opposite and equal in magnitude. The lighter cart B therefore has twice the speed of A.",
    objectiveCodes: ["4.3.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "wrench-torque-perpendicular",
    lessonSlug: "rotational-kinematics-and-torque",
    questionType: "multiple_choice",
    prompt:
      "A student applies 20 N perpendicular to a 0.30 m wrench handle. The magnitude of the torque about the bolt is",
    choices: [
      { id: "a", text: "6.0 N·m" },
      { id: "b", text: "20 N·m" },
      { id: "c", text: "0.30 N·m" },
      { id: "d", text: "67 N·m" },
    ],
    answerId: "a",
    explanation:
      "τ = r F sin 90° = 0.30 × 20 = 6.0 N·m. A force along the handle would give zero torque.",
    objectiveCodes: ["5.3.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "turntable-angular-displacement",
    lessonSlug: "rotational-kinematics-and-torque",
    questionType: "multiple_choice",
    prompt:
      "A club turntable speeds from rest to 4.0 rad/s in 2.0 s with constant angular acceleration. The angular displacement during those 2.0 s is",
    choices: [
      { id: "a", text: "2.0 rad" },
      { id: "b", text: "4.0 rad" },
      { id: "c", text: "8.0 rad" },
      { id: "d", text: "16 rad" },
    ],
    answerId: "b",
    explanation:
      "α = 4.0 / 2.0 = 2.0 rad/s^2. Then θ = (1/2) α t^2 = 0.5 × 2.0 × 4.0 = 4.0 rad. Average ω times t gives the same 4.0 rad.",
    objectiveCodes: ["5.1.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "disk-net-torque-alpha",
    lessonSlug: "rotational-inertia-and-newtons-second-for-rotation",
    questionType: "multiple_choice",
    prompt:
      "A disk with I = 0.080 kg·m^2 feels a net torque of 0.24 N·m. The magnitude of its angular acceleration is",
    choices: [
      { id: "a", text: "0.019 rad/s^2" },
      { id: "b", text: "0.32 rad/s^2" },
      { id: "c", text: "3.0 rad/s^2" },
      { id: "d", text: "33 rad/s^2" },
    ],
    answerId: "c",
    explanation:
      "α = τ_net / I = 0.24 / 0.080 = 3.0 rad/s^2.",
    objectiveCodes: ["5.5.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "mass-on-rod-inertia",
    lessonSlug: "rotational-inertia-and-newtons-second-for-rotation",
    questionType: "multiple_choice",
    prompt:
      "A 0.40 kg point mass sits on a very light 0.50 m rod that is pivoted at the other end. The rotational inertia about the pivot is",
    choices: [
      { id: "a", text: "0.10 kg·m^2" },
      { id: "b", text: "0.20 kg·m^2" },
      { id: "c", text: "0.40 kg·m^2" },
      { id: "d", text: "1.0 kg·m^2" },
    ],
    answerId: "a",
    explanation:
      "For a particle, I = m r^2 = 0.40 × 0.25 = 0.10 kg·m^2. Using m r instead of m r^2 is the common mistake.",
    objectiveCodes: ["5.4.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "rolling-disk-versus-hoop-speed",
    lessonSlug: "rotational-kinetic-energy-and-work",
    questionType: "multiple_choice",
    prompt:
      "A solid disk and a thin hoop of equal mass and radius roll without slipping from rest down the same height. Which finishes with the larger center-of-mass speed?",
    choices: [
      { id: "a", text: "The hoop, because more energy is in rotation." },
      { id: "b", text: "The disk, because a smaller fraction of the energy is in rotation." },
      { id: "c", text: "They finish with equal speeds because mass and height match." },
      { id: "d", text: "The hoop, because I is smaller for a hoop." },
    ],
    answerId: "b",
    explanation:
      "Both convert m g h into (1/2) m v^2 + (1/2) I ω^2 with v = r ω. The hoop has larger I, so more energy is rotational and v is smaller.",
    objectiveCodes: ["6.1.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "constant-torque-work",
    lessonSlug: "rotational-kinetic-energy-and-work",
    questionType: "multiple_choice",
    prompt:
      "A student applies a constant 2.0 N·m torque through 3.0 rad. The work done by that torque is",
    choices: [
      { id: "a", text: "0.67 J" },
      { id: "b", text: "5.0 J" },
      { id: "c", text: "6.0 J" },
      { id: "d", text: "12 J" },
    ],
    answerId: "c",
    explanation:
      "W = τ θ = 2.0 × 3.0 = 6.0 J when θ is in radians.",
    objectiveCodes: ["6.2.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "turntable-pull-weights-in",
    lessonSlug: "angular-momentum-and-conservation",
    questionType: "multiple_choice",
    prompt:
      "A student on a low-friction turntable holds masses at arm's length and is spinning. The student then pulls the masses inward. Which pair is correct if external torques are negligible?",
    choices: [
      { id: "a", text: "L stays the same and rotational kinetic energy stays the same." },
      { id: "b", text: "L stays the same and rotational kinetic energy increases." },
      { id: "c", text: "L decreases and rotational kinetic energy decreases." },
      { id: "d", text: "L increases and rotational kinetic energy stays the same." },
    ],
    answerId: "b",
    explanation:
      "Angular momentum I ω is conserved, so ω rises when I falls. Rotational kinetic energy (1/2) I ω^2 increases because the student does work pulling the masses in.",
    objectiveCodes: ["6.4.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "particle-angular-momentum-about-mark",
    lessonSlug: "angular-momentum-and-conservation",
    questionType: "multiple_choice",
    prompt:
      "A 0.25 kg cart rolls at 1.6 m/s on a straight track. The perpendicular distance from a floor mark to the track is 0.40 m. The magnitude of the cart's angular momentum about that mark is",
    choices: [
      { id: "a", text: "0.10 kg·m^2/s" },
      { id: "b", text: "0.16 kg·m^2/s" },
      { id: "c", text: "0.40 kg·m^2/s" },
      { id: "d", text: "1.0 kg·m^2/s" },
    ],
    answerId: "b",
    explanation:
      "L = m v ℓ_perp = 0.25 × 1.6 × 0.40 = 0.16 kg·m^2/s. The cart does not have to be spinning about its own center.",
    objectiveCodes: ["6.3.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "shm-period-independent-of-amplitude",
    lessonSlug: "energy-and-period-of-oscillators",
    questionType: "multiple_choice",
    prompt:
      "A 0.25 kg block on a 100 N/m spring oscillates with amplitude 3.0 cm. If the amplitude is changed to 6.0 cm and friction stays negligible, the period",
    choices: [
      { id: "a", text: "doubles." },
      { id: "b", text: "halves." },
      { id: "c", text: "stays the same." },
      { id: "d", text: "quadruples because energy quadrupled." },
    ],
    answerId: "c",
    explanation:
      "T = 2π sqrt(m / k) does not include amplitude. Energy does increase, but the period of ideal SHM does not.",
    objectiveCodes: ["7.2.B"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "pendulum-length-period",
    lessonSlug: "energy-and-period-of-oscillators",
    questionType: "multiple_choice",
    prompt:
      "A small-angle pendulum on a 0.80 m string is shortened to 0.20 m. The new period is what factor times the original period?",
    choices: [
      { id: "a", text: "1/4" },
      { id: "b", text: "1/2" },
      { id: "c", text: "2" },
      { id: "d", text: "4" },
    ],
    answerId: "b",
    explanation:
      "T scales as sqrt(L). The length is divided by 4, so T is divided by 2.",
    objectiveCodes: ["7.2.B"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "spring-oscillator-max-speed",
    lessonSlug: "energy-and-period-of-oscillators",
    questionType: "multiple_choice",
    prompt:
      "A 0.20 kg mass on an 80 N/m spring oscillates with amplitude 0.050 m. The maximum speed is",
    choices: [
      { id: "a", text: "0.50 m/s" },
      { id: "b", text: "1.0 m/s" },
      { id: "c", text: "2.0 m/s" },
      { id: "d", text: "20 m/s" },
    ],
    answerId: "b",
    explanation:
      "v_max = A sqrt(k / m) = 0.050 × sqrt(80 / 0.20) = 0.050 × 20 = 1.0 m/s. 20 m/s is the maximum acceleration, not the speed.",
    objectiveCodes: ["7.4.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "walls-not-shm",
    lessonSlug: "defining-simple-harmonic-motion",
    questionType: "multiple_choice",
    prompt:
      "A cart bounces between two rigid walls at constant speed between the impacts. The motion is periodic. Why is it not simple harmonic motion?",
    choices: [
      { id: "a", text: "Periodic motion is never simple harmonic." },
      { id: "b", text: "The restoring force is not proportional to displacement from equilibrium." },
      { id: "c", text: "The cart changes direction, which SHM never does." },
      { id: "d", text: "SHM requires a pendulum string." },
    ],
    answerId: "b",
    explanation:
      "SHM needs F = -k x, or the equivalent acceleration law. Constant-speed runs plus sudden wall impulses do not provide that force law.",
    objectiveCodes: ["7.1.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "shoe-pressure-on-floor",
    lessonSlug: "density-pressure-and-buoyancy",
    questionType: "multiple_choice",
    prompt:
      "A 400 N student stands on one shoe sole of area 0.020 m^2. The pressure on the floor under that sole is",
    choices: [
      { id: "a", text: "8.0 Pa" },
      { id: "b", text: "8.0 × 10^2 Pa" },
      { id: "c", text: "2.0 × 10^4 Pa" },
      { id: "d", text: "2.0 × 10^6 Pa" },
    ],
    answerId: "c",
    explanation:
      "P = F / A = 400 / 0.020 = 2.0 × 10^4 Pa.",
    objectiveCodes: ["8.2.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "full-submersion-buoyant-force",
    lessonSlug: "density-pressure-and-buoyancy",
    questionType: "multiple_choice",
    prompt:
      "A 0.0020 m^3 aluminum block is held fully under fresh water. The buoyant force on the block is",
    choices: [
      { id: "a", text: "0.020 N" },
      { id: "b", text: "2.0 N" },
      { id: "c", text: "19.6 N" },
      { id: "d", text: "depends on the aluminum density." },
    ],
    answerId: "c",
    explanation:
      "F_b = ρ V g = 1000 × 0.0020 × 9.8 = 19.6 N. The object's own density affects weight, not the buoyant force when V_displaced is fixed.",
    objectiveCodes: ["8.4.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "hose-nozzle-continuity",
    lessonSlug: "continuity-and-bernoulli",
    questionType: "multiple_choice",
    prompt:
      "A hose of interior area 5.0 × 10^-4 m^2 feeds a nozzle of area 1.0 × 10^-4 m^2. If the hose speed is 0.80 m/s, the nozzle speed is",
    choices: [
      { id: "a", text: "0.16 m/s" },
      { id: "b", text: "0.80 m/s" },
      { id: "c", text: "1.6 m/s" },
      { id: "d", text: "4.0 m/s" },
    ],
    answerId: "d",
    explanation:
      "A1 v1 = A2 v2, so v2 = 0.80 × (5.0 / 1.0) = 4.0 m/s. Narrower section, larger speed.",
    objectiveCodes: ["8.6.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    slug: "tank-hole-exit-speed",
    lessonSlug: "continuity-and-bernoulli",
    questionType: "multiple_choice",
    prompt:
      "An open tank of still water has a small hole 1.25 m below the free surface. The best estimate of the exit speed is",
    choices: [
      { id: "a", text: "1.6 m/s" },
      { id: "b", text: "3.5 m/s" },
      { id: "c", text: "5.0 m/s" },
      { id: "d", text: "12 m/s" },
    ],
    answerId: "c",
    explanation:
      "With v_top ≈ 0 and P the same (atmosphere) at both points, Bernoulli gives v = sqrt(2 g h) = sqrt(2 × 9.8 × 1.25) = 5.0 m/s.",
    objectiveCodes: ["8.5.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    version: 1,
  },
];
