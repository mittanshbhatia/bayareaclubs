import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const infiniteSequencesSeriesLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "infinite-sequences-series",
    slug: "sequences-series-and-convergence-tests",
    title: "Sequences, series, and convergence tests",
    position: 1,
    estimatedMinutes: 25,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: [
      "LIM-7.A",
      "LIM-8.A",
      "LIM-8.B",
      "LIM-8.C",
      "LIM-8.D",
      "LIM-8.E",
      "LIM-8.F",
      "LIM-8.G",
    ],
    bodyPlain: [
      "A sequence is an ordered list of numbers. It converges if the terms approach a single finite height. A series is the running sum of a sequence. The series converges if that sequence of partial sums approaches a finite height. The nth-term test is a first filter: if the terms themselves do not go to zero, the series diverges. The converse is false. Harmonic terms go to zero and the harmonic series still diverges.",
      "A geometric series with ratio r sums to a over (1 minus r) when the absolute value of r is less than 1, starting from the first term a. If the absolute ratio is 1 or more, the geometric series diverges (except the trivial zero series). Many BC applications hide a geometric series inside a decimal expansion, a bouncing-ball story, or a generating function. Factor the first term and read the ratio before you invent a harder test.",
      "Positive-term tests include the integral test, comparison, and limit comparison. The integral test pairs a series with an improper integral of a decreasing positive function; they converge or diverge together. Comparison needs an inequality in the helpful direction. Limit comparison needs a positive finite limit of the term ratio. The ratio test looks at the limit of absolute a-sub-n-plus-one over a-sub-n: less than 1 converges absolutely, greater than 1 diverges, equal to 1 is silent. The ratio test is the usual radius-of-convergence engine for power series.",
      "Alternating series with decreasing absolute terms that go to zero converge. The error after n terms is at most the next unused absolute term, and the leftover has the sign of that next term. Absolute convergence implies convergence; conditional convergence means the signed series converges while the absolute series does not. Rearrangement is dangerous for conditional series. Name the test you used and check its hypotheses; a nameless correct-looking limit is not a justification.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "infinite-sequences-series",
    slug: "taylor-polynomials-and-error-bounds",
    title: "Taylor polynomials and error bounds",
    position: 2,
    estimatedMinutes: 25,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-8.A", "FUN-8.B", "FUN-8.C", "LIM-8.G"],
    bodyPlain: [
      "A Taylor polynomial of degree n for f at a center a matches f and its first n derivatives at a. The coefficients are f to the k at a, divided by k factorial, times (x minus a) to the k. At a equals 0 the same object is a Maclaurin polynomial. The degree-1 case is the linearization from Unit 4. Adding a quadratic term captures concavity. A math-club approximation of e to a small power can start from 1 plus x plus x-squared over 2 and already beat the tangent line.",
      "Standard expansions are worth knowing because they generate others: exponential, sine, cosine, 1 over (1 minus x), and the first terms of ln(1+x) and arctan x. Substitution, differentiation, and integration of a known series produce new series on an interval you must re-justify. The radius of convergence comes from the ratio test on the coefficients. The interval of convergence then requires endpoint tests, which can go either way and must be checked separately.",
      "The Lagrange remainder writes the error after degree n as f to the (n+1) at some c, times (x minus a) to the n+1, over (n+1) factorial. You rarely know c, so you bound the (n+1)st derivative on a window that contains both a and x. That bound times the usual factorial denominator is an error ceiling. Alternating series remainders, when they apply, are often simpler: next term, same sign pattern.",
      "A power series is a function. Inside its interval of convergence you may differentiate and integrate term by term. At the endpoints those operations can change convergence. When a problem asks how many terms are needed to guarantee an error less than 0.001, write the remainder inequality first, then solve for n. The algebra is in service of a guarantee, not a guess from a calculator plot.",
    ].join("\n\n"),
  },
];
