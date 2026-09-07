import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const torqueAndRotationalDynamicsLessons: readonly ApPhysics1Lesson[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "torque-and-rotational-dynamics",
    slug: "rotational-kinematics-and-torque",
    title: "Rotational kinematics and torque",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["5.1.A", "5.2.A", "5.3.A"],
    bodyPlain: [
      "Rotation about a fixed axis has angular cousins of the linear kinematics relations. Angular displacement θ is in radians in every formula that mixes with s, v, or a. Constant angular acceleration α obeys ω = ω0 + α t, θ = θ0 + ω0 t + (1/2) α t^2, and ω^2 = ω0^2 + 2 α (θ - θ0). These are algebra copies of the linear set. A turntable that speeds from rest to 4.0 rad/s in 2.0 s has α = 2.0 rad/s^2 and turns through 4.0 rad in that interval.",
      "A point at distance r from the axis has arc displacement s = r θ, tangential speed v = r ω, and tangential acceleration a_t = r α, with θ in radians. It also has centripetal acceleration v^2 / r = r ω^2 toward the axis if it is moving in a circle. A 0.12 m-radius wheel at 15 rad/s has rim speed 1.8 m/s. The two accelerations are perpendicular: a_t changes the speed, and a_c changes the direction.",
      "Torque measures how effectively a force tends to change rotation about a chosen axis. For a force of size F whose line of action is a perpendicular distance ℓ from the axis, τ = F ℓ. Equivalently, τ = r F sin φ, where r is the distance from axis to the point of application and φ is the angle between r and F. A 20 N force applied perpendicular to a 0.30 m wrench produces 6.0 N·m. The same force along the handle produces zero torque because sin φ is zero.",
      "Sign of torque is a convention about clockwise versus counterclockwise. Once you pick a positive sense, every torque and the resulting α must use it. A beam with one counterclockwise torque of 4.0 N·m and one clockwise torque of 1.5 N·m has net torque 2.5 N·m in the counterclockwise sense. Net torque, not the prettiest single force, decides how the angular velocity will change.",
      "A rigid object in rotational equilibrium has net torque zero about any axis you choose, and also net force zero. That is why a loaded see-saw can sit still even though large forces act. Taking torques about a support can hide that support's force from the torque equation, which is a useful algebra trick, not a claim that the support is irrelevant to force balance.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "torque-and-rotational-dynamics",
    slug: "rotational-inertia-and-newtons-second-for-rotation",
    title: "Rotational inertia and Newton's second law for rotation",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["5.4.A", "5.5.A", "5.5.B"],
    bodyPlain: [
      "Rotational inertia I measures how a mass distribution resists angular acceleration about a stated axis. For a single particle, I = m r^2. For a system, I is the sum of m r^2 for the pieces, using each piece's distance to that same axis. A 0.40 kg mass on a very light 0.50 m rod, pivoted at the other end, has I = 0.10 kg·m^2. Moving the mass closer to the pivot shrinks I quickly because of the square.",
      "This course gives I for common rigid shapes as listed data: a hoop about its center is M R^2, a solid cylinder or disk about its central axis is (1/2) M R^2, a solid sphere about a diameter is (2/5) M R^2, and a thin rod about a perpendicular axis through its center is (1/12) M L^2. You are not asked to derive those factors with calculus. You are asked to pick the matching expression and substitute.",
      "Newton's second law for rotation about a fixed axis is τ_net = I α. It is the angular partner of F_net = m a. A disk with I = 0.080 kg·m^2 that feels a net torque of 0.24 N·m has α = 3.0 rad/s^2. If two torques act, add them with signs before dividing by I. Massive objects with mass far from the axis need more torque for the same α.",
      "Linear and rotational laws often apply together. A yo-yo or a spool pulled by a string has F_net = m a for the center of mass and τ_net = I α about the center, linked by a = r α if the string does not slip. A cart attached to a hanging mass over a massive pulley needs the pulley’s I in the torque equation; pretending the pulley is massless overestimates the acceleration.",
      "The parallel-axis idea appears in words even when a formula sheet lists I about a convenient center: moving the axis away from the center of mass increases I. A door is harder to swing when the hinge is not at the usual edge. For numbers, use the listed I about the axis the problem names. If the problem does not name I, it will give enough masses and distances to build I from m r^2 pieces.",
    ].join("\n\n"),
  },
];
