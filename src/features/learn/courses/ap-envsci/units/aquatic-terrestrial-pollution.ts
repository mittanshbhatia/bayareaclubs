import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const aquaticTerrestrialPollutionLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "aquatic-terrestrial-pollution",
    slug: "runoff-blooms-and-wetland-filters",
    title: "Runoff, Blooms, and Wetland Filters",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["STB-3.B", "STB-3.C", "STB-3.F"],
    bodyPlain: [
      "Point sources leave through a pipe you can point at: a wastewater outfall, a factory drain. Nonpoint sources leave from a landscape: farm fields, streets, roofs, and yards. The first autumn flush in a Bay Area creek is mostly nonpoint. Oil, nutrients, bacteria, and warm water that sat on pavement all season ride the first rain into the channel. The Alameda Creek Watershed Club times its water-quality dip to that flush because a July sample can look polite while the October sample tells the year.",
      "Nutrients that fertilize land can fertilize water. Extra nitrogen and phosphorus feed algae. When the bloom dies, microbes consume oxygen and can create a hypoxic zone that fish and invertebrates cannot use. That sequence is cultural eutrophication when people supplied the nutrients. A constructed or restored wetland can slow water, settle sediment, and let plants and microbes take up a share of those nutrients before they reach the bay. It is a filter with a capacity, not a magic sink. If the incoming load keeps rising, the wetland saturates and exports the problem on a delay.",
      "Thermal pollution is heat as a pollutant. Power-plant cooling water and unshaded, dark pavement both raise stream temperature. Warmer water holds less dissolved oxygen, and cold-water fish hit their tolerance edge. Shade, cooling towers, and keeping runoff in soil instead of on asphalt are design answers. Dumping ice in a thermometer cup for a photo is not.",
      "Sediment is a pollutant when it smothers gravel that salmon need or carries phosphorus stuck to particles. Construction sites without wattles and cover, overgrazed banks, and clearcut slopes all raise the load. The club's silt-fence checklist exists because a single ungated stockpile can undo a season of creek planting. Human activity on land becomes an aquatic problem at the first culvert. That is why this unit sits after watersheds and land use, not before them.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "aquatic-terrestrial-pollution",
    slug: "toxins-waste-and-treatment-choices",
    title: "Toxins, Waste, and Treatment Choices",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["STB-3.H", "STB-3.I", "STB-3.K", "STB-3.L", "STB-3.M"],
    bodyPlain: [
      "Persistent organic pollutants last. They resist breakdown, travel, and can dissolve into fats. A chemical that is rare in water can still become common in a striped bass after it has passed through plankton and smaller fish. That climb is biomagnification. Bioaccumulation is the buildup in one body over time. The club's invented advisory board for a fictional slough uses those words on purpose: a fisher who eats a lot of large fish from a contaminated reach takes a different risk than a student who wades once in boots.",
      "Lethal dose metrics such as LD50 compare how much of a substance kills half of a test population under controlled conditions. They are a ranking tool, not a permission slip to dump just under the number. Sublethal effects on reproduction, behavior, and immunity can matter at lower doses. A lab poster that treats LD50 as the only number that counts is incomplete. Endocrine disruptors can scramble hormones at traces. Heavy metals such as mercury and lead damage nerves and development and do not vanish when the drum is empty.",
      "Solid waste is a design problem. Landfills isolate trash, produce methane if organic waste rots without air, and can leak leachate if liners and covers fail. Incineration shrinks volume and can make electricity, and it can emit pollutants if controls are weak. Recycling and composting cut the incoming stream when markets and contamination rules are real. The campus waste audit the climate club ran found that food scraps in the landfill dumpster were a methane story and that dirty clamshells in the recycling dumpster were a contamination story. Two different fixes.",
      "Sewage treatment is a staged removal. Primary settling takes solids. Secondary biological treatment lets microbes consume dissolved organic waste. Tertiary steps can cut nutrients or disinfect. Combined sewer overflows during storms dump untreated mix when pipes are undersized. A drought-year purple-pipe project that reuses treated water for landscaping is a treatment success only if the plant actually reached the standard. Lethal algae, beach closures, and fish kills are what the untreated remainder looks like when the stages are skipped.",
    ].join("\n\n"),
  },
];
