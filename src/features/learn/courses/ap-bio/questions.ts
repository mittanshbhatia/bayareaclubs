/**
 * Original BayAreaClubs multiple-choice items for AP Biology.
 * Written from scratch. Not derived from College Board, Stellar, or other banks.
 * source_basis: ORIGINAL.
 */

import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioQuestion } from "@/features/learn/courses/ap-bio/schema";

export type { ApBioQuestion } from "@/features/learn/courses/ap-bio/schema";

export const questions: readonly ApBioQuestion[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "water-cohesion-in-garden-hose",
    lessonSlug: "water-polarity-and-carbon-scaffolds",
    questionType: "multiple_choice",
    prompt:
      "The garden club watches a thin stream from a hose hold together until it hits soil. Which property of water best explains that cohesion?",
    choices: [
      { id: "a", text: "Hydrogen bonds attract neighboring water molecules to one another." },
      { id: "b", text: "Carbon atoms in water form four covalent bonds to soil particles." },
      { id: "c", text: "Water molecules have no partial charges, so they slide without interacting." },
      { id: "d", text: "Ionic bonds between oxygen atoms lock the stream into a crystal." },
    ],
    answerId: "a",
    explanation:
      "Cohesion is water clinging to water through hydrogen bonds that arise from polarity. Carbon bonding, a claim of no charge, and ionic oxygen crystals do not describe liquid water in a hose.",
    objectiveCodes: ["SYI-1.A"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "r-group-change-alters-fold",
    lessonSlug: "monomers-polymers-and-information-molecules",
    questionType: "multiple_choice",
    prompt:
      "A bio-club model of an enzyme replaces one amino-acid R group with a differently charged group in the active site. What is the most likely result?",
    choices: [
      { id: "a", text: "The polymer is no longer made of amino acids, so it becomes a carbohydrate." },
      { id: "b", text: "The fold and substrate fit can change, so catalytic rate can drop." },
      { id: "c", text: "DNA sequence is rewritten automatically to match the new side chain." },
      { id: "d", text: "Hydrogen bonds in water disappear, so the cell dries out." },
    ],
    answerId: "b",
    explanation:
      "Protein function depends on fold, and fold depends on R-group chemistry. A charge swap in the active site can ruin binding. The chain is still a polypeptide; DNA is not reverse-translated; water chemistry is unchanged.",
    objectiveCodes: ["ENE-1.B"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "dna-rna-sugar-difference",
    lessonSlug: "monomers-polymers-and-information-molecules",
    questionType: "multiple_choice",
    prompt:
      "Officers extract nucleic acids from strawberries and then discuss why DNA is a more stable archive than RNA. Which structural difference supports that claim?",
    choices: [
      { id: "a", text: "DNA nucleotides lack phosphate, so the backbone cannot break." },
      { id: "b", text: "RNA uses deoxyribose while DNA uses ribose, so RNA is always double-stranded." },
      { id: "c", text: "DNA usually pairs two complementary strands and uses deoxyribose and thymine." },
      { id: "d", text: "RNA cannot form hydrogen bonds, so it cannot carry any information." },
    ],
    answerId: "c",
    explanation:
      "DNA's double strand, deoxyribose, and thymine pairing support a stable template. Both nucleic acids have phosphates. RNA uses ribose and uracil and can still carry information as a single strand.",
    objectiveCodes: ["IST-1.A", "IST-1.B"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "dehydration-joins-monomers",
    lessonSlug: "monomers-polymers-and-information-molecules",
    questionType: "multiple_choice",
    prompt:
      "A yogurt culture is building protein. Which reaction joins two amino acids, and what is released?",
    choices: [
      { id: "a", text: "Hydrolysis joins them and consumes oxygen gas." },
      { id: "b", text: "A dehydration reaction joins them and releases water." },
      { id: "c", text: "A dehydration reaction splits them and absorbs carbon dioxide." },
      { id: "d", text: "Simple diffusion joins them without any covalent bond." },
    ],
    answerId: "b",
    explanation:
      "Polymer growth by peptide-bond formation is a dehydration synthesis that releases water. Hydrolysis breaks polymers. Diffusion does not create the covalent link.",
    objectiveCodes: ["ENE-1.A"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "mitochondria-surface-area",
    lessonSlug: "organelles-and-compartments",
    questionType: "multiple_choice",
    prompt:
      "The robotics club folds paper fans to model a mitochondrion. Why do inner-membrane folds help ATP production?",
    choices: [
      { id: "a", text: "They store DNA in a second nucleus so mitosis can run twice." },
      { id: "b", text: "They increase membrane area for electron-transport proteins and ATP synthase." },
      { id: "c", text: "They let lysosomal enzymes mix freely with the cytosol." },
      { id: "d", text: "They convert the mitochondrion into a chloroplast when light is present." },
    ],
    answerId: "b",
    explanation:
      "Cristae raise surface area so more respiratory-chain complexes can sit in the membrane. They are not a second nucleus, a lysosome leak, or a light-driven conversion to chloroplasts.",
    objectiveCodes: ["SYI-1.E"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "lipid-bilayer-selective-permeability",
    lessonSlug: "membranes-gradients-and-transport",
    questionType: "multiple_choice",
    prompt:
      "In a dialysis-tubing model, iodine crosses into a starch bag while starch stays inside. Which membrane idea does this illustrate?",
    choices: [
      { id: "a", text: "All solutes cross a bilayer at the same rate if the temperature is constant." },
      { id: "b", text: "Selective permeability lets some molecules pass more readily than others." },
      { id: "c", text: "Active transport is required for any colored solute to move." },
      { id: "d", text: "Osmosis moves starch because starch is a lipid." },
    ],
    answerId: "b",
    explanation:
      "The bag (and a real membrane) is selectively permeable: small iodine can enter, large starch cannot. Color alone does not imply pumps, and starch is not a lipid moved by osmosis.",
    objectiveCodes: ["ENE-2.G"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "na-k-pump-maintains-gradient",
    lessonSlug: "membranes-gradients-and-transport",
    questionType: "multiple_choice",
    prompt:
      "A nerve-cell model spends ATP to move sodium out and potassium in. What does that pump accomplish?",
    choices: [
      { id: "a", text: "It lets both ions diffuse toward equilibrium so gradients disappear." },
      { id: "b", text: "It maintains electrochemical gradients that later drive other transport and signaling." },
      { id: "c", text: "It hydrolyzes the bilayer so proteins can leave the membrane." },
      { id: "d", text: "It converts the cell into a prokaryote by removing the nucleus." },
    ],
    answerId: "b",
    explanation:
      "The pump is active transport that builds and keeps Na+ and K+ gradients. Those gradients store energy for later work. The pump does not erase gradients, dissolve the bilayer, or remove nuclei.",
    objectiveCodes: ["ENE-2.C", "ENE-2.D"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "osmosis-celery-salt",
    lessonSlug: "membranes-gradients-and-transport",
    questionType: "multiple_choice",
    prompt:
      "Celery left in concentrated salt water goes limp. What happened to the cells?",
    choices: [
      { id: "a", text: "Water left the cells toward the higher external solute concentration." },
      { id: "b", text: "Salt molecules became organelles and filled the vacuoles." },
      { id: "c", text: "The cells gained water because salt is hypotonic to the cytosol." },
      { id: "d", text: "Mitochondria pumped the entire celery stalk into the salt solution." },
    ],
    answerId: "a",
    explanation:
      "Water moves by osmosis toward the saltier side. Cells lose water and lose turgor. The bath is hypertonic, not hypotonic, and salt does not become organelles.",
    objectiveCodes: ["ENE-2.D"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "enzyme-saturation-in-yeast-lab",
    lessonSlug: "enzymes-and-free-energy",
    questionType: "multiple_choice",
    prompt:
      "A yeast-and-peroxide graph levels off even though students keep adding substrate. What is the best explanation if temperature and pH are still optimal?",
    choices: [
      { id: "a", text: "Every enzyme molecule is occupied, so extra substrate cannot raise rate." },
      { id: "b", text: "Enzymes are consumed as reactants, so none remain after the first second." },
      { id: "c", text: "Activation energy has become infinite, so no collision can work." },
      { id: "d", text: "ATP synthase has left the mitochondria and entered the peroxide." },
    ],
    answerId: "a",
    explanation:
      "Saturation means active sites are full. Enzymes are catalysts, not consumed as the main reactant. Activation energy is lowered, not infinite, and ATP synthase is not the enzyme in this lab.",
    objectiveCodes: ["ENE-1.D", "ENE-1.E"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "photosystem-electron-path",
    lessonSlug: "photosynthesis-and-cellular-respiration",
    questionType: "multiple_choice",
    prompt:
      "Leaf disks from the garden club float after a light treatment. Which path produced the oxygen that inflated the disks?",
    choices: [
      { id: "a", text: "The Calvin cycle splits carbon dioxide and releases oxygen in the stroma." },
      { id: "b", text: "Water is split at photosystems in the thylakoid membrane during the light reactions." },
      { id: "c", text: "Mitochondria reverse the citric acid cycle and vent oxygen from pyruvate." },
      { id: "d", text: "Fermentation in the cytosol converts sugar directly into oxygen bubbles." },
    ],
    answerId: "b",
    explanation:
      "Oxygen comes from water splitting at photosystems during the light reactions. The Calvin cycle fixes CO2; it does not release O2. Respiration and fermentation do not generate those bubbles.",
    objectiveCodes: ["ENE-1.G", "ENE-1.H"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "uncoupler-effect-on-atp",
    lessonSlug: "photosynthesis-and-cellular-respiration",
    questionType: "multiple_choice",
    prompt:
      "A lab uncoupler lets protons leak across the inner mitochondrial membrane. Oxygen is still consumed. What happens to ATP yield from oxidative phosphorylation?",
    choices: [
      { id: "a", text: "ATP yield falls because the proton gradient that drives ATP synthase collapses." },
      { id: "b", text: "ATP yield rises because leaked protons are themselves high-energy fuel." },
      { id: "c", text: "ATP yield is unchanged because only glycolysis can make ATP." },
      { id: "d", text: "ATP yield becomes infinite because the membrane no longer exists." },
    ],
    answerId: "a",
    explanation:
      "Oxidative phosphorylation needs a proton-motive force. A leak burns the gradient as heat, so ATP synthase slows even if electron transport still uses oxygen.",
    objectiveCodes: ["ENE-1.I", "ENE-1.K"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "fermentation-regenerates-nad",
    lessonSlug: "photosynthesis-and-cellular-respiration",
    questionType: "multiple_choice",
    prompt:
      "Yeast in a sealed juice bottle keep making carbon dioxide after oxygen is gone. What does fermentation provide so glycolysis can continue?",
    choices: [
      { id: "a", text: "A new chloroplast that fixes carbon in the dark." },
      { id: "b", text: "Regenerated NAD+ so electrons have a place to go from glycolysis." },
      { id: "c", text: "A proton gradient equal to the one in aerobic mitochondria." },
      { id: "d", text: "A complete citric acid cycle that no longer needs oxygen." },
    ],
    answerId: "b",
    explanation:
      "Fermentation oxidizes NADH back to NAD+ so glycolysis can accept more electrons. It does not build chloroplasts or replace the mitochondrial gradient and full Krebs cycle.",
    objectiveCodes: ["ENE-1.J"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "kinase-cascade-amplifies",
    lessonSlug: "signal-reception-and-transduction",
    questionType: "multiple_choice",
    prompt:
      "One ligand-bound receptor activates many kinases, and each kinase activates many targets. What idea does this illustrate?",
    choices: [
      { id: "a", text: "Signal amplification during transduction." },
      { id: "b", text: "A checkpoint that stops DNA replication in S phase." },
      { id: "c", text: "Independent assortment of homologs." },
      { id: "d", text: "A trophic cascade in a kelp forest." },
    ],
    answerId: "a",
    explanation:
      "Cascades multiply the effect of one occupied receptor. That is intracellular amplification, not meiosis, the cell cycle, or an ecological food-web cascade.",
    objectiveCodes: ["IST-3.C", "IST-3.D"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "checkpoint-failure-in-culture",
    lessonSlug: "cell-cycle-and-checkpoints",
    questionType: "multiple_choice",
    prompt:
      "A flask of cultured cells keeps dividing after DNA damage that should have blocked S-phase entry. Which explanation is most precise?",
    choices: [
      { id: "a", text: "Mitosis no longer requires chromosomes, so checkpoints are unused." },
      { id: "b", text: "A molecular brake at a checkpoint was lost, so damaged DNA is still copied." },
      { id: "c", text: "The cells became prokaryotes and therefore have no cycle." },
      { id: "d", text: "Fermentation replaced mitosis, so division is now a redox reaction." },
    ],
    answerId: "b",
    explanation:
      "Checkpoints veto progression when DNA is damaged. Losing that brake lets the cycle continue. Cells still need chromosomes; they did not become prokaryotes or replace mitosis with fermentation.",
    objectiveCodes: ["IST-1.D", "IST-1.E"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "ligand-shape-blocks-receptor",
    lessonSlug: "signal-reception-and-transduction",
    questionType: "multiple_choice",
    prompt:
      "A designed molecule fits a receptor pocket but does not trigger the usual shape change. Ligand from the body is still present. Where is the path blocked?",
    choices: [
      { id: "a", text: "At reception: the receptor cannot start transduction." },
      { id: "b", text: "At cytokinesis: the cytoplasm cannot split." },
      { id: "c", text: "At translation: ribosomes cannot read any codon." },
      { id: "d", text: "At carrying capacity: the population cannot grow." },
    ],
    answerId: "a",
    explanation:
      "A blocker that occupies the pocket without activating the receptor stops the path at reception. Cytokinesis, translation, and population growth are the wrong scale.",
    objectiveCodes: ["IST-3.A", "IST-3.B"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "same-ligand-two-responses",
    lessonSlug: "signal-reception-and-transduction",
    questionType: "multiple_choice",
    prompt:
      "The same hormone speeds one cell type and mobilizes fuel in another. What must differ between those cells?",
    choices: [
      { id: "a", text: "They must use different genetic codes for the same amino acids." },
      { id: "b", text: "They can display different receptors or different downstream proteins." },
      { id: "c", text: "One cell must lack a plasma membrane." },
      { id: "d", text: "One cell must be a virus." },
    ],
    answerId: "b",
    explanation:
      "Response depends on the receptor and the transduction proteins a cell already has. The genetic code and the presence of a membrane stay shared; neither cell needs to be a virus.",
    objectiveCodes: ["IST-3.A"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "independent-assortment-seed-tray",
    lessonSlug: "meiosis-and-genetic-variation",
    questionType: "multiple_choice",
    prompt:
      "The garden club crosses two plants that are heterozygous for two genes on different chromosomes. Which meiotic event produces the four gamete combinations they draw on the tray?",
    choices: [
      { id: "a", text: "Independent assortment of homologs at metaphase I." },
      { id: "b", text: "A G1 checkpoint that pauses the cycle after fertilization." },
      { id: "c", text: "A kinase cascade that phosphorylates the seed coat." },
      { id: "d", text: "Fermentation that halves the chromosome number." },
    ],
    answerId: "a",
    explanation:
      "Unlinked genes assort independently because homologs line up in different ways in meiosis I. Checkpoints, signaling, and fermentation are not the source of those gamete combinations.",
    objectiveCodes: ["IST-1.H", "IST-1.I"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "x-linked-color-in-fruit-flies",
    lessonSlug: "inheritance-patterns-in-clubs",
    questionType: "multiple_choice",
    prompt:
      "A fruit-fly club tracks an X-linked recessive eye-color allele. Why can a male show the trait when he inherits only one copy?",
    choices: [
      { id: "a", text: "Males lack an X chromosome, so every trait is autosomal dominant." },
      { id: "b", text: "Males are hemizygous for X-linked genes, so one recessive allele is expressed." },
      { id: "c", text: "Crossing over always deletes the Y chromosome in males with pale eyes." },
      { id: "d", text: "Environment turns all male pigments off regardless of genotype." },
    ],
    answerId: "b",
    explanation:
      "In an XY system, males have one X, so an X-linked recessive allele is not masked by a second X. Males do have an X. Crossing over and environment are not required for this pattern.",
    objectiveCodes: ["IST-1.J", "IST-1.K"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "nondisjunction-in-anaphase-i",
    lessonSlug: "meiosis-and-genetic-variation",
    questionType: "multiple_choice",
    prompt:
      "A model cell fails to separate a homologous pair in anaphase I. What is in the resulting gametes for that chromosome?",
    choices: [
      { id: "a", text: "All four gametes are diploid for every chromosome." },
      { id: "b", text: "Some gametes receive both homologs and others receive none." },
      { id: "c", text: "Every gamete receives exactly one chromatid from that pair." },
      { id: "d", text: "Meiosis II corrects the error by adding a checkpoint nucleus." },
    ],
    answerId: "b",
    explanation:
      "Nondisjunction in meiosis I sends both homologs to one pole. After meiosis II, two products have an extra chromosome and two lack it. Meiosis II does not invent a corrective nucleus.",
    objectiveCodes: ["IST-1.F"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "hydrangea-environment-phenotype",
    lessonSlug: "inheritance-patterns-in-clubs",
    questionType: "multiple_choice",
    prompt:
      "A hydrangea moved from acidic to more neutral soil changes bloom color while its alleles stay the same. What does this show?",
    choices: [
      { id: "a", text: "Phenotype can shift with environment even when genotype is unchanged." },
      { id: "b", text: "The plant performed meiosis in the roots and rewrote its genes." },
      { id: "c", text: "Color is never genetic, so alleles do not exist in plants." },
      { id: "d", text: "Independent assortment occurs in soil instead of in cells." },
    ],
    answerId: "a",
    explanation:
      "Genotype sets a range; soil chemistry can move the expressed color. The DNA was not rewritten by meiosis in the roots, and plant traits can still be genetic.",
    objectiveCodes: ["SYI-3.C"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "operon-repressor-on-plate",
    lessonSlug: "gene-regulation-and-biotech-tools",
    questionType: "multiple_choice",
    prompt:
      "Bacteria on a club plate make lactose-use enzymes only when lactose is present. What is the repressor doing when lactose is absent?",
    choices: [
      { id: "a", text: "It binds the operator and blocks transcription of the operon." },
      { id: "b", text: "It splices out all eukaryotic introns in the bacterial chromosome." },
      { id: "c", text: "It pumps protons to run ATP synthase in the cell wall." },
      { id: "d", text: "It translates the lac genes without any mRNA." },
    ],
    answerId: "a",
    explanation:
      "In the classic inducible operon, the repressor occupies the operator without inducer, so RNA polymerase does not transcribe those genes. Bacteria lack that eukaryotic splice step here, and the repressor is not an ATP synthase or a ribosome.",
    objectiveCodes: ["IST-2.A", "IST-2.B"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "splice-site-change-shortens-protein",
    lessonSlug: "transcription-and-translation",
    questionType: "multiple_choice",
    prompt:
      "A mutation alters a splice site so an exon is dropped from mature mRNA. The ribosome still starts at the usual AUG. What is the most likely protein outcome?",
    choices: [
      { id: "a", text: "A shorter or internally deleted polypeptide, because some codons never appear." },
      { id: "b", text: "A longer DNA molecule, because splicing rewrites the chromosome." },
      { id: "c", text: "No change, because exons are never translated." },
      { id: "d", text: "A new chloroplast genome created in the cytosol." },
    ],
    answerId: "a",
    explanation:
      "Lost exon sequence means lost codons, so the protein is shorter or missing an internal stretch. Splicing does not rewrite genomic DNA, and exons are the sequences that are translated.",
    objectiveCodes: ["IST-1.N", "IST-1.O"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "silent-codon-same-amino-acid",
    lessonSlug: "transcription-and-translation",
    questionType: "multiple_choice",
    prompt:
      "A substitution changes a codon but the same amino acid is still added. What feature of the genetic code allows that?",
    choices: [
      { id: "a", text: "Redundancy: more than one codon can specify one amino acid." },
      { id: "b", text: "Every codon specifies a different amino acid, so the protein must change." },
      { id: "c", text: "Ribosomes ignore mRNA and assemble amino acids at random." },
      { id: "d", text: "Introns are translated before exons in bacteria." },
    ],
    answerId: "a",
    explanation:
      "The code is redundant, so some base changes are silent. Codons are not all unique; ribosomes do not assemble at random; bacterial genes typically lack that intron story.",
    objectiveCodes: ["IST-1.C"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "plasmid-reporter-not-photosynthesis",
    lessonSlug: "gene-regulation-and-biotech-tools",
    questionType: "multiple_choice",
    prompt:
      "A biotech-club plate grows green colonies after a plasmid transformation. What did the team actually demonstrate?",
    choices: [
      { id: "a", text: "The bacteria became plants and now run a Calvin cycle." },
      { id: "b", text: "A reporter gene on the plasmid was taken up and expressed." },
      { id: "c", text: "Crossing over moved chloroplasts from spinach into the cells." },
      { id: "d", text: "Hardy-Weinberg equilibrium was restored on the agar." },
    ],
    answerId: "b",
    explanation:
      "Green colonies mean uptake and expression of a reporter, not a conversion into plants, a chloroplast transplant, or a population-genetics equilibrium.",
    objectiveCodes: ["IST-2.D"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "allele-frequency-after-frost",
    lessonSlug: "selection-evidence-and-allele-change",
    questionType: "multiple_choice",
    prompt:
      "A frost kills unsheltered seedlings on a peninsula hillside. The survivors differ genetically and then set seed. What changed in the population?",
    choices: [
      { id: "a", text: "Allele frequencies shifted because selection favored heritable traits in that environment." },
      { id: "b", text: "Each dead plant evolved into a new species during the night." },
      { id: "c", text: "Need for warmth caused remaining plants to invent new genes on purpose." },
      { id: "d", text: "The population stayed at Hardy-Weinberg frequencies because frost is not a process." },
    ],
    answerId: "a",
    explanation:
      "Selection changes allele frequencies when survivors differ genetically and reproduce. Individuals do not evolve into new species overnight, and need does not write genes. Frost violates Hardy-Weinberg.",
    objectiveCodes: ["EVO-1.A", "EVO-1.E"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "shared-derived-trait-on-tree",
    lessonSlug: "speciation-and-phylogeny",
    questionType: "multiple_choice",
    prompt:
      "A club poster groups tuna with dolphins because both are streamlined. A second poster groups dolphins with other mammals using hair and milk glands. Which poster used a better phylogenetic character?",
    choices: [
      { id: "a", text: "The first, because analogous body shape always marks the closest relatives." },
      { id: "b", text: "The second, because shared derived mammalian traits reflect common ancestry." },
      { id: "c", text: "Neither, because trees cannot be hypotheses." },
      { id: "d", text: "The first, because tips drawn next to each other are always sisters." },
    ],
    answerId: "b",
    explanation:
      "Streamlining evolved independently in fish and dolphins, so it is a poor kinship mark. Hair and milk are shared derived mammalian characters. Trees are hypotheses, and layout order is not relatedness.",
    objectiveCodes: ["EVO-3.A", "EVO-1.C"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "hardy-weinberg-null-model",
    lessonSlug: "selection-evidence-and-allele-change",
    questionType: "multiple_choice",
    prompt:
      "Why do students still calculate Hardy-Weinberg frequencies for a real dune-beetle sample?",
    choices: [
      { id: "a", text: "The equations force every population to stop evolving." },
      { id: "b", text: "They provide a null model so deviations can reveal selection, drift, or gene flow." },
      { id: "c", text: "They replace fossils as the only evidence of common ancestry." },
      { id: "d", text: "They prove that mutation never occurs in insects." },
    ],
    answerId: "b",
    explanation:
      "Hardy-Weinberg is a null expectation. Departures point to evolutionary processes. The math does not freeze nature, replace other evidence, or deny mutation.",
    objectiveCodes: ["EVO-1.G"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "fitness-is-reproduction",
    lessonSlug: "selection-evidence-and-allele-change",
    questionType: "multiple_choice",
    prompt:
      "A small beetle leaves more surviving offspring than a stronger beetle in a dry year. Which statement is correct?",
    choices: [
      { id: "a", text: "The smaller beetle had higher fitness in that environment." },
      { id: "b", text: "Fitness always equals muscle strength." },
      { id: "c", text: "The stronger beetle evolved because it tried harder." },
      { id: "d", text: "Offspring number is irrelevant to selection." },
    ],
    answerId: "a",
    explanation:
      "Fitness is reproductive success in a stated environment. Strength and effort are not the definition, and offspring number is exactly what selection counts.",
    objectiveCodes: ["EVO-1.A"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "trophic-level-energy-loss",
    lessonSlug: "energy-flow-and-population-change",
    questionType: "multiple_choice",
    prompt:
      "A restored marsh has many pickleweed plants, fewer crabs, and still fewer herons. Which energy idea best explains the pattern?",
    choices: [
      { id: "a", text: "Each trophic transfer loses a large fraction of energy as heat, so upper levels support less biomass." },
      { id: "b", text: "Energy cycles from herons back to pickleweed without loss." },
      { id: "c", text: "Herons photosynthesize, so they should outnumber producers." },
      { id: "d", text: "Matter cannot cycle, so crabs cannot exist between plants and birds." },
    ],
    answerId: "a",
    explanation:
      "Energy pyramids shrink because metabolism radiates heat at each step. Energy does not cycle like matter. Herons are consumers, not producers.",
    objectiveCodes: ["ENE-1.N"],
    difficulty: "easy",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "keystone-otter-kelp-collapse",
    lessonSlug: "communities-disruption-and-biodiversity",
    questionType: "multiple_choice",
    prompt:
      "After sea otters decline, urchins increase and kelp forests collapse along a stretch of coast. What ecological role were the otters playing?",
    choices: [
      { id: "a", text: "A keystone predator whose removal starts a trophic cascade." },
      { id: "b", text: "A primary producer that fixed carbon for the kelp." },
      { id: "c", text: "A Hardy-Weinberg assumption that mating was random." },
      { id: "d", text: "A spliceosome that processed kelp mRNA." },
    ],
    answerId: "a",
    explanation:
      "Otters keep urchins in check; losing them lets herbivores erase kelp. That is a keystone-driven cascade, not production, population-genetic assumptions, or RNA splicing.",
    objectiveCodes: ["SYI-3.A", "SYI-3.F"],
    difficulty: "hard",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "logistic-carrying-capacity",
    lessonSlug: "energy-flow-and-population-change",
    questionType: "multiple_choice",
    prompt:
      "A pickleweed count rises quickly, then levels off in a fenced marsh plot. Which model fits if resources are now limiting?",
    choices: [
      { id: "a", text: "Logistic growth approaching carrying capacity." },
      { id: "b", text: "Exponential growth with unlimited space and nutrients." },
      { id: "c", text: "A cell-cycle checkpoint in G2." },
      { id: "d", text: "An operon turning off photosynthesis genes in herons." },
    ],
    answerId: "a",
    explanation:
      "A rise that plateaus as resources tighten is logistic growth near K. Exponential growth would not level off for that reason, and molecular checkpoints or operons are the wrong scale.",
    objectiveCodes: ["SYI-1.G", "ENE-4.A"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_BIO_NAMESPACE,
    slug: "density-independent-tide",
    lessonSlug: "energy-flow-and-population-change",
    questionType: "multiple_choice",
    prompt:
      "A king tide washes out a crab plot whether the plot held ten crabs or two hundred. Which kind of factor is that?",
    choices: [
      { id: "a", text: "A density-independent disturbance." },
      { id: "b", text: "A density-dependent disease that only hits crowded groups." },
      { id: "c", text: "A shared derived character on a phylogeny." },
      { id: "d", text: "A competitive inhibitor of an enzyme active site." },
    ],
    answerId: "a",
    explanation:
      "A tide can cut numbers regardless of density. Disease that worsens with crowding is density-dependent. Trees and enzyme inhibitors are not population factors here.",
    objectiveCodes: ["ENE-3.D", "ENE-4.A"],
    difficulty: "medium",
    sourceBasis: AP_BIO_SOURCE_BASIS,
    version: 1,
  },
];

export const AP_BIO_QUESTION_COUNT = questions.length;

export default questions;
