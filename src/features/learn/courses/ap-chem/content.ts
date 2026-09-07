/**
 * Original BayAreaClubs lesson bodies for AP Chemistry.
 * Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_CHEM_FRAMEWORK_CODE,
  AP_CHEM_FRAMEWORK_YEAR,
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";
import { acidsAndBasesLessons } from "@/features/learn/courses/ap-chem/units/acids-and-bases";
import { applicationsOfThermodynamicsLessons } from "@/features/learn/courses/ap-chem/units/applications-of-thermodynamics";
import { atomicStructureLessons } from "@/features/learn/courses/ap-chem/units/atomic-structure-properties";
import { chemicalReactionsLessons } from "@/features/learn/courses/ap-chem/units/chemical-reactions";
import { compoundStructureLessons } from "@/features/learn/courses/ap-chem/units/compound-structure-properties";
import { equilibriumLessons } from "@/features/learn/courses/ap-chem/units/equilibrium";
import { intermolecularForcesLessons } from "@/features/learn/courses/ap-chem/units/intermolecular-forces-properties";
import { kineticsLessons } from "@/features/learn/courses/ap-chem/units/kinetics";
import { thermodynamicsLessons } from "@/features/learn/courses/ap-chem/units/thermodynamics";

export type { ApChemLesson };

export const lessons: readonly ApChemLesson[] = [
  ...atomicStructureLessons,
  ...compoundStructureLessons,
  ...intermolecularForcesLessons,
  ...chemicalReactionsLessons,
  ...kineticsLessons,
  ...thermodynamicsLessons,
  ...equilibriumLessons,
  ...acidsAndBasesLessons,
  ...applicationsOfThermodynamicsLessons,
];

export const content = {
  namespace: AP_CHEM_NAMESPACE,
  sourceBasis: AP_CHEM_SOURCE_BASIS,
  frameworkCode: AP_CHEM_FRAMEWORK_CODE,
  frameworkYear: AP_CHEM_FRAMEWORK_YEAR,
  lessons,
};

export default content;
