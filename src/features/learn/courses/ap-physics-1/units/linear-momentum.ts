import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const linearMomentumLessons: readonly ApPhysics1Lesson[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "linear-momentum",
    slug: "impulse-and-momentum-change",
    title: "Impulse and momentum change",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["4.1.A", "4.2.A", "4.2.B"],
    bodyPlain: [
      "Linear momentum of a single object is the vector p = m v. A 0.20 kg cart at 1.5 m/s to the right has momentum 0.30 kg·m/s to the right. Doubling the mass at the same velocity doubles the momentum. Reversing the velocity reverses the momentum. Total momentum of a system is the vector sum of the pieces. Opposite motions can cancel in the sum even though both objects are moving.",
      "Impulse is the product F Δt for a constant force, or the area under a force-versus-time graph for a varying force. Impulse equals the change in momentum of the object that force acts on: F_net Δt = Δp. This is Newton's second law in a form that is friendly to short collisions. A hallway bumper that delivers an average 12 N for 0.050 s imparts 0.60 N·s of impulse, so a 0.40 kg cart changes velocity by 1.5 m/s in the impulse direction.",
      "The same momentum change can come from a large force in a short time or a smaller force in a longer time. That is why a crumple zone or a bent-knee landing reduces peak force. The impulse needed to stop a moving object is fixed by the required Δp. Stretching the time interval lowers the average force. Club crash-test videos should report both the velocity change and the contact time if the team wants a force estimate.",
      "Direction still matters. Catching a cart that arrives from the left requires an impulse to the right if the cart is to stop. Bouncing the cart back to the left requires a larger rightward impulse, because the momentum must go from a leftward value through zero to a rightward value. The change Δp is final minus initial, with signs.",
      "When several external forces act, the net impulse is the time-integral of the net force. Internal forces between pieces of the same system cancel in the system's total impulse budget. That cancellation is why a system isolated from external impulses keeps a constant total momentum, which is the subject of the next lesson.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "linear-momentum",
    slug: "conservation-and-collisions",
    title: "Conservation and collisions",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["4.3.A", "4.4.A", "4.4.B"],
    bodyPlain: [
      "If the net external impulse on a system is zero, or is negligible during a short collision, the system's total linear momentum is constant. That is conservation of linear momentum. A pair of low-friction carts on a level track is the usual club demonstration. During the brief contact, the track's friction impulse is tiny compared with the huge internal contact impulse, so the two-cart momentum sum is nearly the same before and after.",
      "In one dimension, m1 v1i + m2 v2i = m1 v1f + m2 v2f. If the carts stick together, the collision is perfectly inelastic and they share one unknown final velocity. That extra condition closes the algebra. Kinetic energy is not conserved in a perfectly inelastic collision; some mechanical energy becomes thermal energy and deformation. Momentum conservation does not require energy conservation.",
      "An elastic collision conserves both momentum and kinetic energy. In this course you may use the one-dimensional elastic result when a problem states the collision is elastic, or you may solve the pair of conservation equations. A 0.30 kg cart at 1.0 m/s that strikes a resting 0.30 kg cart elastically transfers its velocity; the first cart stops and the second leaves at 1.0 m/s. Unequal masses exchange velocities in a less symmetric way, but the two conservation laws still determine the outcome.",
      "Explosions and spring launches between two carts are inelastic in reverse: kinetic energy increases because stored energy is released, while momentum of the pair still sums to the original total. Two carts at rest that push apart with a compressed spring have total momentum zero afterward, so their momenta are opposite. The lighter cart gets the larger speed.",
      "Two-dimensional collisions conserve momentum by component. Draw before and after velocity arrows, pick axes, and write a conservation equation for x and another for y. A glancing puck collision on a cafeteria table is a standard picture. You cannot finish the algebra with momentum alone if both final directions are unknown, unless the problem supplies extra geometry or states that the collision is elastic. Read what is given before inventing a missing law.",
    ].join("\n\n"),
  },
];
