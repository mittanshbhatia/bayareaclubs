/**
 * Original BayAreaClubs lesson bodies for AP Biology.
 * Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_BIO_FRAMEWORK_CODE,
  AP_BIO_FRAMEWORK_YEAR,
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";
import { cellCommunicationCycleLessons } from "@/features/learn/courses/ap-bio/units/cell-communication-cycle";
import { cellStructureFunctionLessons } from "@/features/learn/courses/ap-bio/units/cell-structure-function";
import { cellularEnergeticsLessons } from "@/features/learn/courses/ap-bio/units/cellular-energetics";
import { chemistryOfLifeLessons } from "@/features/learn/courses/ap-bio/units/chemistry-of-life";
import { ecologyLessons } from "@/features/learn/courses/ap-bio/units/ecology";
import { geneExpressionRegulationLessons } from "@/features/learn/courses/ap-bio/units/gene-expression-regulation";
import { heredityLessons } from "@/features/learn/courses/ap-bio/units/heredity";
import { naturalSelectionLessons } from "@/features/learn/courses/ap-bio/units/natural-selection";

export type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const lessons: readonly ApBioLesson[] = [
  ...chemistryOfLifeLessons,
  ...cellStructureFunctionLessons,
  ...cellularEnergeticsLessons,
  ...cellCommunicationCycleLessons,
  ...heredityLessons,
  ...geneExpressionRegulationLessons,
  ...naturalSelectionLessons,
  ...ecologyLessons,
];

export const content = {
  namespace: AP_BIO_NAMESPACE,
  sourceBasis: AP_BIO_SOURCE_BASIS,
  frameworkCode: AP_BIO_FRAMEWORK_CODE,
  frameworkYear: AP_BIO_FRAMEWORK_YEAR,
  lessons,
};

export default content;
