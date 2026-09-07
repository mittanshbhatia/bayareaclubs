/**
 * Original lessons for Equilibrium.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const equilibriumLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "equilibrium",
    slug: "k-q-and-equilibrium-calculations",
    title: "K, Q, and Equilibrium Calculations",
    position: 13,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["TRA-6.A", "TRA-6.B", "TRA-7.A", "TRA-7.B", "TRA-7.C", "TRA-7.E"],
    bodyPlain: [
      "A reversible reaction can proceed in both directions. Equilibrium is reached when the forward and reverse rates are equal, so concentrations stop changing even though both processes continue. A closed flask of brown NO2 and colorless N2O4 can look still while molecules keep switching. Opening the flask or adding a product after equilibrium is a new experiment, not the same equilibrium snapshot.",
      "The equilibrium constant Kc is written from the balanced equation using equilibrium concentrations of aqueous solutes and gases, with solids and pure liquids omitted. For aA + bB ⇌ cC + dD, Kc = [C]^c [D]^d / [A]^a [B]^b. Kp uses partial pressures. A large K means products are favored at equilibrium. A very small K means reactants dominate. K does not tell you how fast equilibrium arrives. A kinetically slow reaction can have a huge K and still look frozen on a lab-period timescale.",
      "The reaction quotient Q has the same form as K but uses the current concentrations, which may not be equilibrium values. If Q < K, the forward reaction produces products until Q rises to K. If Q > K, the reverse reaction consumes products. If Q = K, the system is at equilibrium. Lowell High students mixing 0.10 M N2, 0.10 M H2, and 0.10 M NH3 for N2 + 3 H2 ⇌ 2 NH3 compute Q = (0.10)^2 / ((0.10)(0.10)^3) = 100. Comparing that Q to the K at that temperature decides the direction.",
      "Equilibrium calculations often use an ICE table: initial amounts, change in the mole-ratio pattern of the equation, and equilibrium amounts. Substitute into K and solve. If K is tiny and the change is small compared with a large initial concentration, the approximation x << initial value is worth checking after you solve. Units in Kc expressions are conventionally dropped in the AP treatment; the numerical value still depends on the chosen standard state. Always write the K expression that matches the equation you were given, not a memorized cousin.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "equilibrium",
    slug: "le-chatelier-and-solubility",
    title: "Le Chatelier and Solubility Equilibria",
    position: 14,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["TRA-8.A", "TRA-8.B", "SPQ-5.A", "SPQ-5.B", "SPQ-5.C"],
    bodyPlain: [
      "Le Chatelier's principle is a direction rule: a system at equilibrium responds to a disturbance by shifting in the direction that partially counters that disturbance. Adding a reactant favors the forward direction. Removing a product does the same. Adding a product favors the reverse. Diluting a solution of gases or solutes shifts toward the side with more aqueous or gas particles. Increasing the pressure by decreasing volume favors the side with fewer gas moles. Inert gas added at constant volume does not change partial pressures of the reactants, so that addition does not shift the equilibrium.",
      "Temperature is special because it changes K. For an exothermic reaction, heat is a product. Raising temperature decreases K and shifts toward reactants. For an endothermic reaction, raising temperature increases K. A catalyst speeds both directions equally and does not change K or the equilibrium position. Clubs that \"add a catalyst to get more product\" at equilibrium are describing a kinetic wish, not an equilibrium shift.",
      "Slightly soluble ionic solids have a solubility equilibrium: MxAy(s) ⇌ x M^n+(aq) + y A^m-(aq). Ksp is the product of the ion concentrations, each raised to its coefficient. For AgCl, Ksp = [Ag+][Cl-] = 1.8 x 10^-10 at a common reference temperature, so the molar solubility in pure water is 1.3 x 10^-5 M. A common ion already in solution lowers that solubility because Q starts closer to Ksp with less solid dissolved. Adding NaCl to a saturated AgCl mixture precipitates more AgCl.",
      "pH can change solubility when one of the ions is acidic or basic. Metal hydroxides dissolve more in acid because H+ consumes OH- and pulls the dissolution forward. Carbonates dissolve in acid as CO2 leaves. A water-testing team in San Mateo that acidifies a sample before measuring dissolved metals is not just \"cleaning the sample\"; it is shifting solubility equilibria. Q versus Ksp still decides whether a precipitate forms when two solutions are mixed: if Q > Ksp, solid appears.",
    ].join("\n\n"),
  },
];
