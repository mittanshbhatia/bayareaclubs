/**
 * Original lessons for Molecular and Ionic Compound Structure and Properties.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const compoundStructureLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "compound-structure-properties",
    slug: "bonding-lattices-and-metals",
    title: "Bonding, Lattices, and Metals",
    position: 3,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SAP-3.A", "SAP-3.B", "SAP-3.C", "SAP-3.D"],
    bodyPlain: [
      "A chemical bond is a lower-energy arrangement of nuclei and electrons than the separated atoms. Ionic bonding is the electrostatic attraction between ions of opposite charge. Covalent bonding is the sharing of electron pairs between nuclei. Metallic bonding is a lattice of metal cations in a delocalized sea of valence electrons. Electronegativity difference is a useful first sort: large differences favor ionic descriptions, small differences favor covalent sharing. The sort is a model, not a courtroom verdict. Many solids sit between the extremes.",
      "Potential-energy curves make the trade-off visible. As two atoms approach, attraction lowers the energy until the nuclei get close enough that repulsion wins. The internuclear distance at the minimum is the bond length. The depth of the well is the bond energy. A shorter, deeper well is a stronger bond. Castilleja's chemistry club compares H-H, Cl-Cl, and H-Cl on the same axes: the heteronuclear well is deeper than Cl-Cl because the shared pair sits closer to chlorine, but the comparison only holds if the curves are drawn for isolated diatomic molecules, not for bulk solids.",
      "Ionic solids are three-dimensional lattices, not isolated ion pairs. Each cation is surrounded by anions, and each anion by cations. Lattice energy is the energy released when gaseous ions assemble into that crystal. Smaller ions and higher charges produce larger lattice energies, so MgO is held together more tightly than NaCl. Those solids are hard, brittle, and conduct only when ions can move—melted or dissolved. A cracked ionic crystal shears like-charged ions next to each other, which is why the pieces snap rather than bend.",
      "Metals and alloys behave differently because the electrons are mobile. A voltage can drive those electrons, so metals conduct in the solid state. Layers of cations can slide without breaking a directional bond, so many metals are malleable. An alloy is a mixture of metals (or a metal with a small amount of another element) that keeps a metallic lattice. Brass used in a Homestead Robotics chassis is copper with zinc dissolved into the lattice. The mixture can be harder or less conductive than the pure metal, but it is still described with metallic bonding, not with a single ionic formula.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "compound-structure-properties",
    slug: "lewis-vsepr-and-hybridization",
    title: "Lewis Models, VSEPR, and Hybridization",
    position: 4,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SAP-4.A", "SAP-4.B", "SAP-4.C"],
    bodyPlain: [
      "A Lewis diagram counts valence electrons and assigns them as bonding pairs or lone pairs so that atoms, when possible, reach an octet. Carbon in CO2 uses four valence electrons to make two double bonds. Oxygen in water keeps two lone pairs and makes two single bonds. Incomplete octets (boron) and expanded octets (sulfur, phosphorus) appear when the atom is not in the second period. The diagram is a bookkeeping tool. It does not show the three-dimensional shape by itself, and it does not prove that electrons sit in tiny dots.",
      "Resonance is required when more than one valid Lewis diagram can be drawn by moving electrons, not atoms. Ozone, nitrate, and the carboxylate ion are standard examples. The real charge distribution is an average of the contributors. Formal charge helps choose among diagrams: formal charge equals valence electrons minus nonbonding electrons minus half the bonding electrons. The better set of contributors usually keeps formal charges small and puts negative formal charge on the more electronegative atom. A club that draws only one nitrate structure with a single N-O bond and two N=O bonds has described a snapshot, not the ion.",
      "VSEPR predicts geometry from electron-domain repulsion. Two domains are linear, three are trigonal planar, four are tetrahedral. Lone pairs occupy domains and squeeze bond angles. Water is tetrahedral in electron geometry and bent in molecular geometry; the H-O-H angle is less than 109.5 degrees. Five- and six-domain cases (trigonal bipyramidal, octahedral) appear for expanded octets. Polar bonds arranged symmetrically can cancel, so CO2 is nonpolar while H2O is polar. Shape and polarity decide later intermolecular behavior.",
      "Hybridization is a language for mixing atomic orbitals so that the observed geometry has equivalent bonding directions. Four equivalent groups around carbon is sp3. Three groups is sp2, with an unhybridized p orbital for a pi bond. Two groups is sp. The carbon atoms in ethene are sp2; the triple-bonded carbons in ethyne are sp. Hybridization labels follow the electron-domain count. They do not replace VSEPR, and they are not extra particles in the molecule. Gunn High students who can move from a Lewis count to domains, shape, polarity, and a hybridization label have the Unit 2 toolkit in working order.",
    ].join("\n\n"),
  },
];
