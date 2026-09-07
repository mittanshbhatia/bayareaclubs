import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const landAndWaterUseLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "land-and-water-use",
    slug: "commons-clearcuts-and-irrigation",
    title: "Commons, Clearcuts, and Irrigation",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["EIN-2.A", "EIN-2.B", "EIN-2.C", "EIN-2.D"],
    bodyPlain: [
      "A commons is a shared resource that no single user fully owns. If each user takes a little more because the cost is spread across everyone, the resource can collapse. A school garden well that every club treats as free will be pumped past recharge in a drought. A bay fishery that every boat treats as unlimited will land fewer fish next year. The tragedy is not that sharing is impossible. It is that open access without rules, seasons, or quotas rewards the person who takes first.",
      "Clearcutting removes most or all trees from a stand in one pass. It can be cheap per board and simple to plan. It also bares soil, raises soil and stream temperatures, and can increase flooding and sediment after rain. A Santa Cruz Mountains timber sale the forestry club tours after a winter storm is a field lesson in those tradeoffs: the landing may be efficient, and the creek below may run chocolate. Selective cuts and longer rotations cost more up front and leave more shade and roots.",
      "The Green Revolution raised yields with mechanization, fertilizer, irrigation, and improved crop varieties. That extra food supported larger human populations and reduced hunger in many regions. It also raised fossil-fuel use, nutrient runoff, pesticide dependence, and the water demand of farms that once waited on rain. A Central Valley field trip that only celebrates yield is incomplete. A field trip that only condemns fertilizer without naming the people the yield feeds is also incomplete.",
      "Irrigation methods are not equal. Flood irrigation is simple and loses a large share to evaporation and tailwater. Spray irrigation wastes less than flood but still loses water to wind and air. Drip irrigation delivers water near roots and can cut loss sharply, at higher equipment cost and maintenance. In a drought year the East Bay Watershed Club's partner farm switched two berry rows to drip and left a control row on sprinklers. The drip rows used less water per kilogram of fruit. They also needed filters the sprinkler row did not. Pest-control choices have the same shape: a broad-spectrum spray can be fast and can also kill predators the farm will miss next month.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "land-and-water-use",
    slug: "cities-footprints-and-smarter-farms",
    title: "Cities, Footprints, and Smarter Farms",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["EIN-2.K", "EIN-2.M", "STB-1.A", "STB-1.B", "STB-1.E"],
    bodyPlain: [
      "Urbanization concentrates people, pavement, and heat. Impervious roofs and lots speed runoff, cut infiltration, and send oil, metals, and warm water into creeks. Cities also concentrate demand for food, energy, and distant water. The Peninsula Eco Club's campus is a tiny city: the same hydrology applies to the main lot as to a downtown block. Ecological footprint language asks how much productive land and water a lifestyle requires, including the land needed to absorb waste carbon. A student who commutes alone in a large vehicle and eats a high feed-conversion diet is using more of that budget than a student who bikes and eats more plants, even if both live in the same zip code.",
      "Sustainability is the attempt to meet present needs without wrecking the systems that have to meet later needs. It is a combination of conservation, smarter design, and honest limits, not a sticker. Methods that shrink urban runoff include rain gardens, permeable pavers, green roofs, cisterns, and keeping canopy over soil. The club's courtyard rain garden is a working example: it is sized for a design storm, it has an overflow to the storm drain, and it is planted with species that tolerate both a soak and a dry spell. A planter that clogs and overflows onto the sidewalk is not a method. It is a failed install.",
      "Integrated pest management uses monitoring, thresholds, habitat for predators, physical barriers, and targeted chemistry only when the count says it is needed. It is slower to explain than a calendar spray and usually cheaper in the long run because it keeps beneficial insects alive. Sustainable agriculture and forestry keep soil covered, rotate crops or ages, reduce tillage where it fits, and leave buffers along creeks. Aquaculture can take pressure off wild stocks and can also concentrate waste and escapees if the pens are careless.",
      "Meat production and overfishing belong in the same honesty. Feedlot systems can produce a lot of protein on a small land footprint and can concentrate manure and antibiotic use. Free-range systems spread the animals and can spread erosion and a larger land demand. Overfishing collapses a stock and the jobs that depended on it. Mining removes a mineral and also removes overburden, can acidify drainage, and can leave a hole that becomes a long water-quality problem. None of these sentences is a ban. Each is a ledger the club should be able to read before it picks a lunch, a paper source, or a phone.",
    ].join("\n\n"),
  },
];
