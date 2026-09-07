/**
 * Original BayAreaClubs multiple-choice items for AP Chemistry.
 * Written from scratch. Not derived from College Board, Unlimited Voices,
 * Stellar Learning, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemQuestion,
} from "@/features/learn/courses/ap-chem/manifest";
import { questionsUnits1To4 } from "@/features/learn/courses/ap-chem/questions/units-1-4";
import { questionsUnits5To9 } from "@/features/learn/courses/ap-chem/questions/units-5-9";

export type {
  ApChemChoice,
  ApChemChoiceId,
  ApChemDifficulty,
  ApChemQuestion,
} from "@/features/learn/courses/ap-chem/manifest";

export const questions: readonly ApChemQuestion[] = [
  ...questionsUnits1To4,
  ...questionsUnits5To9,
];

export const questionBank = {
  namespace: AP_CHEM_NAMESPACE,
  sourceBasis: AP_CHEM_SOURCE_BASIS,
  questions,
};

export default questions;
