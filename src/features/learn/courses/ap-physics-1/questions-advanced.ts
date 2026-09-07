/**
 * Advanced original AP Physics 1 items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "energy-not-force-balance",
    lessonSlug: "mechanical-energy-conservation-and-power",
    prompt:
      "A cart of mass m slides down a frictionless ramp of height h. Speed at the bottom is:",
    choices: ["sqrt(2gh)", "gh", "mgh", "2gh"],
    answer: "a",
    explanation:
      "mgh = (1/2)mv^2 → v=sqrt(2gh). The ramp angle cancels for a frictionless path between the same heights.",
    codes: ["3.2.A"],
  }),
  originalItem({
    slug: "momentum-explosion-cm",
    lessonSlug: "conservation-and-collisions",
    prompt:
      "Two glued carts at rest push apart. If no external horizontal force acts, the center of mass:",
    choices: [
      "Moves toward the heavier cart.",
      "Stays put while the carts move opposite ways.",
      "Accelerates with the lighter cart.",
      "Must move because kinetic energy appears.",
    ],
    answer: "b",
    explanation:
      "Internal pushes cancel. KE can appear from stored energy while the CM remains at rest. Momentum is still zero.",
    codes: ["4.3.A"],
  }),
  originalItem({
    slug: "torque-sign-and-lever",
    lessonSlug: "rotational-kinematics-and-torque",
    prompt:
      "A 2.0 m uniform board hinged at one end is held horizontal. A 40 N sign hangs at the free end. The hinge torque from the sign is magnitude:",
    choices: ["40 N·m", "80 N·m", "20 N·m", "0 because the hinge is the axis"],
    answer: "b",
    explanation:
      "Torque is rFsinθ. Horizontal board, vertical weight, r=2.0 m → 80 N·m. The hinge is the axis, so the sign's weight still produces torque about that axis.",
    codes: ["5.1.A"],
  }),
  originalItem({
    slug: "shm-period-mass",
    lessonSlug: "energy-and-period-of-oscillators",
    prompt:
      "A spring-mass oscillator has period T. If mass becomes 4m and k is unchanged, the new period is:",
    choices: ["T/2", "T", "2T", "4T"],
    answer: "c",
    explanation:
      "T=2π sqrt(m/k). Four times the mass doubles the period. Amplitude does not enter the ideal period.",
    codes: ["6.2.A"],
  }),
  originalItem({
    slug: "bernoulli-speed-up",
    lessonSlug: "continuity-and-bernoulli",
    prompt:
      "Water in a horizontal hose speeds up as the hose narrows. Bernoulli says the pressure in the narrow part:",
    choices: [
      "Rises because speed rose.",
      "Falls if height is unchanged and the flow is ideal.",
      "Must equal atmospheric pressure only.",
      "Is independent of speed.",
    ],
    answer: "b",
    explanation:
      "Along a horizontal streamline, higher speed means lower pressure. Continuity raises speed in the constriction; Bernoulli then drops the pressure.",
    codes: ["8.4.A"],
  }),
  originalItem({
    slug: "projectile-time-symmetry",
    lessonSlug: "graphs-relative-motion-and-projectiles",
    prompt:
      "A ball is kicked from level ground with v_y = 12 m/s. Ignoring air, time to return is about (g=10 m/s^2):",
    choices: ["0.6 s", "1.2 s", "2.4 s", "12 s"],
    answer: "c",
    explanation:
      "Time up is v_y/g=1.2 s. Symmetric return makes 2.4 s. Horizontal speed does not set hang time on level ground.",
    codes: ["1.4.A"],
  }),
] as const;
