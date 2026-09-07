/**
 * Unit 1 lessons. Original BayAreaClubs prose. source_basis: ORIGINAL.
 */

import {
  AP_PRECALC_NAMESPACE,
  AP_PRECALC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-precalc/manifest";

export const polynomialRationalLessons = [
  {
    namespace: AP_PRECALC_NAMESPACE,
    unitSlug: "polynomial-rational",
    slug: "change-rates-and-polynomial-shape",
    title: "Rates of change and polynomial shape",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    objectiveCodes: ["1.1.A", "1.2.A", "1.3.A", "1.4.A", "1.6.A"],
    bodyPlain: [
      "A function is a rule that pairs each allowed input with exactly one output. When two club quantities change together—price and profit, time and battery voltage—you study that pairing instead of treating the numbers as a pile of isolated facts. The average rate of change of f from x = a to x = b is the slope of the secant: (f(b) − f(a)) / (b − a). It answers a plain question: how much output you get, on average, per unit of input on that interval. It does not claim the rate stayed constant between a and b.",
      "Peninsula Robotics logs remaining battery percent against minutes of driving. If the table shows 92 percent at 4 minutes and 68 percent at 12 minutes, the average rate is (68 − 92) / (12 − 4) = −3 percent per minute. A linear model would keep that same rate on every interval. A quadratic or cubic model would not. Checking two different intervals is how you see the difference: if the average rates disagree, a constant-rate story is already wrong.",
      "A polynomial is a sum of power terms with whole-number exponents, such as f(x) = −2x^3 + 5x + 1. The degree is the largest exponent that actually appears. The leading term, here −2x^3, decides the far-left and far-right behavior. For an odd degree and a negative leading coefficient, as x grows large and positive the output drops without bound, and as x grows large and negative the output rises without bound. Even degree with a positive leading coefficient rises on both ends. You can sketch those arrows before you plot any interior points.",
      "Interior shape still matters. A quadratic opens one way and has one turning region. A cubic can rise, flatten, and fall, so a bake-sale profit model P(p) = −2p^2 + 24p − 30 can increase on cheap prices and decrease after the price drives customers away. The average rate from p = 4 to p = 6 is not the same as the average rate from p = 8 to p = 10, and that mismatch is the mathematical signal that the club should not treat every dollar of price change as equal.",
      "When you defend a polynomial model, name the intervals you used, compute the average rates, and state the end-behavior arrows from the leading term. A pretty curve that contradicts the table or the long-run arrows is not a better model. The job is to match how the quantities actually change together, not to decorate a scatterplot.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    unitSlug: "polynomial-rational",
    slug: "rational-graphs-zeros-and-holes",
    title: "Rational graphs, zeros, and holes",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    objectiveCodes: ["1.7.A", "1.8.A", "1.9.A", "1.10.A", "1.11.A"],
    bodyPlain: [
      "A rational function is a quotient of polynomials, written r(x) = n(x) / d(x) where the denominator is not the zero polynomial. Every later feature—zeros, holes, vertical asymptotes, and end behavior—comes from comparing those two polynomials after you factor and cancel matching factors. Canceling is not decoration. It changes which x-values are missing from the domain and which breaks in the graph are holes instead of vertical walls.",
      "East Bay Carpool Club estimates cost per rider as C(n) = (180 + 12n) / n, where 180 is a van fee and 12 is snacks per person. Algebraically that is 12 + 180/n for n > 0. As more riders join, C(n) falls toward 12 but never reaches it in this story, because the fixed fee is always spread across a finite group. That long-run floor is end behavior: the degrees of numerator and denominator match if you expand 180 + 12n, and the ratio of leading coefficients is 12.",
      "A zero of r occurs where the simplified numerator is zero and the denominator is not. A vertical asymptote occurs where the simplified denominator is zero. A hole occurs where a factor cancels: the original function is undefined there, but the simplified function has a removable gap. For f(x) = (x^2 − 1) / (x − 1), the factor (x − 1) cancels for x ≠ 1 and leaves x + 1, so the graph matches the line y = x + 1 except for a hole at x = 1. Calling that x-value a vertical asymptote is a classification error.",
      "End behavior of a rational function is a degree contest. If the denominator’s degree is larger, the outputs approach 0. If the degrees match, the outputs approach the ratio of leading coefficients. If the numerator’s degree is exactly one larger, the graph follows a slanted line for large |x|. Those three cases are enough for the models in this unit; you do not need a new story for every coefficient.",
      "When a club writes a rational model, write the domain in the same breath. A canceled factor is a hole, a leftover denominator zero is a wall, and the long-run arrows come from degrees, not from a single plotted point near the origin. Equivalent rewritten forms help you see those features, but they are equivalent only on the shared domain.",
    ].join("\n\n"),
  },
] as const;
