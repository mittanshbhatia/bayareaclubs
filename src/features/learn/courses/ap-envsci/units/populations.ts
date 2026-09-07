import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const populationsLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "populations",
    slug: "specialists-curves-and-carrying-capacity",
    title: "Specialists, Curves, and Carrying Capacity",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["ERT-3.A", "ERT-3.B", "ERT-3.C", "ERT-3.D", "ERT-3.F"],
    bodyPlain: [
      "A specialist uses a narrow band of food or habitat. A generalist uses many. In a shrinking South Bay marsh, a rail that needs dense pickleweed cover is a specialist. A raccoon that eats crabs, picnic scraps, and fruit is a generalist. When the club's habitat map loses area, the specialist usually drops first. That is not a moral ranking. It is a prediction about who still has a resource when the menu shortens.",
      "Biologists also sort life histories. K-selected species tend to be larger, produce few young, invest heavily in each, mature slowly, and live in more stable settings. Competition among them is often high. r-selected species tend to be smaller, produce many young with little care, mature fast, and do well in disturbed or empty space. Many real species sit between the poles or shift with conditions. Invasive plants the club pulls from a levee are often r-selected: they flood a bare patch with seed before slower natives return. Those same natives, if they are K-selected trees or long-lived shrubs, take the hit harder when the invader arrives.",
      "A survivorship curve follows one cohort from birth to the last death. Type I is high survival through most of life and a drop in old age, common in large mammals with care. Type II is a fairly steady risk at every age. Type III is heavy early death and a few long-lived survivors, common in trees, oysters, and many fish. The club can sketch these from a simple life table without claiming the sketch is a census of the whole bay.",
      "Carrying capacity is the population size an environment can support for a stretch of time given the resources that are actually there. It is not a forever number. A wet year can raise the insect food that supports swallows. A drought can cut it. When resources are abundant, growth can accelerate. When they are scarce, growth slows, stalls, or overshoots and crashes. Resource bases are finite on every timescale the club can measure. A poster that treats carrying capacity as a single magic constant is teaching a slogan, not a field rule.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "populations",
    slug: "age-structure-and-demographic-shift",
    title: "Age Structure and Demographic Shift",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["EIN-1.A", "EIN-1.B", "EIN-1.C", "EIN-1.D"],
    bodyPlain: [
      "An age-structure diagram stacks the number of people (or animals) in each age band. A wide base means many children relative to adults and usually a growing population. A column means birth and death rates are closer to replacement. A narrow base means fewer children and an aging, often shrinking population. The Silicon Valley Climate Club uses census age bands for nearby cities when it models future water demand. The shape is the first clue. The total headcount alone is not.",
      "Total fertility rate is the average number of children a woman is expected to have in her lifetime given current age-specific rates. Replacement is near two in a low-mortality society because two children roughly replace two parents. Access to education, nutrition, family planning, and later marriage all tend to lower fertility. Infant mortality and overall death rates also move the growth rate. A club that wants to talk about population honestly has to name those levers instead of treating growth as a single cultural stereotype.",
      "Human population change is also limited by Earth's finite resource base and by density-dependent pressures such as clean water, food, disease, and territory. Density-independent events such as a major storm, a heat wave, a fire, or a drought can cut numbers regardless of how crowded a place already was. Both kinds of limit show up in Bay Area history: a dry-year reservoir cutback is density-dependent in effect when more users share a smaller supply, while a sudden wildfire evacuation is closer to a shock that does not care how carefully the water budget was written.",
      "The demographic transition describes a common path as a region industrializes: high birth and death rates give way to falling death rates first, then falling birth rates, ending in low birth and death rates. The four-stage sketch is a model, not a promise that every country will copy the same timeline. A club using it should ask which stage a region's rates resemble and what services changed, not assume that wealth automatically appears. The point is to read rates and age structure together so later units on land, energy, and pollution have a human denominator that is actually changing.",
    ].join("\n\n"),
  },
];
