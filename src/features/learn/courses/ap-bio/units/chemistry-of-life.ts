import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const chemistryOfLifeLessons: readonly ApBioLesson[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "chemistry-of-life",
    slug: "water-polarity-and-carbon-scaffolds",
    title: "Water polarity and carbon scaffolds",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["SYI-1.A", "SYI-1.B", "ENE-1.A"],
    bodyPlain: [
      "A water molecule is bent, with oxygen pulling shared electrons closer than either hydrogen. That uneven pull makes one side slightly negative and the other slightly positive. Neighboring water molecules therefore cling through hydrogen bonds. In a school-garden hose on a warm afternoon, those attractions show up as surface tension that lets a droplet sit on a leaf and as cohesion that helps a thin stream hold together until it hits the soil.",
      "The same polarity explains why water is a useful solvent inside cells. Ions and other polar compounds dissolve because water molecules can face them with the opposite charge. Nonpolar oil droplets from a club cooking demo stay separate: they have no charge pattern for water to grip. Living cells exploit both behaviors. The watery cytosol carries sugars and salts, while membranes and some protein interiors keep oily patches away from that solvent.",
      "Carbon is the scaffold atom of biology because it can form four stable covalent bonds and can link to other carbons in chains, rings, and branches. A carbon backbone can hold hydroxyl, carboxyl, amino, and phosphate groups. Those groups decide whether a molecule is acidic, basic, polar, or able to store energy. When the bio club builds ball-and-stick models of glucose and a fatty acid, the carbon chain is the same idea in two shapes: one ringed and water-friendly, one long and oily.",
      "Temperature, pH, and the mix of dissolved ions change how hydrogen bonds and charged groups behave. A compost thermometer that climbs after a rain is not just weather. Extra water and heat shift how enzymes and organic acids interact in the pile. Students should be able to name the property of water or the carbon-group feature that makes a given observation possible, rather than listing vocabulary without a mechanism.",
    ].join("\n\n"),
  },
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "chemistry-of-life",
    slug: "monomers-polymers-and-information-molecules",
    title: "Monomers, polymers, and information molecules",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["ENE-1.A", "ENE-1.B", "IST-1.A", "IST-1.B"],
    bodyPlain: [
      "Cells build large molecules by linking repeating subunits. A dehydration reaction joins two monomers and releases water. Hydrolysis uses water to break that bond. Carbohydrates store energy and provide structure when sugar monomers join. Proteins fold from amino-acid chains. Nucleic acids store and copy information from nucleotide chains. Lipids are the exception that still matters: they are not true polymers, yet fatty acids and glycerol still assemble into fats and membrane lipids.",
      "The identity of a polymer depends on both the monomers and the order of those monomers. Swap one amino acid in a polypeptide and the fold can change enough to alter a binding pocket. Change a base in DNA and the complementary strand, the RNA copy, and sometimes the protein all change. A robotics club that reprints a part with one hole in the wrong place is a useful picture: the rest of the object is intact, but the function is not.",
      "DNA and RNA share a sugar-phosphate backbone and nitrogenous bases, yet they are not interchangeable. DNA uses deoxyribose and usually thymine; RNA uses ribose and uracil. DNA is typically double-stranded with complementary base pairing, which lets a sequence be copied with a template. RNA is usually single-stranded and can fold into shapes that carry messages or help catalysis. Those structural differences are why DNA is a stable archive and RNA is a flexible worker.",
      "When a club extracts DNA from strawberries or runs a protein gel after a yogurt culture, the lab is really asking which polymer is present and what its subunits allow. Students should connect a monomer table to a function: nucleotide order encodes information, amino-acid order builds catalysts and structure, sugar polymers store fuel or make walls, and lipids define hydrophobic barriers. A change at the subunit level is the first place to look when a function fails.",
    ].join("\n\n"),
  },
];
