/**
 * Original BayAreaClubs lesson bodies for AP Environmental Science.
 * Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_ENVSCI_FRAMEWORK_CODE,
  AP_ENVSCI_FRAMEWORK_YEAR,
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";
import { aquaticTerrestrialPollutionLessons } from "@/features/learn/courses/ap-envsci/units/aquatic-terrestrial-pollution";
import { atmosphericPollutionLessons } from "@/features/learn/courses/ap-envsci/units/atmospheric-pollution";
import { earthSystemsResourcesLessons } from "@/features/learn/courses/ap-envsci/units/earth-systems-resources";
import { energyResourcesConsumptionLessons } from "@/features/learn/courses/ap-envsci/units/energy-resources-consumption";
import { globalChangeLessons } from "@/features/learn/courses/ap-envsci/units/global-change";
import { landAndWaterUseLessons } from "@/features/learn/courses/ap-envsci/units/land-and-water-use";
import { livingWorldBiodiversityLessons } from "@/features/learn/courses/ap-envsci/units/living-world-biodiversity";
import { livingWorldEcosystemsLessons } from "@/features/learn/courses/ap-envsci/units/living-world-ecosystems";
import { populationsLessons } from "@/features/learn/courses/ap-envsci/units/populations";

export type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const lessons: readonly ApEnvsciLesson[] = [
  ...livingWorldEcosystemsLessons,
  ...livingWorldBiodiversityLessons,
  ...populationsLessons,
  ...earthSystemsResourcesLessons,
  ...landAndWaterUseLessons,
  ...energyResourcesConsumptionLessons,
  ...atmosphericPollutionLessons,
  ...aquaticTerrestrialPollutionLessons,
  ...globalChangeLessons,
];

export const content = {
  namespace: AP_ENVSCI_NAMESPACE,
  sourceBasis: AP_ENVSCI_SOURCE_BASIS,
  frameworkCode: AP_ENVSCI_FRAMEWORK_CODE,
  frameworkYear: AP_ENVSCI_FRAMEWORK_YEAR,
  lessons,
} as const;

export default content;
