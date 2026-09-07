/**
 * Advanced original AP Biology items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "water-hydrogen-not-covalent-only",
    lessonSlug: "water-polarity-and-carbon-scaffolds",
    prompt:
      "A tidepool club compares water's high specific heat to methane. The best account is:",
    choices: [
      "Water's hydrogen bonds absorb energy as they rearrange, so temperature rises slowly.",
      "Water has more covalent bonds per molecule than methane.",
      "Methane is polar, so it heats faster.",
      "Specific heat is only a property of metals.",
    ],
    answer: "a",
    explanation:
      "Hydrogen bonds among water molecules soak up energy before kinetic energy (temperature) jumps. That is not the same as counting intramolecular covalent bonds.",
    codes: ["SYI-1.A"],
  }),
  originalItem({
    slug: "gradient-costs-atp",
    lessonSlug: "membranes-gradients-and-transport",
    prompt:
      "A cell pumps Na+ out against its gradient. This process:",
    choices: [
      "Is simple diffusion and never uses ATP.",
      "Is active transport and couples to ATP (or a coupled gradient).",
      "Makes the membrane permeable to all ions equally.",
      "Stops if aquaporins are present.",
    ],
    answer: "b",
    explanation:
      "Moving a solute against its electrochemical gradient requires free energy. Primary pumps use ATP; secondary pumps use another gradient.",
    codes: ["ENE-2.A"],
  }),
  originalItem({
    slug: "enzyme-lowers-ea",
    lessonSlug: "enzymes-and-free-energy",
    prompt:
      "An enzyme speeds a club-assay reaction. ΔG of the reaction:",
    choices: [
      "Becomes positive.",
      "Is unchanged; the enzyme lowers activation energy.",
      "Equals the activation energy.",
      "Is the same as the enzyme's molecular weight.",
    ],
    answer: "b",
    explanation:
      "Catalysts change the path, not the equilibrium ΔG. They lower Ea so more collisions succeed per second.",
    codes: ["ENE-1.D"],
  }),
  originalItem({
    slug: "checkpoint-not-optional",
    lessonSlug: "cell-cycle-and-checkpoints",
    prompt:
      "A damaged DNA checkpoint fails before mitosis. The most honest risk statement is:",
    choices: [
      "The cell must immediately become a tumor.",
      "Daughter cells are more likely to inherit unrepaired DNA, raising later problems.",
      "Checkpoints only exist in plants.",
      "Mitosis cannot occur in animal cells.",
    ],
    answer: "b",
    explanation:
      "Checkpoints reduce the chance of passing damage. Failure raises risk; it is not a diagnosis that a tumor already exists.",
    codes: ["IST-1.D"],
  }),
  originalItem({
    slug: "meiosis-halves-then-varies",
    lessonSlug: "meiosis-and-genetic-variation",
    prompt:
      "Compared with a starting diploid cell, a gamete after meiosis II has:",
    choices: [
      "The same chromosome number and identical chromatids.",
      "Half the chromosome number and new allele combinations from independent cutting and crossing over.",
      "Twice the DNA of the parent cell.",
      "No chromosomes if crossing over occurred.",
    ],
    answer: "b",
    explanation:
      "Meiosis halves ploidy. Independent assortment and crossing over shuffle alleles. Crossing over does not delete the chromosome set.",
    codes: ["IST-1.F"],
  }),
  originalItem({
    slug: "selection-changes-frequencies",
    lessonSlug: "selection-evidence-and-allele-change",
    prompt:
      "A drought favors deeper-rooted mustard plants. Over generations, the allele for deeper roots becomes more common. This is:",
    choices: [
      "Individuals stretching their roots and passing the stretch.",
      "Selection changing allele frequencies in the population.",
      "Proof that mutation is directed toward the drought.",
      "A claim that species goals exist.",
    ],
    answer: "b",
    explanation:
      "Selection sorts existing variation. Individuals do not will a new allele into their gametes. Mutation is not aiming at the drought.",
    codes: ["EVO-1.E"],
  }),
] as const;
