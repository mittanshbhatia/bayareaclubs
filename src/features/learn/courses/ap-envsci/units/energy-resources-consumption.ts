import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const energyResourcesConsumptionLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "energy-resources-consumption",
    slug: "fuels-grids-and-a-club-energy-audit",
    title: "Fuels, Grids, and a Club Energy Audit",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["STB-1.A", "STB-1.B"],
    bodyPlain: [
      "Energy use is a chain: a source, a conversion, a delivery system, and an end use. Coal, oil, and natural gas store ancient photosynthesis. Burning them yields heat that can make electricity or move a bus, and it also yields carbon dioxide and, depending on the fuel and the controls, sulfur oxides, nitrogen oxides, mercury, and particulates. A campus energy audit that only reads the electric bill hides the power plant and the fuel it burned that hour.",
      "The Silicon Valley Climate Club logged gym lights, kiln hours, and the weekend HVAC setback. Members then asked the district for the fuel mix on the local grid for those same days. A natural-gas peak plant can spin up when evening air conditioners and charging cars stack, which is why a club that shifts kiln use off a hot evening can cut both cost and combustion even if the school never installs a panel. Efficiency is a resource. It is the kilowatt-hour you did not have to generate.",
      "Not all fossil fuels are interchangeable. Coal tends to be dirtier per unit of electricity for several air pollutants and for carbon. Oil is energy-dense and still dominates transport. Natural gas often burns cleaner at the stack than coal for sulfur and particulates, and it still leaks methane along the supply chain. Mining and drilling also disturb land and water before combustion starts. A student who treats gas as carbon-free because the flame looks clean is misreading the ledger.",
      "Nuclear fission is not a fossil fuel. It yields large amounts of electricity with no stack carbon during operation and creates long-lived waste and accident risk that communities have to manage for longer than a club presidency. Hydropower is renewable at the rainfall scale and still drowns valleys, blocks fish, and depends on a snowpack that a dry La Nina year can shrink. The audit skill is the same for every source: name the energy service, the conversion losses, and the off-site effects that do not appear on the school meter.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "energy-resources-consumption",
    slug: "renewables-efficiency-and-tradeoffs",
    title: "Renewables, Efficiency, and Tradeoffs",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["STB-1.B", "STB-1.E", "STB-1.F"],
    bodyPlain: [
      "Renewable sources replenish on human timescales. Solar photovoltaic panels turn sunlight into current. Wind turbines turn moving air into current. Geothermal plants use Earth's heat. Biomass burns or digests recent plant matter. Each has a land, material, and wildlife cost. A hillside of turbines can kill birds and bats if sited on a ridge flyway. A desert photovoltaic field can fragment habitat and need water for cleaning. A geothermal well can be compact and still induce small seismic events if injection is careless.",
      "The Peninsula Eco Club compared a proposed parking-canopy array with a proposal to clear a strip of campus oak woodland for ground mounts. The canopy kept the trees, shaded cars, and produced less nameplate power because the lot is smaller than the grove. That is a real tradeoff, not a slogan. Students should be able to say which value they ranked first and what they gave up. Pretending there is a source with no footprint is how clubs lose debates to people who can name a single dead hawk.",
      "Energy quality and matching matter. A south-facing classroom already has daylight. Adding glass without shades can raise cooling demand more than the lights saved. A heat-pump water heater can beat a resistance heater on the same electricity. Insulation and sealing cut the load before any generator is sized. The first renewable kilowatt-hour should replace a wasteful kilowatt-hour, not a well-tuned one, if the goal is a smaller system.",
      "Storage and transmission decide whether a renewable hour is useful after sunset. Batteries, pumped hydro, and demand shifting are different tools. A club that only counts midday solar on a Saturday when the gym is empty is counting energy that the grid may already be dumping. Hydrogen, ethanol, and other fuels have their own farm, water, and leakage stories. The honest close of an energy unit is a table of services, sources, and leftover problems, not a winner ribbon.",
    ].join("\n\n"),
  },
];
