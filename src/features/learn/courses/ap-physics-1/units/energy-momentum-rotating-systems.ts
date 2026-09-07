import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const energyMomentumRotatingSystemsLessons: readonly ApPhysics1Lesson[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "energy-momentum-rotating-systems",
    slug: "rotational-kinetic-energy-and-work",
    title: "Rotational kinetic energy and work",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["6.1.A", "6.2.A"],
    bodyPlain: [
      "A rigid object spinning about a fixed axis has rotational kinetic energy (1/2) I ω^2. The ω must be in radians per second. A club turntable with I = 0.050 kg·m^2 at 8.0 rad/s stores 1.6 J. The same object translating without spinning has (1/2) m v_cm^2. An object that both translates and rotates, such as a rolling disk, has both terms: K = (1/2) m v_cm^2 + (1/2) I_cm ω^2.",
      "Rolling without slipping links the two pieces by v_cm = r ω. A solid disk rolling from rest down a height h converts m g h into those two kinetic terms. Because I_cm = (1/2) m r^2 for a disk, the algebra gives (1/2) m v^2 + (1/4) m v^2 = m g h, so v = sqrt((4/3) g h). A hoop with I = m r^2 ends slower than the disk from the same height because more of the energy is parked in spin. Mass cancels; shape does not.",
      "Work by a torque is τ θ when the torque is constant and θ is the angular displacement in radians. That work equals the change in rotational kinetic energy when the torque is the net torque about the axis. A student who applies 2.0 N·m through 3.0 rad does 6.0 J of work. If friction torque does negative work, the rotational kinetic energy gain is smaller than the applied work.",
      "Energy bookkeeping still needs a defined system. Gravity can appear as m g h if Earth is in the system, or as work if Earth is outside. Friction that prevents slipping at a rolling contact does no work if the contact point is instantaneously at rest. Kinetic friction at a sliding contact does negative work and also provides a torque. Those two roles must be written in the matching accounts, not double-counted as a mysterious extra energy sink.",
      "Choose energy when the question asks for a speed after a large rotation or a drop. Choose τ_net = I α when the question asks for an angular acceleration at one instant. Rolling problems often need both: energy for the final speed, and a force-and-torque pair if you also need the friction size.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "energy-momentum-rotating-systems",
    slug: "angular-momentum-and-conservation",
    title: "Angular momentum and conservation",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["6.3.A", "6.3.B", "6.4.A"],
    bodyPlain: [
      "Angular momentum of a rigid object about a fixed axis is L = I ω, a signed quantity once you pick a sense of rotation. A particle moving in a line has angular momentum about a point equal to r m v sin φ, or m v times the perpendicular distance from the point to the line of motion. A 0.25 kg cart rolling at 1.6 m/s along a track whose closest approach to a floor mark is 0.40 m has angular momentum 0.16 kg·m^2/s about that mark, even though the cart is not spinning.",
      "Net external torque equals the rate of change of angular momentum: τ_net = ΔL / Δt for a constant torque, which is the impulse-angular-momentum theorem. A 0.15 N·m torque applied for 2.0 s changes L by 0.30 kg·m^2/s. If I is constant, that is also I Δω. If I changes, ω adjusts so that L follows the torque budget.",
      "If the net external torque on a system is zero, angular momentum is conserved. A student on a low-friction turntable who pulls weights inward decreases I and therefore increases ω so that I ω stays the same. Kinetic energy increases in that process because the student does positive work pulling the weights inward. Conservation of L is not conservation of rotational kinetic energy.",
      "A catch or a jump onto a merry-go-round is an angular-momentum problem if external torques about the axle are small during the short event. A 40 kg student stepping onto a 30 kg·m^2 disk that is already spinning must share the disk's angular momentum. Treat the student as a particle with I = m r^2 at the landing radius, add I values after the catch if they rotate together, and keep L_total the same.",
      "Direction of L uses the same clockwise-counterclockwise convention as torque. Opposite spins subtract. A wheel that reverses spin has a large ΔL and therefore needs a large impulse of torque. Club demonstrations with bicycle wheels should name the axis and the sign before anyone claims that a quantity was conserved.",
    ].join("\n\n"),
  },
];
