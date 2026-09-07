/**
 * Original electrostatics lessons. Public CED codes only. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";
import type { ApPhysics2Lesson } from "@/features/learn/courses/ap-physics-2/units/types";

export const electricForceFieldPotentialLessons: readonly ApPhysics2Lesson[] = [
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "electric-force-field-potential",
    slug: "charge-force-and-electric-fields",
    title: "Charge, force, and electric fields",
    position: 3,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["10.1.A", "10.2.A", "10.3.A"],
    bodyPlain: [
      "Peninsula Robotics stores extra 3D-printer filament on a plastic rack. On a dry afternoon, a student peels tape from a roll and the loose end jumps toward a metal bench. That jump is electric charge rearranging. Charge is conserved: rubbing does not create charge from nothing. It separates charge that was already there. Conductors let charge move freely; insulators hold it nearly in place. A grounded bench can supply or remove electrons so a charged object can neutralize without the students inventing new charge.",
      "Two point charges push or pull along the line that joins them. The force magnitude is k |q1 q2| / r^2, and the direction is repulsive for like signs and attractive for opposite signs. Double one charge and the force doubles. Double the separation and the force falls by four. The constant k is large, which is why even a small imbalance on a balloon can lift hair. Vector addition still applies: if three charged pith balls hang near one another, you add the force arrows from each pair before you predict the net motion.",
      "A field is a way to talk about the force that would act on a test charge before you place that charge. The electric field E at a point is F on a small positive test charge divided by that charge. Field arrows leave positive charge and end on negative charge. Near an isolated positive sphere they spread outward. Between two large parallel plates with opposite charge they are nearly uniform in the middle and fray at the edges. A field diagram is not decoration. The spacing and direction tell you how a free charge would accelerate.",
      "Charging by contact shares charge on contact. Charging by induction rearranges charge without touching the object you intend to charge. Bring a negative rod near an isolated conducting can, ground the far side so electrons leave, then disconnect the ground before you remove the rod. The can is left positive. Club demonstrations fail when someone forgets the order: if you remove the rod first, the charge flows back and the can is neutral again. Write the steps, name which object is grounded, and the sign story stays consistent.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "electric-force-field-potential",
    slug: "potential-energy-potential-and-capacitors",
    title: "Potential, energy, and capacitors",
    position: 4,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["10.4.A", "10.5.A", "10.6.A", "10.7.A"],
    bodyPlain: [
      "Electric potential energy is the stored ability to do work because charges sit in a field. Move a positive charge in the direction of the field and the field does work; the potential energy drops. Push that charge against the field and you do work; the potential energy rises. For a pair of point charges the energy depends on the product of the charges and on 1/r. Opposite charges have a lower energy when they are closer. Like charges have a lower energy when they are farther apart.",
      "Potential V is potential energy per unit charge. It is a scalar, so you add numbers, not arrows. Around a positive point charge, V is high nearby and falls as 1/r. Equipotential surfaces are perpendicular to field lines. On a contour map of V, a steep drop means a strong field. The difference ΔV between two points is minus the work per unit charge the field would do along a path from one point to the other. In a uniform field that difference is simply E times the distance measured along the field.",
      "A capacitor stores charge at a potential difference. For a parallel-plate pair, C = ε0 A / d in air, and Q = C V. Increase the plate area or shrink the gap and the capacitance rises. Slide a dielectric into the gap and C rises again because the material polarizes and reduces the field for a given free charge. Energy stored can be written (1/2) C V^2 or Q^2 / (2C). Disconnect the battery and then pull the plates apart: Q is fixed, C falls, V rises, and the stored energy increases because you did mechanical work.",
      "Conservation of electric energy is the same bookkeeping used in mechanics, now with qV terms. A proton released from rest in a 200 V gap gains kinetic energy q ΔV. An electron fired at a metal plate needs enough kinetic energy to climb the potential hill or it turns back. The photography club's flash capacitor is a practical version of this ledger: the pack charges slowly from a battery, then dumps stored energy through a tube in a short pulse. If the voltage rating is ignored, the dielectric fails and the energy leaves as heat and a snap instead of light.",
    ].join("\n\n"),
  },
];
