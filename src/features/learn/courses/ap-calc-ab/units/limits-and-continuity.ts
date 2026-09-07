/**
 * Unit 1 lessons. source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { LoaderLesson } from "@/features/learn/courses/types";

export type ApCalcAbLesson = LoaderLesson & {
  namespace: typeof AP_CALC_AB_NAMESPACE;
  sourceBasis: typeof AP_CALC_AB_SOURCE_BASIS;
  objectiveCodes: readonly string[];
};

export const lessons: readonly ApCalcAbLesson[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "approaching-a-value",
    title: "Approaching a value",
    unitSlug: "limits-and-continuity",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["LIM-1.A", "LIM-1.B", "LIM-1.C", "LIM-1.D", "LIM-1.E"],
    bodyPlain: [
      "A limit asks what output a function is heading toward as the input gets close to a number, not what happens at that exact input. The robotics club at a Burlingame high school logs battery voltage every tenth of a second. At t = 4.00 the logger drops a row, so the table has no value there. Nearby times still show voltages clustering near 11.8. The missing row does not stop us from saying the voltage is approaching 11.8. That is the everyday meaning of a limit: nearby outputs, not the single missing sample.",
      "Notation packages that idea. We write lim t→4 V(t) = 11.8 when the nearby values can be forced as close to 11.8 as we like by looking at times close to 4, other than 4 itself. The phrase other than 4 itself matters. A limit never consults V(4). It only consults a deleted neighborhood of 4.",
      "Left-hand and right-hand limits split the neighborhood. If the left side settles at one number and the right side at another, the two-sided limit does not exist. A jump in a piecewise rule is the usual classroom picture of that failure. If both sides agree, the two-sided limit exists and equals that common number.",
      "Tables, graphs, and algebra are three views of the same claim. A table can suggest a limit and a graph can make a jump obvious, but an algebraic rewrite is what proves a canceling factor is hiding a removable hole. Factor, cancel the shared factor that is zero only at the approach point, then evaluate the simplified rule. Multiplying by a conjugate does the same job for many radical forms. Students should move among table, graph, and algebra without changing the meaning of the statement.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "continuity-and-existence",
    title: "Continuity and existence",
    unitSlug: "limits-and-continuity",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["LIM-2.A", "LIM-2.B", "LIM-2.C", "LIM-2.D", "FUN-1.A"],
    bodyPlain: [
      "A function is continuous at a point when three things line up: the function is defined there, the two-sided limit exists, and those two numbers match. If the limit exists but the function value is different, the graph has a hole with a stray plotted point. If the sides disagree, the graph jumps. If the values blow up, the graph has a vertical asymptote. Naming the type of break is more useful than saying the function is just broken.",
      "The environmental club samples creek height at the San Francisquito gauge. Height is a continuous function of time on an ordinary afternoon: the water does not teleport. That fact lets us use existence theorems. If height is continuous from 8 a.m. to noon, and the readings move from 2.1 feet to 2.8 feet, then every intermediate height between those readings occurs at least once. That is the Intermediate Value Theorem in club clothes: a continuous path on a closed interval hits every output between its endpoints.",
      "Limits at infinity describe end behavior rather than a finite approach point. If a rational function's degree on top is smaller than the degree on the bottom, the values settle toward 0. If the degrees match, they settle toward the ratio of leading coefficients. If the top wins, the values grow without bound. Horizontal and slant pictures come from those comparisons, not from guessing at a graph.",
      "Sometimes a piecewise rule can be repaired. If the two sides of a break approach the same number, you can define or redefine the function at that single input so the three continuity conditions hold. If the sides disagree, no single assigned value will glue the graph together. Continuity is a local matching job, and some breaks cannot be patched.",
    ].join("\n\n"),
  },
];
