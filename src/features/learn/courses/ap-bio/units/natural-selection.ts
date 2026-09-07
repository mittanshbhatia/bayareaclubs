import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const naturalSelectionLessons: readonly ApBioLesson[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "natural-selection",
    slug: "selection-evidence-and-allele-change",
    title: "Selection, evidence, and allele change",
    position: 13,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["EVO-1.A", "EVO-1.C", "EVO-1.E", "EVO-1.G"],
    bodyPlain: [
      "Natural selection is unequal reproductive success that follows from heritable variation in a given environment. Individuals do not evolve in the population-genetic sense. Allele frequencies in a population do. A frost that kills unsheltered seedlings on a peninsula hillside changes the next generation only if the survivors differ genetically from the dead and then reproduce. Need, effort, or 'trying' is not the mechanism.",
      "Evidence for descent with modification comes from many independent records. Fossils show change through time. Homologous structures and shared developmental genes show common ancestry. Molecular sequences provide a nested pattern of similarity. Direct observation, such as bacteria acquiring resistance in a lab or pests changing under pesticide pressure, shows selection on short timescales. No single fossil is required to 'prove evolution'; the argument is the concordance of these lines.",
      "Hardy-Weinberg math is a null model. If a population is large, mating is random, and there is no selection, mutation, or migration, allele frequencies stay put and genotype frequencies follow p squared, two pq, and q squared. Real populations violate those assumptions. Selection, drift, gene flow, and mutation are the processes that move frequencies. Drift is strongest in small groups, such as a founding club of insects on one restored dune.",
      "Fitness is reproductive success in a stated environment, not strength or moral worth. A allele that helps in drought can hurt in a wet year. Students should always name the environment when they claim a trait is advantageous. A graph of allele frequency over years is the right evidence; a story about one heroic organism is not.",
    ].join("\n\n"),
  },
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "natural-selection",
    slug: "speciation-and-phylogeny",
    title: "Speciation and phylogeny",
    position: 14,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["EVO-2.B", "EVO-3.A", "EVO-1.C"],
    bodyPlain: [
      "Speciation is the splitting of one lineage into two that no longer share a common gene pool. Geographic isolation can start that split when a barrier stops gene flow. Reproductive isolating mechanisms—timing, behavior, gamete incompatibility, hybrid inviability—can finish it. Two bird songs that never attract the same mates can keep populations apart even on the same hillside.",
      "Phylogenetic trees are hypotheses about nested relatedness. A shared derived character supports a clade. A shared ancestral character does not. Analogous traits that evolved independently, such as streamlined bodies in dolphins and tuna, can mislead if they are treated as evidence of close kinship. Molecular characters are useful because they provide many independent sites, but they still need careful alignment and an explicit model.",
      "Reading a tree is a skill. Tips are taxa. Nodes are common ancestors. Rotation around a node does not change relationships. The closest relative of a taxon is the one that shares the most recent node, not the one drawn next to it on the page. A club poster that puts humans at the far right as if that were a finish line is misreading the diagram.",
      "Extinction prunes trees and opens ecological space. Mass losses in the fossil record are followed by radiations of the lineages that remain. On a local scale, a restored marsh that loses a specialist insect may also lose the plant that depended on it. Speciation and extinction together decide how many branches a living tree still holds.",
    ].join("\n\n"),
  },
];
