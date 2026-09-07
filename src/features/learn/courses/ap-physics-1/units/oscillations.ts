import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const oscillationsLessons: readonly ApPhysics1Lesson[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "oscillations",
    slug: "defining-simple-harmonic-motion",
    title: "Defining simple harmonic motion",
    position: 1,
    estimatedMinutes: 21,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["7.1.A", "7.2.A", "7.3.A"],
    bodyPlain: [
      "Simple harmonic motion is the special oscillation whose restoring force is proportional to displacement from equilibrium and opposite that displacement: F = -k x for a mass on an ideal spring. The motion repeats with a constant period if friction is ignored. Equilibrium is the position where the net force is zero. For a horizontal spring that is the unstretched length. For a vertical spring it is the stretched length where k Δx = m g, and the extra gravity is already balanced before you measure x from that new zero.",
      "The displacement from equilibrium can be written x = A cos(2π t / T) or x = A sin(2π t / T), depending on the starting point you choose. A is the amplitude, the maximum |x|. T is the period, the time for one full cycle. Frequency is f = 1 / T. Angular frequency in this course is ω = 2π f = 2π / T, in rad/s. You use these as algebra relations. You do not derive them from a differential equation.",
      "Velocity is zero at the endpoints and largest at equilibrium. Acceleration is largest at the endpoints, where |x| = A, and zero at equilibrium. That pairing follows from a = F / m = -(k / m) x. A 0.20 kg mass on a 80 N/m spring with A = 0.050 m has a maximum restoring force of 4.0 N and a maximum acceleration of 20 m/s^2, at the endpoints only.",
      "Graphs of x, v, and a versus time are sine or cosine curves that are quarter-cycle out of step. When x is a cosine that starts at +A, v starts at zero and then goes negative, and a starts at its most negative value. Reading those graphs is a standard skill. A period is the time from peak to next peak, not the time from zero to the first peak.",
      "Not every back-and-forth motion is simple harmonic. A cart bouncing between rigid walls at constant speed between impacts is periodic but not SHM, because the restoring force is not -k x. A pendulum is treated as SHM only for small angles, where the restoring component is approximately proportional to displacement along the arc. Large-angle swings are periodic without matching the SHM period formula.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "oscillations",
    slug: "energy-and-period-of-oscillators",
    title: "Energy and period of oscillators",
    position: 2,
    estimatedMinutes: 21,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["7.2.B", "7.4.A", "7.4.B"],
    bodyPlain: [
      "The period of a mass-spring oscillator is T = 2π sqrt(m / k). Mass in the numerator means a heavier block on the same spring is slower. A stiffer spring, larger k, is faster. Amplitude does not appear. A 0.25 kg block on a 100 N/m spring has T ≈ 0.31 s whether you pull it 3 cm or 6 cm, as long as the spring stays ideal and friction is negligible.",
      "The period of a simple pendulum for small angles is T = 2π sqrt(L / g). Mass does not appear. A longer string is slower. The same pendulum on a planet with larger g is faster. A 0.80 m string at g = 9.8 m/s^2 has T ≈ 1.8 s. Shortening the string to 0.20 m halves T, because of the square root. Club timing labs should measure several cycles and divide, so a reaction-time error is a smaller fraction of the total.",
      "Mechanical energy of an ideal mass-spring oscillator is constant and equal to (1/2) k A^2. At the endpoint, that energy is all elastic potential. At equilibrium, it is all kinetic: (1/2) m v_max^2 = (1/2) k A^2, so v_max = A sqrt(k / m). At a general position, (1/2) m v^2 + (1/2) k x^2 = (1/2) k A^2. That single equation answers most energy questions without solving for time.",
      "A pendulum's small-angle energy account swaps the spring term for a gravitational term that depends on height. At the end of a swing the bob is highest and slowest. At the bottom it is lowest and fastest. The height relative to the bottom is L - L cos θ, or approximately L θ^2 / 2 for small θ in radians. You may use either form if the problem supplies the needed angle or height.",
      "Damping and driving sit at the edge of this course. Light friction slowly shrinks amplitude and therefore shrinks the energy (1/2) k A^2. A periodic push at the natural frequency can grow the amplitude; that is resonance. A club speaker that rattles a hanging card at one frequency but not at nearby frequencies is showing a resonance peak, not a new force law.",
    ].join("\n\n"),
  },
];
