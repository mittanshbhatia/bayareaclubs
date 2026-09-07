import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const heredityLessons: readonly ApBioLesson[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "heredity",
    slug: "meiosis-and-genetic-variation",
    title: "Meiosis and genetic variation",
    position: 9,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["IST-1.F", "IST-1.H", "IST-1.I"],
    bodyPlain: [
      "Meiosis produces haploid gametes from a diploid parent cell. DNA is copied once. The cell then divides twice. In meiosis I, homologous chromosomes pair and separate. In meiosis II, sister chromatids separate. The result is four cells that are not genetically identical to the parent or usually to each other. Fertilization later restores diploidy. That cycle is why sexual reproduction can mix lineages without doubling chromosome number every generation.",
      "Variation is built into the process. Crossing over during prophase I swaps pieces between homologs. Independent assortment lines up maternal and paternal chromosomes in different combinations at metaphase I. Random fertilization multiplies those combinations again. A seed-tray Punnett square the garden club draws after crossing two heterozygous plants is a paper model of assortment, not a picture of crossing over, and students should keep those sources of variation distinct.",
      "Nondisjunction is a failure of separation. If homologs do not disjoin in meiosis I, or chromatids fail in meiosis II, gametes receive the wrong chromosome count. After fertilization, the zygote may have an extra chromosome or a missing one. The mechanism is mechanical and molecular: spindle attachments and checkpoint proteins failed. Saying 'a mutation happened' is usually the wrong category.",
      "Mitosis and meiosis share spindle machinery and a need for accurate DNA copies, but their chromosome dances differ. Mitosis keeps chromosome number constant and yields clones used for growth and repair. Meiosis halves the number and shuffles alleles. When a prompt shows a cell with paired homologs, students should be in meiosis I, not in a mitotic metaphase.",
    ].join("\n\n"),
  },
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "heredity",
    slug: "inheritance-patterns-in-clubs",
    title: "Inheritance patterns in clubs",
    position: 10,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["IST-1.I", "IST-1.J", "IST-1.K", "SYI-3.C"],
    bodyPlain: [
      "Mendelian ratios appear when one gene with two alleles is tracked through a controlled cross and chance is given a large sample. A monohybrid heterozygous cross predicts three-to-one in the next generation of phenotypes if one allele is completely dominant. A dihybrid heterozygous cross predicts nine-to-three-to-three-to-one if the genes assort independently. Small club plantings will wobble around those ratios; that is sampling, not a new law.",
      "Not every trait is a single dominant switch. Incomplete dominance yields a blended heterozygote. Codominance lets both alleles show. Multiple alleles, as in familiar blood-group systems, expand the genotype list. Sex-linked genes on X or Y chromosomes produce different patterns in males and females of species with those systems. Linked genes on the same chromosome travel together unless crossing over separates them, so they violate independent assortment.",
      "Environment can change a phenotype without changing the genotype. A hydrangea the garden club moves from acidic to more neutral soil can shift bloom color while its alleles stay put. Temperature can affect pigment enzymes. Nutrition can change height. The genotype sets a range of possible phenotypes; the environment helps decide where in that range an individual lands.",
      "Pedigrees and chi-square tests are tools, not decorations. A pedigree that never shows father-to-son transmission of a trait in humans is a candidate for X-linkage. A chi-square result that rejects a nine-to-three-to-three-to-one model means the data do not fit independent assortment, so students should consider linkage or a wrong hypothesis, not 'math failed.' Write the biological claim first, then the count.",
    ].join("\n\n"),
  },
];
