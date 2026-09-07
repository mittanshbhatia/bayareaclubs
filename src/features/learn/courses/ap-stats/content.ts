/**
 * Original BayAreaClubs lesson bodies for AP Statistics.
 * Plain text only. source_basis: ORIGINAL.
 * Unit files re-export here so the loader sees one lessons array.
 */

import {
  AP_STATS_FRAMEWORK_CODE,
  AP_STATS_FRAMEWORK_YEAR,
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";
import { lessons as collectingDataLessons } from "@/features/learn/courses/ap-stats/units/collecting-data";
import { lessons as exploringOneVariableLessons } from "@/features/learn/courses/ap-stats/units/exploring-one-variable";
import { lessons as exploringTwoVariableLessons } from "@/features/learn/courses/ap-stats/units/exploring-two-variable";
import { lessons as inferenceChiSquareLessons } from "@/features/learn/courses/ap-stats/units/inference-chi-square";
import { lessons as inferenceMeansLessons } from "@/features/learn/courses/ap-stats/units/inference-means";
import { lessons as inferenceProportionsLessons } from "@/features/learn/courses/ap-stats/units/inference-proportions";
import { lessons as inferenceSlopesLessons } from "@/features/learn/courses/ap-stats/units/inference-slopes";
import { lessons as probabilityRandomVariablesLessons } from "@/features/learn/courses/ap-stats/units/probability-random-variables";
import { lessons as samplingDistributionsLessons } from "@/features/learn/courses/ap-stats/units/sampling-distributions";

export type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  ...exploringOneVariableLessons,
  ...exploringTwoVariableLessons,
  ...collectingDataLessons,
  ...probabilityRandomVariablesLessons,
  ...samplingDistributionsLessons,
  ...inferenceProportionsLessons,
  ...inferenceMeansLessons,
  ...inferenceChiSquareLessons,
  ...inferenceSlopesLessons,
];

export const content = {
  namespace: AP_STATS_NAMESPACE,
  sourceBasis: AP_STATS_SOURCE_BASIS,
  frameworkCode: AP_STATS_FRAMEWORK_CODE,
  frameworkYear: AP_STATS_FRAMEWORK_YEAR,
  lessons,
};

export default content;
