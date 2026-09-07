import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const atmosphericPollutionLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "atmospheric-pollution",
    slug: "smog-inversions-and-wildfire-smoke",
    title: "Smog, Inversions, and Wildfire Smoke",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["STB-2.A", "STB-2.D", "STB-2.E"],
    bodyPlain: [
      "Primary air pollutants are emitted directly: carbon monoxide from incomplete combustion, sulfur dioxide from burning sulfur-bearing fuels, particulates from dust and smoke, and nitrogen oxides from hot engines and furnaces. Secondary pollutants form in the air. Tropospheric ozone is the classic school example. It is not coming out of a tailpipe as ozone. Nitrogen oxides and volatile organic compounds react in sunlight and make it. A club poster that lists ozone next to carbon monoxide as if both were pipe emissions is teaching the wrong formation story.",
      "Photochemical smog needs sunlight, still air, and the right precursors. Valleys and basins can trap that mix under a temperature inversion, a lid of warmer air over cooler air that stops vertical mixing. Livermore and San Jose have had winter and late-summer days when the club's cheap particle sensor stayed high until the afternoon wind finally mixed the column. Reducing precursor emissions, shifting driving out of the sunniest stall hours, and keeping refueling vapors captured all cut the recipe. Pretending a rooftop ionizer will fix a basin-scale inversion will not.",
      "Wildfire smoke is a Bay Area air week of its own. Diablo and Santa Ana wind events can push ash and fine particles from inland fires over campuses that did not start those fires. Fine particles travel into lungs and can carry other chemicals. The East Bay Watershed Club's smoke plan is operational: check the official air index, move practice indoors when the index says to, and do not treat a cotton mask as a respirator. The plan also names the land story: overgrown fuels, ignition sources, and drought-cured grass are not solved by an indoor-recess day.",
      "Thermal inversions and smoke plumes both teach the same physical idea. The atmosphere is not a reliable blender. Height, temperature structure, and wind decide whether a pollutant dilutes or sits in the breathing zone. A student who can draw a simple inversion lid over a valley and mark where a sensor should be placed is ready for the indoor-air and acid-rain lesson that follows.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "atmospheric-pollution",
    slug: "indoor-air-acid-rain-and-noise",
    title: "Indoor Air, Acid Rain, and Noise",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["STB-2.E", "STB-2.G", "STB-2.H", "STB-2.J"],
    bodyPlain: [
      "Indoor air can be worse than outdoor air because the volume is small and the sources are close. Radon seeps from some soils and rock into basements. Formaldehyde and other volatiles leave new furniture, pressed wood, and some cleaners. Carbon monoxide from a cracked furnace or a running car in a closed garage can kill without a warning smell. Tobacco smoke, mold spores, and unvented cooking add particles. The facilities check the climate club requested was simple: a carbon monoxide alarm near the kiln room, a radon test in the basement storage, and a no-idle rule at the pickup loop.",
      "Acid deposition starts when sulfur dioxide and nitrogen oxides form acids in the atmosphere and return as rain, snow, or dry particles. Those acids can lower the pH of poorly buffered lakes and strip nutrients and metals from soils. Downwind forests and fisheries take the harm even if they did not burn the coal. Scrubbers, low-sulfur fuels, and nitrogen-oxide controls cut the precursors. Liming a lake is a bandage that does not turn off the stack.",
      "Noise is an air-pressure pollutant people forget because it is not a molecule. Persistent loud sound raises stress, disrupts wildlife communication, and can damage hearing. A stadium speaker pointed at a marsh, a highway next to a heron roost, or a lunch courtyard with reflective concrete can all be redesigned. The fix is often distance, barriers, quieter equipment, and hours, not a poster that says be nice.",
      "Reduction strategies stack. Catalytic converters, vapor recovery, dust control on construction, indoor ventilation, and fuel switching each target a different source. The club should match the tool to the pollutant. A HEPA filter can cut indoor particles during a smoke week and will not remove radon. A radon fan will not cut tropospheric ozone outside. Naming the pollutant, the source, the pathway, and the receptor keeps air work from becoming a pile of unrelated gadgets.",
    ].join("\n\n"),
  },
];
