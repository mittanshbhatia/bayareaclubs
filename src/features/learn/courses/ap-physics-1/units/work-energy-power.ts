import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const workEnergyPowerLessons: readonly ApPhysics1Lesson[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "work-energy-power",
    slug: "work-kinetic-energy-and-potential-energy",
    title: "Work, kinetic energy, and potential energy",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["3.1.A", "3.2.A", "3.3.A"],
    bodyPlain: [
      "Translational kinetic energy of a system whose center of mass moves at speed v is (1/2) m v^2. It is a scalar and cannot be negative. Doubling the speed quadruples the kinetic energy. A 0.50 kg robotics chassis rolling at 1.2 m/s stores 0.36 J. The same chassis at 2.4 m/s stores 1.44 J. Kinetic energy depends on speed relative to the chosen inertial frame, so a cart at rest on a moving wagon has kinetic energy relative to the ground.",
      "Work by a constant force is F d cos θ, where θ is the angle between the force and the displacement of the point of application. Work is a scalar and can be positive, negative, or zero. A perpendicular force does no work. Kinetic friction on a sliding crate does negative work because the force is opposite the displacement. The work-energy theorem for a particle or a rigid object treated as a particle says the net work equals the change in translational kinetic energy. If several forces act, you may add their works or compute the work of the net force; both routes give ΔK.",
      "A force that varies, such as an ideal spring force, needs a different bookkeeping device. The work done by an ideal spring while the stretch changes from x1 to x2 is (1/2) k x1^2 - (1/2) k x2^2. That is why we define elastic potential energy U_s = (1/2) k x^2. You are not asked to integrate. You are asked to use that stored-energy expression as a given algebra relation.",
      "Gravitational potential energy near Earth's surface can be written U_g = m g h, where h is height above a chosen reference. The reference is arbitrary. Only changes in U_g matter for later energy accounting. Raising a 2.0 kg camera 1.5 m onto a theater lighting rail increases U_g by about 29 J. Lowering it the same distance decreases U_g by the same amount. If the object moves horizontally at constant height, U_g does not change.",
      "Potential energy belongs to a system, not to a lone object in isolation. U_g belongs to Earth plus the raised object. U_s belongs to the spring plus whatever is stretching it. If you refuse to put Earth or the spring inside the system, those interactions become external work instead of potential-energy changes. Either bookkeeping is legal if you stay consistent. Mixing the two in the same sentence is what produces double counting.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "work-energy-power",
    slug: "mechanical-energy-conservation-and-power",
    title: "Mechanical energy conservation and power",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["3.4.A", "3.4.B", "3.5.A"],
    bodyPlain: [
      "Mechanical energy is the sum of kinetic energy and the potential energies you have included in the system. If the only interactions that do work are ones already represented by those potential energies, mechanical energy is constant. A cart that coasts from rest down a smooth track of height 0.40 m converts m g h into (1/2) m v^2, so v = sqrt(2 g h), independent of mass. The mass cancels. Friction on a rough patch removes mechanical energy. That removed energy is not gone from the universe; it has left the mechanical account as thermal energy.",
      "Conservation statements need a defined system and a defined interval. Write E_mech,i + W_nonconservative = E_mech,f, or write K_i + U_i + W_nc = K_f + U_f. Negative work by kinetic friction makes the final mechanical energy smaller. A club track with a 0.30 kg cart, a 0.25 m drop, and -0.20 J of friction work has (1/2)(0.30) v^2 = (0.30)(9.8)(0.25) - 0.20, which you can solve for v. Skipping the friction term predicts a speed that the photogate will not show.",
      "Energy bar charts are a qualitative check. If a pendulum bob is released from rest, the initial bar is all gravitational potential, the lowest point is all kinetic, and a later equal height is all potential again if the pivot is nearly frictionless. If the later height is lower, a nonconservative process took a share. Students should be able to sketch those bars without numbers and then add numbers when a problem supplies them.",
      "Power is the rate of energy transfer. Average power is work divided by time, or energy transferred divided by time. Instantaneous power by a force is F v cos θ when the force and velocity are known at that instant. A student who lifts a 120 N backpack 0.80 m in 1.5 s does 96 J of work at an average power of 64 W. The same lift in 0.75 s is the same work at twice the power. A motor rating in watts is a power limit, not a stored-energy tank.",
      "Choose the method that matches the question. If you need acceleration at one instant, Newton's second law is usually cleaner. If you need a speed after a long, changing force, energy is usually cleaner. The two accounts agree when both are applied carefully. They are not competing worldviews. They are two ledgers for the same motion.",
    ].join("\n\n"),
  },
];
