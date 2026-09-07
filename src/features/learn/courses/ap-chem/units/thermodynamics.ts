/**
 * Original lessons for Thermodynamics.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const thermodynamicsLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "thermodynamics",
    slug: "heat-calorimetry-and-energy-diagrams",
    title: "Heat, Calorimetry, and Energy Diagrams",
    position: 11,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["ENE-2.A", "ENE-2.B", "ENE-2.C", "ENE-2.D", "ENE-2.E"],
    bodyPlain: [
      "Heat is energy transferred because of a temperature difference. Work, in a simple piston picture, is energy transferred when a volume changes against an external pressure. The first bookkeeping rule is conservation: energy lost by one part of a closed setup is gained by another. An exothermic process releases heat to the surroundings, so the system's temperature would rise if the heat stayed put. An endothermic process absorbs heat. Dissolving ammonium nitrate in a Piedmont cold-pack demo is endothermic; the bag feels cold because the solution took heat from your hand.",
      "A reaction-energy diagram plots energy versus reaction progress. Reactants sit on the left, products on the right, and the transition-state peak sits between them. The vertical drop from reactants to products is the energy change of the reaction (negative when products are lower). The climb from reactants to the peak is the activation energy of the forward reaction. The reverse activation energy is the climb from products to the same peak. A catalyst lowers the peak; it does not change the reactant and product energies.",
      "Thermal equilibrium is the state in which two objects in contact stop net heat flow and share one temperature. Heat capacity is the energy needed to raise an object's temperature by one degree. Specific heat capacity is that quantity per gram. Liquid water's specific heat, 4.18 J/g·°C, is large, so a lake or a calorimeter water bath changes temperature slowly. The energy for a temperature change with no phase change is q = m c ΔT. Marin Academy's club warms 50.0 g of water by 4.2 °C: q = 880 J absorbed by the water.",
      "Phase changes use energy to rearrange attractions at constant temperature. Melting and boiling are endothermic; freezing and condensing are exothermic. The energy is q = n ΔH for the relevant molar enthalpy of fusion or vaporization. A calorimeter experiment measures heat by watching the surroundings (often water). If the water warms, the process in the cup was exothermic. Coffee-cup calorimeters are nearly constant-pressure, so the heat measured is close to ΔH. Assuming no heat loss to the air is a model, not a guarantee.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "thermodynamics",
    slug: "enthalpy-bonds-and-hess",
    title: "Enthalpy, Bond Energies, and Hess's Law",
    position: 12,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["ENE-3.A", "ENE-3.B", "ENE-3.C", "ENE-3.D"],
    bodyPlain: [
      "Enthalpy H is a state function useful at constant pressure. The enthalpy change of a reaction, ΔH, is negative when the reaction is exothermic. Thermochemical equations include a ΔH that scales with the coefficients. Doubling a reaction doubles ΔH. Reversing a reaction flips the sign. If CH4 + 2 O2 → CO2 + 2 H2O has ΔH = -890 kJ, then forming one mole of methane from those products requires +890 kJ. Units are usually kJ per the reaction as written, so say what \"per mole\" refers to.",
      "Bond enthalpy estimates treat a reaction as bonds broken minus bonds formed, using average values from many molecules. Breaking bonds costs energy; forming bonds releases energy. If the bonds in the products are stronger overall, ΔH is negative. The method is approximate because a C-H bond in methane is not identical to a C-H bond in ethanal. Still, it explains why combustion of hydrocarbons is exothermic: many strong C=O and O-H bonds form.",
      "Standard enthalpies of formation, ΔHf°, are tabulated for compounds formed from elements in their standard states. The enthalpy of a reaction is the sum of ΔHf° of products minus the sum of ΔHf° of reactants, each multiplied by its coefficient. Elements in their standard states contribute zero. This path is exact within the table's precision because enthalpy is a state function: the change depends only on start and finish.",
      "Hess's law is the same idea with experimental equations instead of a formation table. If you can add published reactions—reversing and scaling as needed—so that they sum to a target reaction, their ΔH values sum to the target ΔH. Cupertino Science Bowl teams use Hess's law when a reaction is inconvenient to run in a calorimeter but can be built from two cleaner steps. The algebra must cancel intermediates completely. Leftover extra molecules mean the path is not yet the target reaction.",
    ].join("\n\n"),
  },
];
