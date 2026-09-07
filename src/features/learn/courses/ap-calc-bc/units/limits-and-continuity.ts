import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const limitsAndContinuityLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "limits-and-continuity",
    slug: "limit-language-and-algebraic-gateways",
    title: "Limit language and algebraic gateways",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["LIM-1.A", "LIM-1.C", "LIM-1.D", "LIM-1.E"],
    bodyPlain: [
      "A limit asks what a function is heading toward, not what it prints at the target. If a Peninsula math club graphs attendance as a function of minutes after 3:00, the value at exactly 3:12 may be missing because the sign-in sheet skipped a row. The limit as time approaches 3:12 can still exist if nearby times crowd around the same height. BC later reuses that same sentence for sequences, remainder terms, and improper integrals: the interesting object is the destination of a process, not a single plugged-in cell.",
      "Analytic evaluation starts with substitution. If substitution yields a number, that number is the limit, provided the function is defined in a punctured neighborhood. If substitution yields a 0/0 form, the function has a hole or a cancelable factor, not an automatic answer of zero. Factor, conjugate, or rewrite trigonometric identities until the shared obstruction disappears, then substitute again. The rewritten function agrees with the original except at the blocked input, so the limits match.",
      "One-sided limits keep the story honest on piecewise rules. A club-room heater that follows one linear plan before 5:00 and another after 5:00 can have a left-hand destination that disagrees with the right-hand destination. The two-sided limit exists only when those sides agree. Tables and graphs estimate; algebra confirms. A calculator zoom that looks flat can hide a jump of size 0.02, so BC students should treat a table as evidence, not as a proof.",
      "The squeeze idea is a third gateway. If a messy function is trapped between two simpler functions that share a limit, the trapped function is forced to that same limit. Oscillatory products such as x times a bounded sine are the usual classroom example, but the same reasoning later justifies remainder estimates for alternating series: if the leftover piece is boxed between two sequences that both go to zero, the leftover goes to zero.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "limits-and-continuity",
    slug: "continuity-jumps-and-infinite-limits",
    title: "Continuity, jumps, and infinite limits",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["LIM-2.A", "LIM-2.B", "LIM-2.D", "LIM-3.A", "LIM-3.B"],
    bodyPlain: [
      "Continuity at an input means three things happen together: the function is defined there, the two-sided limit exists, and those two numbers are equal. A removable discontinuity is a hole you could fill by rewriting a single output. A jump is a disagreement of one-sided limits. An infinite discontinuity is a vertical blow-up. Naming the type matters because later units treat them differently: a hole can be repaired for integration, while a vertical asymptote becomes an improper integral.",
      "On a closed interval, a continuous function must hit every intermediate height between its endpoint values. That intermediate-value fact is how a robotics club can argue that a battery-voltage curve, if continuous from 8.4 volts to 7.1 volts, crossed 7.8 volts at least once. The theorem does not name the time. It only guarantees existence. BC students should keep that distinction: existence theorems authorize a search, they do not print the coordinate.",
      "Infinite limits describe vertical asymptotes. As the input approaches a blocked value, the outputs may run off through large positives, large negatives, or opposite sides. Limits at infinity describe end behavior and horizontal or slant trends. Rational functions compare degrees: higher denominator degree drives the graph toward zero; equal degrees lock onto the ratio of leading coefficients. Those same comparisons later decide whether an improper integral or a p-series-like tail has a chance to converge.",
      "Continuity on an interval is also the ticket for later theorems about derivatives and integrals. If a hiking-club elevation profile has a jump, you cannot treat it as a single smooth object when you ask for an instantaneous grade or a net change. Clean the model first: decide whether the jump is a data error, a removable hole, or a real cliff that must be split into pieces. BC work on series and improper integrals inherits that same hygiene.",
    ].join("\n\n"),
  },
];
