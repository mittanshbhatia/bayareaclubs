/**
 * Short original course overview. source_basis: ORIGINAL.
 * Not College Board, Stellar, or any licensed bank.
 */

import {
  AP_ENVSCI_FRAMEWORK_CODE,
  AP_ENVSCI_FRAMEWORK_YEAR,
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";

export const overview = {
  namespace: AP_ENVSCI_NAMESPACE,
  sourceBasis: AP_ENVSCI_SOURCE_BASIS,
  frameworkCode: AP_ENVSCI_FRAMEWORK_CODE,
  frameworkYear: AP_ENVSCI_FRAMEWORK_YEAR,
  title: "Course overview",
  bodyPlain: [
    "This BayAreaClubs course walks an environmental club through the public 2019 AP Environmental Science unit list: ecosystems, biodiversity, populations, Earth systems, land and water use, energy, air pollution, water and land pollution, and global change.",
    "Every lesson is original teaching prose written for campus clubs that monitor Bay wetlands, drought restrictions, and wildfire smoke. Objective codes are public CED identifiers only. Nothing here is copied from College Board items, Stellar banks, or published case studies.",
    "Use the practice and quiz tools to check unit ideas, the review set after a miss, notes while you read, and readiness before a mock exam week.",
  ].join("\n\n"),
} as const;

export default overview;
