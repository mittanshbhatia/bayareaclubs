import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const earthSystemsResourcesLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "earth-systems-resources",
    slug: "plates-soils-and-a-watershed",
    title: "Plates, Soils, and a Watershed",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["ERT-4.A", "ERT-4.B", "ERT-4.C", "ERT-4.F"],
    bodyPlain: [
      "Earth's crust is broken into plates that move. Convergent edges can build mountains, island arcs, volcanoes, and earthquakes. Divergent edges can open rifts, spread seafloor, and also host volcanoes and quakes. Transform edges slide past each other and are famous for earthquakes without building a mountain chain. The Hayward and San Andreas traces that the geology club maps on a weekend are transform neighbors, not a textbook subduction cartoon. A plate-boundary map still helps a student predict where volcanoes, island arcs, hot spots, and faults cluster worldwide.",
      "Soil starts as parent rock that is weathered, moved, and dropped. Horizons then sort into layers with different organic content and mineral mix. An O or A horizon with litter and roots is not the same working material as a dense clay B horizon. Water-holding capacity changes with texture. Clay holds water tightly. Sand lets it through. Silt sits between. Porosity, permeability, and fertility all shift with particle size and with how much organic matter the horizon keeps. A soil texture triangle lets a club name a sample from percent sand, silt, and clay instead of calling every dark dirt loam.",
      "Club field kits can test texture, pH, and simple nutrient indicators before a restoration planting. Those tests are decision tools: they tell the team whether a slope will pond, wash, or starve a seedling. They are not a full laboratory certificate. Irrigation and fertilizer choices that ignore texture waste water and send nutrients downhill.",
      "A watershed is the land that drains to a common point. Ridgelines are the edges. The Alameda Creek Watershed Club traces storm drains to the creek, then to the bay, so members stop thinking of a parking-lot grate as a hole to nowhere. Vegetation, slope, soil, and pavement decide how fast water leaves and how much sediment and heat it carries. A healthy vegetated headwater slows peaks. A paved tributary sharpens them. Later pollution lessons only make sense if students can point to the watershed that collected the problem.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "earth-systems-resources",
    slug: "atmosphere-winds-and-pacific-swings",
    title: "Atmosphere, Winds, and Pacific Swings",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["ERT-4.D", "ERT-4.E", "ERT-4.F"],
    bodyPlain: [
      "The atmosphere is a thin stack of layers with different temperature trends and jobs. Most weather lives in the troposphere. The stratosphere above it holds the ozone layer that absorbs a slice of ultraviolet light. A club air-quality poster that treats the sky as one mixed room will misplace both smog and ozone-hole stories. Composition is mostly nitrogen and oxygen, with smaller shares of argon, water vapor, carbon dioxide, and other gases that still matter for climate and chemistry.",
      "Global wind belts exist because the sun heats the equator more than the poles and because Earth rotates. Warm air rises, cools, and sinks in circulating cells. The Coriolis effect turns moving air to the right in the Northern Hemisphere and to the left in the Southern Hemisphere. Those turns help set trade winds, westerlies, and the storm tracks that drag winter rain into California. Local geography edits the global sketch. A coastal range can wring moisture onto windward slopes and leave a rain shadow inland. Cold upwelling water along the coast chills the air and feeds summer fog that the Peninsula Eco Club uses as a free summer irrigator for coastal scrub.",
      "Incoming solar radiation is Earth's main energy income. Intensity depends on the angle of the rays and on season and latitude. The equator receives a higher average intensity than the poles. A location's longest summer day is its brightest season; its shortest winter day is its dimmest. That seasonal swing, not a change in the sun's identity, is why a Livermore garden and a Quito garden do not share the same growing calendar.",
      "El Nino and La Nina are Pacific surface-temperature patterns that rearrange rainfall, wind, and ocean circulation far beyond the equator. In many California winters, an El Nino flavor can mean a wetter south and shifted storm tracks, while a La Nina flavor can mean a drier, more drought-locked interior and a thinner Sierra snowpack. The club should treat those labels as pattern names with local exceptions, not as guaranteed rain switches. They still belong on a water-year planning sheet next to reservoir storage and snow-sensor maps.",
    ].join("\n\n"),
  },
];
