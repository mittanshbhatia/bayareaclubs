/**
 * Original thermodynamics lessons. Public CED codes only. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";
import type { ApPhysics2Lesson } from "@/features/learn/courses/ap-physics-2/units/types";

export const thermodynamicsLessons: readonly ApPhysics2Lesson[] = [
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "thermodynamics",
    slug: "kinetic-theory-and-ideal-gas",
    title: "Kinetic theory and the ideal gas",
    position: 1,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["9.1.A", "9.1.B", "9.2.A"],
    bodyPlain: [
      "The Environmental Club at a Peninsula high school fills a weather-balloon envelope with helium on the quad. The gas inside is a swarm of particles that bounce off each other and off the envelope. Each bounce is a tiny impulse. Pressure on a wall is the total perpendicular force from those collisions divided by the wall's area. If the same gas is squeezed into a smaller volume at the same temperature, collisions happen more often on each square centimeter, so the pressure rises.",
      "Temperature is not a separate fluid poured into the balloon. It is a measure of the average translational kinetic energy of the particles. Heat the helium and the typical speed goes up. Faster particles hit harder and more often, so a rigid tank at fixed volume shows a higher pressure. Cool the tank and the opposite happens. A Maxwell-style speed graph for a hotter sample is stretched toward higher speeds; the peak moves right and the high-speed tail grows.",
      "An ideal-gas model ignores particle volume and treats collisions as elastic, with no lingering attractions. That model is written PV = nRT, or PV = NkT if you count particles instead of moles. The letters are not decorations. If n and T stay fixed, P and V trade off as a hyperbola. If V is locked by a metal cylinder, P tracks T in a straight line through the origin on an absolute-temperature scale. Club data that fail those shapes usually mean a leak, a wet sensor, or a temperature that was read in Celsius and then used as if it were kelvin.",
      "A useful lab habit is to change one variable on purpose. The club can warm a sealed syringe in a water bath while holding the plunger so volume stays nearly constant, or let the plunger slide so pressure stays near atmospheric. In the first run, pressure should rise with kelvin temperature. In the second, volume should rise with kelvin temperature. Drawing both graphs on the same notebook page makes the ideal-gas relationship visible without calculus: three measurable quantities, one constraint, and a clear story about what the particles are doing.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "thermodynamics",
    slug: "first-law-entropy-and-heat-engines",
    title: "First law, entropy, and heat engines",
    position: 2,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["9.3.A", "9.4.A", "9.5.A", "9.6.A"],
    bodyPlain: [
      "Energy that enters a sample as heat is not a substance, but it is bookkeeping you can trust. When two objects touch, energy flows from the hotter one to the colder one until their temperatures match. The amount needed to raise a sample's temperature is m c ΔT when no phase change occurs. Different materials have different specific heats, which is why a metal clamp from a steam table burns fingers faster than a wooden stirrer at the same temperature: the metal dumps energy into skin more readily for the same temperature drop.",
      "The first law ties that heat to work and to the internal energy of the system. A compact statement is ΔU = Q + W once you pick a sign convention and keep it. If the club compresses air in a bike-pump barrel quickly, the barrel feels warmer: work was done on the gas, so internal energy rose even if little heat had time to leave. If the same gas expands against a piston and does work on the surroundings, internal energy falls unless heat is supplied. On a PV diagram, work for a quasi-static process is the area under the path. Different paths between the same two points can have different Q and W, but ΔU depends only on the state.",
      "A heat engine is any loop that takes in energy from a hot reservoir, dumps some to a colder one, and turns the difference into work. Thermal efficiency is W_out divided by Q_in. It cannot reach 100 percent, because some energy must leave to the cold side if the working gas is to return to its starting state. A refrigerator is the reverse story: work is paid to pull energy from a cold box and dump it into a warmer room. Neither device violates energy conservation. Both are limited by the fact that a process that would make heat flow by itself from cold to hot does not occur.",
      "Entropy tracks how spread out energy becomes. When a hot soldering iron and a cold heat sink equalize, the iron loses energy and the sink gains the same amount, but the entropy of the pair rises. Isolated systems drift toward more ways to arrange the same energy. That is why a movie of perfume mixing into a classroom never runs backward on its own. Club engines and ice-bath calorimeters are small enough that you can name the reservoirs, measure Q, and argue whether a proposed cycle is even possible before you build it.",
    ].join("\n\n"),
  },
];
