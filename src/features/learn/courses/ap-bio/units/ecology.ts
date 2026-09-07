import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const ecologyLessons: readonly ApBioLesson[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "ecology",
    slug: "energy-flow-and-population-change",
    title: "Energy flow and population change",
    position: 15,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["ENE-1.N", "ENE-3.D", "ENE-4.A", "SYI-1.G"],
    bodyPlain: [
      "Energy enters most ecosystems as sunlight captured by producers. Each transfer to a consumer loses a large fraction as heat from metabolism, so food chains are short and upper trophic levels hold less biomass. A pyramid of energy is not optional decoration. It is why a restored salt marsh can support many pickleweed plants, fewer crabs, and still fewer herons. Matter cycles; energy does not cycle in the same way.",
      "Populations change with births, deaths, immigration, and emigration. Exponential growth is possible when resources are effectively unlimited. Logistic growth slows as a population nears carrying capacity, the level the environment can support. Density-dependent factors such as disease and competition bite harder in crowded groups. Density-independent shocks, such as a king-tide washout, can cut numbers regardless of density.",
      "Life-history traits shape those curves. Some species produce many small offspring and invest little per individual. Others produce few and invest more. Neither strategy is universally better. A dune plant that sets thousands of seeds after a wet winter is playing a different game than a hawk that raises one brood. Students should connect a strategy to survival odds, not to a moral ranking.",
      "A club transect that counts pickleweed stems each month is a population data set only if the team also records the area and the method. A rising count can mean true growth, better detection, or a tide that exposed more plants. Graphs need units, a time axis, and a claim about which term in the growth equation changed.",
    ].join("\n\n"),
  },
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "ecology",
    slug: "communities-disruption-and-biodiversity",
    title: "Communities, disruption, and biodiversity",
    position: 16,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["SYI-3.A", "SYI-3.F", "IST-5.A", "ENE-4.B"],
    bodyPlain: [
      "A community is the set of interacting species in a place. Competition, predation, mutualism, and parasitism change abundances. A keystone species has an effect larger than its numbers suggest. Sea otters that eat urchins can keep kelp forests standing; remove the otters and urchins can mow the kelp. That is a trophic cascade, not a single pairwise fight.",
      "Disruption resets communities. Fire, flood, dredging, or an oil spill can strip biomass and change which species arrive first. Primary succession starts on bare substrate. Secondary succession starts where soil remains. Invasive species can skip the slow assembly and dominate because they lack local predators or use resources faster. A restored marsh that is then planted with a single ornamental is not a diverse community even if it looks green from the road.",
      "Biodiversity includes species richness and the evenness of their abundances. It also includes genetic diversity within species, which is the raw material for later selection. Habitat fragmentation around Bay Area creeks can leave small isolated populations that drift and lose alleles even if a few individuals remain. Conservation that only counts species, and never connectivity, misses that loss.",
      "Human disruption is part of the syllabus because it is part of the system. Nutrient runoff can bloom algae, crash oxygen, and kill fish. Climate shifts move ranges upslope and toward the poles. Students should name a mechanism—energy, nutrients, population, or interaction—when they discuss a headline. 'The environment got worse' is not an AP Biology explanation.",
    ].join("\n\n"),
  },
];
