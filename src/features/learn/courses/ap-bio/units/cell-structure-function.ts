import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const cellStructureFunctionLessons: readonly ApBioLesson[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "cell-structure-function",
    slug: "organelles-and-compartments",
    title: "Organelles and compartments",
    position: 3,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["SYI-1.D", "SYI-1.E", "SYI-1.F"],
    bodyPlain: [
      "A cell is not a bag of mixed chemicals. Membranes and protein complexes divide the interior so incompatible jobs can run at the same time. Ribosomes assemble proteins. The rough endoplasmic reticulum continues that work and folds many secreted proteins. The Golgi apparatus sorts and ships. Lysosomes and vacuoles hold hydrolytic enzymes away from the rest of the cytosol. Mitochondria and chloroplasts house the membranes that run energy transformations.",
      "Compartments also change surface area. Cristae and thylakoid stacks are folded so electron-transport proteins have more membrane to occupy. A club that models a mitochondrion with paper fans is making that point physical: the same volume can hold far more membrane if the sheet is crumpled. Surface-to-volume ratio also limits how large a cell can be before diffusion cannot supply the center.",
      "Prokaryotic cells lack the membrane-bound nucleus and many organelles of eukaryotic cells, but they still organize work. A nucleoid region holds DNA. Ribosomes make protein. Some bacteria have internal membranes or carboxysomes. Plant, animal, and fungal cells share a eukaryotic plan and then add walls, chloroplasts, or large vacuoles as needed. Comparing a cheek-cell slide with Elodea from the garden club is a live version of that comparison.",
      "When a function fails, ask which compartment was responsible and whether material could still move between compartments. A protein stuck in the ER never reaches the membrane. A mitochondrion with damaged inner membrane cannot hold a proton gradient. Naming an organelle is not enough; students should state the job that compartment isolates and what happens if the isolation breaks.",
    ].join("\n\n"),
  },
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "cell-structure-function",
    slug: "membranes-gradients-and-transport",
    title: "Membranes, gradients, and transport",
    position: 4,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["ENE-2.C", "ENE-2.D", "ENE-2.G", "ENE-2.H"],
    bodyPlain: [
      "A biological membrane is a fluid mosaic: a phospholipid bilayer with embedded proteins, cholesterol in many animal cells, and attached carbohydrates. The fatty-acid tails face inward, so the interior is hydrophobic. Small nonpolar molecules cross more easily than ions or large polar molecules. Proteins provide channels, carriers, pumps, and receptors. The mosaic is fluid because lipids and many proteins can move laterally, which matters when a cell changes shape or when two membranes fuse.",
      "Passive transport moves a solute down its concentration or electrochemical gradient and does not require the cell to spend ATP on that step. Simple diffusion and facilitated diffusion are both passive. Active transport uses energy, often ATP or an existing ion gradient, to move a solute against its gradient. The sodium-potassium pump is a classic example: it spends ATP to keep sodium high outside and potassium high inside, which later drives other transport.",
      "Water follows solute. In osmosis, water moves toward the side with higher solute concentration if the membrane limits the solute. A wilted celery stick in tap water firms up because water enters cells whose vacuoles hold dissolved sugars and ions. The same stick in concentrated salt water loses water and goes limp. Bay Area tide-pool organisms face a version of this problem when salinity swings, and they use osmoregulation rather than hoping the gradient stays kind.",
      "A club dialysis-tubing lab is a model, not a cell, but it still trains the right questions. Which molecules crossed, and why? Did water move? Was a protein required? If a later experiment adds a pump, the new question is whether energy input changed the direction of net movement. Students should predict direction from gradients and membrane permeability before they memorize transporter names.",
    ].join("\n\n"),
  },
];
