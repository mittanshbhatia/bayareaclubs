/**
 * Original magnetism lessons. Public CED codes only. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";
import type { ApPhysics2Lesson } from "@/features/learn/courses/ap-physics-2/units/types";

export const magnetismLessons: readonly ApPhysics2Lesson[] = [
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "magnetism-and-electromagnetism",
    slug: "magnetic-fields-and-moving-charges",
    title: "Magnetic fields and moving charges",
    position: 7,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["12.1.A", "12.2.A", "12.3.A"],
    bodyPlain: [
      "A bar magnet on a Fremont astronomy table has a field you can map with a compass. Field lines leave the north end and enter the south end. They form closed loops through the magnet. They never cross. The density of lines is a picture of field strength. Earth itself is a magnet, which is why a compass is useful on a coastal hike, but the classroom field of a neodymium disk can swamp Earth's field at a few centimeters.",
      "A charge sitting still in a magnetic field feels no magnetic force. A charge moving through the field feels F = q v B sinθ, with the direction given by a right-hand rule for positive charge. The force is always perpendicular to both v and B, so it can bend a path without changing speed. In a uniform field perpendicular to v, the path is a circle whose radius is m v / (q B). Reverse the charge sign and the circle bends the other way. That is why a velocity selector and a mass spectrograph can sort particles without measuring them by hand.",
      "A current is a stream of moving charges, so a wire in a magnetic field can feel a force. The magnitude is I L B sinθ for a straight segment. Two parallel wires attract if their currents run the same way and repel if the currents oppose. A current loop in a uniform field feels a torque that tries to line its face with the field. Motors in the robotics kit are engineered versions of that torque: coils, a magnet, and a way to reverse current so the twist keeps going.",
      "Sources of B include permanent magnets and currents. A long straight wire makes circles around itself. A solenoid makes a nearly uniform field inside and a weak field outside, which is why the club's electromagnet coil is wound as a stack of loops. Increase the current or the turn density and B inside grows. Stick an iron core in the solenoid and the field grows again because the core magnetizes. Draw the wire, the current arrow, and the compass circles before you plug in numbers. The geometry is the argument; the formula is the scale.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "magnetism-and-electromagnetism",
    slug: "induction-and-faraday",
    title: "Induction and Faraday's law",
    position: 8,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["12.4.A"],
    bodyPlain: [
      "Magnetic flux through a loop is B A cosθ: how much field pierces the area, counting the tilt. Faraday's law says a changing flux induces an emf around the loop. You can change flux by changing B, by changing the area, or by rotating the loop so the angle changes. A bike-hub dynamo on a Redwood City ride does the last of these. Pedal faster and the flux through the coil flips more often, so the induced voltage rises and the lamp brightens.",
      "Lenz's law picks the direction. The induced current makes its own field that opposes the change in flux that created it. If a north pole approaches a copper ring, the ring becomes a north face to push back. If the same pole is leaving, the ring becomes a south face to try to keep the flux. Opposition is not stubbornness. It is energy conservation. If the induced current helped the change, you would get free energy from a magnet and a coil.",
      "A quantitative check is ε = ΔΦ / Δt for the magnitude, with the sign from Lenz. Pull a magnet out of a 40-turn coil in 0.20 s and the emf is 40 times the flux change per second for one turn. A short, violent pull beats a slow pull of the same magnet because the same ΔΦ is packed into a smaller Δt. Opening or closing a switch in a neighboring circuit can also induce a pulse, because the field through the second loop jumps.",
      "Eddy currents are induced loops inside a solid conductor. Drop an aluminum plate between the poles of a strong magnet and it falls slowly: induced currents fight the motion and the energy becomes heat. The same idea is why a copper disk on a lab stand damps a swinging magnet. Club designs that move metal near magnets should decide whether that damping is wanted, as in a brake, or unwanted, as in a generator that overheats. Name the flux, name the change, then name the induced current. The rest is algebra.",
    ].join("\n\n"),
  },
];
