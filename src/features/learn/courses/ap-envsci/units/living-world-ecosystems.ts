import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const livingWorldEcosystemsLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "living-world-ecosystems",
    slug: "wetland-partners-and-resource-limits",
    title: "Wetland Partners and Resource Limits",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["ERT-1.A", "ERT-1.B", "ERT-1.C"],
    bodyPlain: [
      "An ecosystem is a place plus the living and nonliving pieces that keep exchanging energy and matter there. On a South Bay salt marsh walk, the Peninsula Eco Club maps pickleweed, cordgrass, mud crabs, shorebirds, tide height, salinity, and dissolved oxygen. Those lists are not decoration. They show who can live in a zone and what each organism needs that another organism or the tide may already be using.",
      "Resource limits shape the pairing. If two shorebird species hunt the same small crabs on the same mudflat at the same tide, they compete. If a club count shows one species shifting to a higher bench while the other stays on the open flat, the overlap shrank and the competition eased. Predation is a different pairing: a heron that takes fish changes both the fish population and the behavior of fish that remain. Parasitism, mutualism, and commensalism are close, lasting pairings. A club example of mutualism is native bees that move pollen among restored gumplant while the flowers supply nectar. The bees are not doing the club a favor; both partners gain a resource they cannot get as cheaply alone.",
      "Terrestrial biomes are large climate-and-community packages. A temperate seasonal woodland on an East Bay ridge is not interchangeable with a desert wash in the Inner Coast Range even if both sit in California. Temperature range, rainfall timing, and soil control which plants can close their yearly energy budget. Those plants then set the food and cover available to animals. Aquatic biomes are packaged by salinity, depth, and flow. A freshwater slough that supplies drinking-water diversions is not the same working system as an open-bay eelgrass bed, even when both look wet on a map.",
      "Bay marshland and estuary water sit at the meeting of river and tide. Algae and wetland plants there both fix carbon and release oxygen, and they also take in carbon dioxide. When a club argues for a restored marsh as habitat, it should also be able to say what the water column is doing for gases and what the mud is doing for stored carbon. Naming the biome and the limiting resource keeps later arguments about biodiversity and pollution honest.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "living-world-ecosystems",
    slug: "cycles-through-a-bay-marsh",
    title: "Cycles Through a Bay Marsh",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["ERT-1.D", "ERT-1.E", "ERT-1.F", "ERT-1.G"],
    bodyPlain: [
      "Matter in an ecosystem is reused. Carbon atoms move among air, plants, animals, water, and long stores such as peat or limestone. In a restored Hayward marsh, cordgrass takes carbon dioxide from air during photosynthesis and builds tissue. Animals that eat the plants, microbes that respire the litter, and the outgoing tide that exports dissolved carbon all move those atoms again. Some stores hold carbon for a season of leaves. Other stores, such as buried marsh peat, hold it for centuries unless the marsh is drained or oxidized.",
      "Nitrogen is abundant in air as a gas most organisms cannot use. Certain microbes convert that gas into forms plants can take up. Club water samples from a farm ditch after a fertilizer pulse often show nitrate that plants and algae can use quickly. Unlike many nitrogen stores, most nitrogen reservoirs turn over on short timescales. That is why a single storm can change a creek's nitrogen story in a weekend, and why a club should resample after the first flush instead of trusting a dry-season snapshot.",
      "Phosphorus behaves differently. It has no significant gas phase in ordinary field conditions. The large stores sit in rock and sediment. Weathering, mining of phosphate rock, and erosion deliver phosphorus to soils and water. Once it reaches a slough, it tends to stick to particles and settle. A club that only watches the air will miss the phosphorus budget. A club that only watches the water after a dredge or a levee failure may suddenly see a pulse that had been locked in mud.",
      "The hydrologic cycle is the sun-powered movement of water among ice, liquid, and vapor. Evaporation from the bay, transpiration from marsh plants, condensation into coastal fog, precipitation on the Santa Cruz Mountains, infiltration into soils, and runoff down creeks are all one circulating inventory. A drought year does not destroy the cycle. It changes how long water stays in each store and how much reaches the marsh as freshwater. Energy moves with a different rule: it is not recycled. Sunlight captured by algae is partly stored as tissue and partly lost as heat at every feeding step. A food web that lists herons, fish, and plankton is also a map of that one-way energy fade.",
    ].join("\n\n"),
  },
];
