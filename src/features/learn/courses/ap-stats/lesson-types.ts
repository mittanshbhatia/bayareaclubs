import type { LoaderLesson } from "@/features/learn/courses/types";

import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";

export type ApStatsLesson = LoaderLesson & {
  namespace: typeof AP_STATS_NAMESPACE;
  sourceBasis: typeof AP_STATS_SOURCE_BASIS;
  objectiveCodes: readonly string[];
};
