import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const livingWorldBiodiversityLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "living-world-biodiversity",
    slug: "three-layers-of-diversity",
    title: "Three Layers of Diversity",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["ERT-2.A", "ERT-2.B"],
    bodyPlain: [
      "Biodiversity is not one number. Genetic diversity is the variety of alleles inside a population. Species diversity is how many species are present and how evenly they are represented. Habitat diversity is how many distinct living spaces a landscape still offers. The East Bay Watershed Club uses all three when it reports on a creek restoration. A count of fish species can look healthy while a steelhead run has almost no genetic variety left after a drought bottleneck. That population may fail the next heat wave even if the species list still includes its name.",
      "A population bottleneck is a sharp drop that leaves few breeders. The alleles that survive are a random or stressed sample, not a carefully chosen best set. After a levee breach that stranded a tidewater goby pocket, the club's later fin-clip study (a school-approved, no-take protocol using shed mucus swabs) showed fewer rare markers than the upstream reference reach. The fish were still there. The options those fish could use if salinity swung again were fewer.",
      "Ecosystems with more species often rebound faster after a flood, fire, or disease because some remaining species can cover a role another species lost. Habitat loss works in the opposite direction. Specialists that need a narrow food or a large territory disappear first. Generalists that eat many foods and tolerate many settings linger. A marsh flattened into a single elevation and a single plant drops both species diversity and habitat diversity at once.",
      "People also rely on living systems for work that is easy to forget until it fails. Wetlands slow storm water, trap sediment, and nursery fish. Upland oak woodlands store carbon in wood and soil and break the force of winter wind. Pollinators move crop and wildflower genes. These are ecosystem services: provisioning, regulating, supporting, and cultural uses. A club grant that only prices a trail overlook and ignores flood storage is counting one service and silently spending the others.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "living-world-biodiversity",
    slug: "islands-tolerance-and-recovery",
    title: "Islands, Tolerance, and Recovery",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["ERT-2.D", "ERT-2.F", "ERT-2.G", "ERT-2.H", "ERT-2.I"],
    bodyPlain: [
      "Island biogeography treats an island as a patch with a distance to a mainland source and a size that sets how many territories fit. Larger islands and nearer islands usually hold more species at equilibrium because colonization is easier and extinction of small local groups is slower. The same math applies to habitat islands on land. A fenced remnant of coastal prairie on a peninsula campus is an island in a sea of parking and turf. If the remnant is tiny and far from the next remnant, the club should expect fewer specialist plants and a higher chance that one dry year erases a species from that patch.",
      "Ecological tolerance is the band of conditions an organism can survive: temperature, salinity, flow, sunlight, dissolved oxygen. Inside the band, individuals grow and reproduce. Near the edges they persist but do not thrive. Outside the band they are injured or die. A tidepool sculpin that the marine-science club measures at the outer coast may tolerate a wide splash of salinity. A freshwater insect larva in Alameda Creek may have a narrow dissolved-oxygen band. Knowing the band tells the club whether a heat spike is a nuisance or a die-off.",
      "Natural disruptions are not automatically smaller than human ones. A rare earthquake-driven slump, a century flood, or a stand-replacing fire can reset a hillside as thoroughly as a grading project. Earth processes also run on different clocks. Seasonal upwelling is periodic. A landslide may be episodic. A lightning strike is effectively random at the scale of one grove. Sea level has risen and fallen with the amount of glacial ice over geologic time, so today's marsh elevation is not a permanent fixture. When the physical template changes, habitats change in wide belts, not as single-tree accidents.",
      "Populations adapt when alleles that help under the new conditions become more common. That can happen over many generations or, in microbes, over a field season. It is not a plan the organism writes. Ecological succession is the community-level counterpart. Primary succession starts on bare substrate with no soil, such as a new dune sheet or cooled volcanic rock. Secondary succession starts where soil remains, such as a burned East Bay grassland. Pioneer species arrive first and change light, litter, and nitrogen. A keystone species, such as a sea otter that limits urchins or a beaver that ponds a creek, can steer the community even if it is not the most numerous animal on the data sheet.",
    ].join("\n\n"),
  },
];
