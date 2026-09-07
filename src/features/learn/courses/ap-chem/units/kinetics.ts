/**
 * Original lessons for Kinetics.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const kineticsLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "kinetics",
    slug: "rates-and-rate-laws",
    title: "Rates and Rate Laws",
    position: 9,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["TRA-3.A", "TRA-3.B", "TRA-3.C"],
    bodyPlain: [
      "Reaction rate is how fast a concentration (or a related measurable) changes. Average rate over an interval is Δ[substance]/Δt, with a sign chosen so the reported rate is positive. Instantaneous rate is the slope of a concentration-time curve at one moment. Stoichiometric coefficients relate rates of different species: if 2 N2O5 → 4 NO2 + O2, the rate of NO2 appearance is twice the rate of N2O5 disappearance and four times the rate of O2 appearance. A Menlo-Atherton clock-reaction video is measuring an average rate unless the team fits a tangent.",
      "A rate law is an experimental equation: rate = k [A]^m [B]^n for a common two-reactant form. The orders m and n are not the stoichiometric coefficients unless the reaction is an elementary step. They are found by seeing how rate changes when one concentration is doubled while others stay fixed. If doubling [A] doubles the rate, the reaction is first order in A. If doubling [B] does nothing, the reaction is zero order in B. The rate constant k has units that depend on overall order: 1/s for first order, L/mol·s for second order.",
      "Integrated rate laws turn concentration-versus-time data into a straight-line test. A first-order process gives a linear ln[A] versus t plot with slope -k. A second-order process gives a linear 1/[A] versus t plot. A zero-order process gives a linear [A] versus t plot. Half-life for a first-order reaction is 0.693/k and does not depend on the starting concentration. If a bleach-fading dye at Lowell High has k = 0.0231 min^-1, the half-life is 30.0 min. After two half-lives, one quarter of the original dye remains.",
      "Temperature usually increases k, so the same concentrations produce a faster rate on a warmer day. Concentration appears in the rate law; temperature hides inside k. A catalyst also changes k by opening a different path. None of those facts lets you write a rate law from the balanced equation alone. The honest sentence is: measure rates, assign orders, then use the integrated form that matches the order to predict amounts at later times.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "kinetics",
    slug: "mechanisms-collision-and-catalysis",
    title: "Mechanisms, Collision Theory, and Catalysis",
    position: 10,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["TRA-4.A", "TRA-4.B", "TRA-4.C", "TRA-5.A", "TRA-5.B", "TRA-5.E"],
    bodyPlain: [
      "Collision theory says particles must collide with enough energy and with a workable orientation. The activation energy is the extra energy needed to reach the transition state. A Maxwell-Boltzmann distribution shows that a larger fraction of collisions clear that bar when temperature rises. Orientation matters: two NO2 molecules must meet so that an oxygen can transfer. A crowded flask with poorly aimed collisions can still be slow even if the average speed is high.",
      "An elementary step is a single collision event whose coefficients are the molecularity. A unimolecular step is first order. A bimolecular step is second order overall. The rate law of an elementary step can be written from the step. A mechanism is a sequence of elementary steps that adds to the overall reaction. Intermediates are produced and later consumed. Catalysts are consumed and later regenerated. A valid mechanism must sum to the overall equation and must agree with the experimental rate law.",
      "The slowest step is rate-determining if one step is clearly slower. The experimental rate law then matches that slow step, after any intermediate in the slow-step rate law is replaced using a fast equilibrium that precedes it. A two-step example: A + B ⇌ C (fast) followed by C + D → products (slow) can yield a rate law that includes [A], [B], and [D] even though D is absent from the first step. Energy profiles for multistep paths show more than one hill. The tallest hill from the reactant energy is the main kinetic barrier.",
      "A catalyst provides a new mechanism with a lower activation energy. Homogeneous catalysts are in the same phase as the reactants. Heterogeneous catalysts provide a surface. Enzymes in a San Mateo biotech club demo are biological catalysts with specific binding sites. Adding a catalyst does not change the enthalpy difference between reactants and products, and it does not hide in the overall balanced equation if it is regenerated. It changes how fast equilibrium is approached, not the value of K.",
    ].join("\n\n"),
  },
];
