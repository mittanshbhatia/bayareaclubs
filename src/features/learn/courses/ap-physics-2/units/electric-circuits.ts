/**
 * Original circuit lessons. Public CED codes only. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";
import type { ApPhysics2Lesson } from "@/features/learn/courses/ap-physics-2/units/types";

export const electricCircuitsLessons: readonly ApPhysics2Lesson[] = [
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "electric-circuits",
    slug: "current-resistance-and-simple-circuits",
    title: "Current, resistance, and simple circuits",
    position: 5,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["11.1.A", "11.2.A", "11.3.A", "11.4.A"],
    bodyPlain: [
      "Current is charge passing a point per unit time. If 12 C of charge cross a motor lead in 4.0 s, the current is 3.0 A. Conventional current is drawn in the direction a positive charge would move, even when the actual carriers in a metal wire are electrons drifting the other way. A complete loop is required. A battery sitting in a drawer has potential difference but no current until a conducting path joins its terminals.",
      "Resistance tells you how much potential difference is needed to keep a given current moving. Ohm's law, V = I R, holds for many metals at steady temperature: a graph of V versus I is a straight line through the origin. Resistivity is a material property. A long, thin nichrome wire used as a club heater has more resistance than a short, thick copper jumper of the same length class because R = ρ L / A. Warm the metal and ρ usually rises, which is why some lamps glow dimmer after the filament heats.",
      "In a single-loop circuit the same current exists at every series element. The battery's potential rise equals the sum of the drops. Two lamps in series share that current and split the voltage. Two lamps in parallel each feel the full battery voltage, and the currents add at the junctions. Equivalent resistance rises when you add a series resistor and falls when you add a parallel branch. Students who memorize the formulas without drawing the junctions mix those cases.",
      "Electric power is the rate of energy transfer: P = I V, which becomes I^2 R or V^2 / R when Ohm's law holds. A 12 V robotics bus that delivers 2.0 A supplies 24 W. That energy becomes motion, heat, or light. A thin jumper with extra resistance wastes power as heat and also drops voltage that the motor never sees. The club's wiring diagram should name the source, the loads, and the return path. If a meter reading disagrees with the diagram, believe the junctions you can point to on the board before you blame the battery.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "electric-circuits",
    slug: "kirchhoff-and-rc-circuits",
    title: "Kirchhoff rules and RC circuits",
    position: 6,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["11.5.A", "11.6.A", "11.7.A", "11.8.A"],
    bodyPlain: [
      "Kirchhoff's junction rule is charge conservation at a node: current in equals current out. If 1.2 A arrives along one wire and 0.5 A leaves along a second, 0.7 A must leave along the remaining wire. The loop rule is energy conservation around a closed path: the signed sum of potential changes is zero. Walk with the current through a resistor and the potential drops I R. Walk through a battery from minus to plus and the potential rises by the emf, ignoring internal resistance unless the problem gives it.",
      "Multi-loop boards at a Science Olympiad station are not harder physics. They are more bookkeeping. Label each unknown current with an arrow. Write one junction equation and enough independent loop equations to match the number of unknowns. If a solved current comes out negative, the actual flow is opposite your arrow; the algebra already corrected you. Reducing a circuit by series-parallel chunks first is allowed when the network really is a nest of those patterns. It is not allowed when a resistor bridges two loops in a way that is neither series nor parallel.",
      "A capacitor in a DC circuit is an open after it is fully charged and a short-like path at the first instant of charging, because the plates start uncharged and the voltage across them is zero. During charging, the capacitor voltage rises toward the battery value while the current falls toward zero. The time scale is the product τ = R C. After one time constant the gap to the final value has shrunk by a factor of about 1/e. After several time constants the transient is practically over.",
      "Discharging reverses the story: stored charge leaves through the resistor, the current starts large and decays, and both Q and I follow falling exponentials. The photography club's flash waits for the capacitor voltage to climb, then closes a switch that dumps the charge through the tube. A larger R makes the wait longer. A larger C stores more charge at the same voltage but also lengthens τ. Sketch V_C and I on the same time axis, mark τ, and the verbal story matches the graph instead of fighting it.",
    ].join("\n\n"),
  },
];
