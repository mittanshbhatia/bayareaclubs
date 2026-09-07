/**
 * Original BayAreaClubs lesson bodies for the AP CSP published skeleton.
 * Plain text only. Not a complete AP course. source_basis: ORIGINAL.
 */

import {
  AP_CSP_NAMESPACE,
  AP_CSP_SOURCE_BASIS,
} from "@/features/learn/courses/ap-csp/manifest";

export type ApCspLesson = {
  namespace: typeof AP_CSP_NAMESPACE;
  unitSlug: "computing-ideas-in-practice";
  slug: "purpose-users-and-iteration" | "bits-patterns-and-meaning";
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_CSP_SOURCE_BASIS;
  /** Official public CED identifiers only. */
  objectiveCodes: readonly string[];
  bodyPlain: string;
};

export const lessons: readonly ApCspLesson[] = [
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "computing-ideas-in-practice",
    slug: "purpose-users-and-iteration",
    title: "Purpose, Users, and Iteration",
    position: 1,
    estimatedMinutes: 18,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    // Public CED identifiers (Unit 1): CRD-1 collaboration, CRD-2 purpose/process
    objectiveCodes: ["CRD-1.A", "CRD-2.A", "CRD-2.B"],
    bodyPlain: [
      "A computing project starts with a purpose: a specific job a program should do for a specific group of people. Writing that purpose down is not decoration. It tells the team what to build first, what to test, and when a change is actually an improvement. A club checkout tool whose purpose is \"show officers who currently has the soldering iron\" succeeds when officers can answer that question quickly. Adding a photo collage of last year's banquet does not serve that purpose, even if it looks polished.",
      "Users are the people who will operate the program or be affected by it. Designers should name them, watch how they currently solve the problem, and list the steps that still confuse them. A volunteer who opens the app once a week needs different labels and defaults than an officer who uses it every afternoon. If the team never talks to those users, the program tends to match the programmers' habits instead of the club's real workflow.",
      "Iteration is the planned cycle of try, observe, and revise. After a short test, the team records what users attempted, where they stalled, and whether the stated purpose was met. The next version should change the parts that blocked the purpose—not just add features. Throwing away an early draft is not failure when the draft taught the team that the purpose was wrong or incomplete. Keeping a pretty draft that still cannot do the job is the more expensive mistake.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "computing-ideas-in-practice",
    slug: "bits-patterns-and-meaning",
    title: "Bits, Patterns, and Meaning",
    position: 2,
    estimatedMinutes: 18,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    // Public CED identifiers: DAT-1.A, DAT-1.B, DAT-2.A
    objectiveCodes: ["DAT-1.A", "DAT-1.B", "DAT-2.A"],
    bodyPlain: [
      "Computers store and send information as bits: values that can be in one of two states, often written 0 and 1. A single bit can represent a yes-or-no flag. Longer sequences of bits can represent integers, text characters, colors, or sound samples. None of those meanings lives inside the bits themselves. A program, a file format, or a protocol supplies a mapping that says how to interpret the pattern.",
      "Because the mapping is chosen, the same pattern can mean different things in different contexts. The eight bits 01000001 can be the integer 65, the character A in a common text encoding, or part of a color or audio sample. If two programs disagree about the mapping, they will read the same stored bits and produce different results. That is a representation problem, not a hardware failure.",
      "When a club collects data—temperatures, finish times, survey ratings—it also chooses what to record and how finely to encode it. An 8-bit whole-number temperature cannot store 72.5, and it cannot store values outside its numeric range. Those limits are not trivia: they decide which later questions the dataset can answer and which details are gone forever. Students should be able to explain both what a bit pattern can represent and what a particular encoding will lose.",
    ].join("\n\n"),
  },
];

export const content = {
  namespace: AP_CSP_NAMESPACE,
  sourceBasis: AP_CSP_SOURCE_BASIS,
  frameworkCode: "AP-CSP" as const,
  frameworkYear: 2020 as const,
  unitSlug: "computing-ideas-in-practice" as const,
  lessons,
};

export default content;
