/**
 * AP Environmental Science — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-ENVS, public CED year 2019.
 * Objective codes are public CED identifiers only (ERT, EIN, STB). No CED prose.
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_ENVSCI_NAMESPACE = "ap-envsci" as const;
export const AP_ENVSCI_FRAMEWORK_CODE = "AP-ENVS" as const;
export const AP_ENVSCI_FRAMEWORK_YEAR = 2019 as const;
export const AP_ENVSCI_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_ENVSCI_STATUS = "original_course" as const;
export const AP_ENVSCI_DISCIPLINE = "earth_science" as const;

export const AP_ENVSCI_OFFICIAL_UNIT_SLUGS = [
  "living-world-ecosystems",
  "living-world-biodiversity",
  "populations",
  "earth-systems-resources",
  "land-and-water-use",
  "energy-resources-consumption",
  "atmospheric-pollution",
  "aquatic-terrestrial-pollution",
  "global-change",
] as const;

export type ApEnvsciSourceBasis = typeof AP_ENVSCI_SOURCE_BASIS;
export type ApEnvsciCourseStatus = typeof AP_ENVSCI_STATUS;
export type ApEnvsciOfficialUnitSlug =
  (typeof AP_ENVSCI_OFFICIAL_UNIT_SLUGS)[number];

export type ApEnvsciManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApEnvsciManifestUnit = {
  slug: ApEnvsciOfficialUnitSlug;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApEnvsciManifestLesson[];
};

export type ApEnvsciManifest = {
  namespace: typeof AP_ENVSCI_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_ENVSCI_FRAMEWORK_CODE;
  frameworkYear: typeof AP_ENVSCI_FRAMEWORK_YEAR;
  discipline: typeof AP_ENVSCI_DISCIPLINE;
  sourceBasis: ApEnvsciSourceBasis;
  status: ApEnvsciCourseStatus;
  units: readonly ApEnvsciManifestUnit[];
};

export const manifest = {
  namespace: AP_ENVSCI_NAMESPACE,
  title: "AP Environmental Science",
  slug: "ap-envsci",
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Environmental Science. Units follow the public 2019 course unit list. Objective codes cite public CED identifiers only. This is not College Board material.",
  frameworkCode: AP_ENVSCI_FRAMEWORK_CODE,
  frameworkYear: AP_ENVSCI_FRAMEWORK_YEAR,
  discipline: AP_ENVSCI_DISCIPLINE,
  sourceBasis: AP_ENVSCI_SOURCE_BASIS,
  status: AP_ENVSCI_STATUS,
  units: [
    {
      slug: "living-world-ecosystems",
      title: "The Living World: Ecosystems",
      description:
        "Species interactions, biomes, biogeochemical cycles, and energy movement through Bay Area wetlands and uplands.",
      position: 1,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "wetland-partners-and-resource-limits",
          title: "Wetland Partners and Resource Limits",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "cycles-through-a-bay-marsh",
          title: "Cycles Through a Bay Marsh",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "living-world-biodiversity",
      title: "The Living World: Biodiversity",
      description:
        "Genetic, species, and habitat diversity, island patterns, tolerance, and succession after disruption.",
      position: 2,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "three-layers-of-diversity",
          title: "Three Layers of Diversity",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "islands-tolerance-and-recovery",
          title: "Islands, Tolerance, and Recovery",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "populations",
      title: "Populations",
      description:
        "Life-history strategies, survivorship, carrying capacity, and human demographic change.",
      position: 3,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "specialists-curves-and-carrying-capacity",
          title: "Specialists, Curves, and Carrying Capacity",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "age-structure-and-demographic-shift",
          title: "Age Structure and Demographic Shift",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "earth-systems-resources",
      title: "Earth Systems and Resources",
      description:
        "Plate boundaries, soils, atmosphere, watersheds, and Pacific climate swings that shape the Bay Area.",
      position: 4,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "plates-soils-and-a-watershed",
          title: "Plates, Soils, and a Watershed",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "atmosphere-winds-and-pacific-swings",
          title: "Atmosphere, Winds, and Pacific Swings",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "land-and-water-use",
      title: "Land and Water Use",
      description:
        "Shared resources, forestry, irrigation, cities, and practices that shrink a club's land and water footprint.",
      position: 5,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "commons-clearcuts-and-irrigation",
          title: "Commons, Clearcuts, and Irrigation",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "cities-footprints-and-smarter-farms",
          title: "Cities, Footprints, and Smarter Farms",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "energy-resources-consumption",
      title: "Energy Resources and Consumption",
      description:
        "Fossil fuels, renewable options, efficiency, and the tradeoffs a campus energy audit has to name.",
      position: 6,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "fuels-grids-and-a-club-energy-audit",
          title: "Fuels, Grids, and a Club Energy Audit",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "renewables-efficiency-and-tradeoffs",
          title: "Renewables, Efficiency, and Tradeoffs",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "atmospheric-pollution",
      title: "Atmospheric Pollution",
      description:
        "Photochemical smog, wildfire smoke, indoor air, acid deposition, and noise around Bay Area campuses.",
      position: 7,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "smog-inversions-and-wildfire-smoke",
          title: "Smog, Inversions, and Wildfire Smoke",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "indoor-air-acid-rain-and-noise",
          title: "Indoor Air, Acid Rain, and Noise",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "aquatic-terrestrial-pollution",
      title: "Aquatic and Terrestrial Pollution",
      description:
        "Runoff, eutrophication, persistent toxins, solid waste, and treatment choices that protect creeks and marshes.",
      position: 8,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "runoff-blooms-and-wetland-filters",
          title: "Runoff, Blooms, and Wetland Filters",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "toxins-waste-and-treatment-choices",
          title: "Toxins, Waste, and Treatment Choices",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "global-change",
      title: "Global Change",
      description:
        "Stratospheric ozone, greenhouse gases, climate feedbacks, invasives, and local responses that protect biodiversity.",
      position: 9,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "ozone-greenhouse-and-climate-feedbacks",
          title: "Ozone, Greenhouse, and Climate Feedbacks",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "invasives-habitat-loss-and-club-response",
          title: "Invasives, Habitat Loss, and Club Response",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
  ],
} as const satisfies ApEnvsciManifest;

export function toCourseManifest(
  source: typeof manifest = manifest,
): CourseManifest {
  return {
    namespace: source.namespace,
    title: source.title,
    description: source.description,
    frameworkCode: source.frameworkCode,
    frameworkYear: source.frameworkYear,
    discipline: source.discipline,
    units: source.units.map((unit) => ({
      slug: unit.slug,
      title: unit.title,
      description: unit.description,
      estimatedMinutes: unit.estimatedMinutes,
      lessons: unit.lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        estimatedMinutes: lesson.estimatedMinutes,
      })),
    })),
  };
}

export async function loadApEnvsciCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }, extra] = await Promise.all([
    import("@/features/learn/courses/ap-envsci/content"),
    import("@/features/learn/courses/ap-envsci/questions"),
    import("@/features/learn/courses/ap-envsci/tools"),
    import("@/features/learn/courses/ap-envsci/questions-advanced"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions: [...questions, ...extra.questions],
    tools,
  };
}

export default manifest;
