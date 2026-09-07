import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const integrationAccumulationLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "integration-accumulation",
    slug: "riemann-accumulation-and-ftc",
    title: "Riemann sums, accumulation, and the FTC",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["CHA-4.A", "CHA-4.B", "CHA-4.C", "FUN-6.A", "FUN-6.B"],
    bodyPlain: [
      "A definite integral accumulates products of height times width. A Riemann sum slices an interval, samples a height from the rate function, multiplies by the slice width, and adds. Left, right, and midpoint sums are three sampling habits. As the mesh of the slices goes to zero, a continuous rate produces a definite integral. That number is net change: liters added, meters gained, members accumulated, not a snapshot height.",
      "The Fundamental Theorem links derivatives and definite integrals in two directions. If F is an antiderivative of f, the definite integral from a to b of f equals F(b) minus F(a). In the other direction, the derivative of an accumulation function that integrates f from a constant down to x is f(x), with a chain-rule factor if the upper limit is itself a function of x. A club that records power in watts can recover energy in joules by integrating, then recover power again by differentiating the running total.",
      "Properties of definite integrals let you split intervals, factor constants, and reverse limits with a sign change. If a rate is odd about the origin and the window is symmetric, the net integral can vanish even though plenty of area exists above and below. Net change and total variation are different questions. When a problem asks how much water entered a tank, you may need to integrate only the positive parts, or integrate the absolute rate, depending on the wording.",
      "Substitution is the chain rule run backward. If an inner function's derivative is sitting in the integrand, a u-replacement can collapse the integral. Always return to the original variable for a definite integral, or change the limits to the u-world and stay there. Mixed limits, original variable with u-integrand, are a self-inflicted error.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "integration-accumulation",
    slug: "parts-partial-fractions-and-improper",
    title: "Parts, partial fractions, and improper integrals",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-6.D", "LIM-6.A", "CHA-4.E"],
    bodyPlain: [
      "Integration by parts undoes a product rule. The pattern is the integral of u dv equals u v minus the integral of v du. Choose u so that it simplifies when differentiated, and dv so that it is still integrable. A standard pairing is a polynomial times an exponential or a sine. After one or two applications, the remaining integral should be easier, or it should match a multiple of the original so you can solve for that original integral. A parts table, used carefully, is only a bookkeeping device for the same identity.",
      "Partial fractions split a proper rational integrand into a sum of simpler pieces. Factor the denominator. Linear factors produce unadorned constants over those factors. Repeated linear factors need a chain of increasing powers. Irreducible quadratics produce linear numerators over those quadratics. After the split, each piece is a log or an arctangent or a power. If the original fraction is improper, divide first. A robotics energy model that writes a rational rate in time will not integrate until that algebra is done.",
      "An improper integral is a definite integral whose interval is unbounded or whose integrand blows up inside the interval. Replace the trouble with a variable limit and take a limit after you integrate. The integral from 1 to infinity of 1 over x-squared converges because the antiderivative 1 minus 1/b tends to 1 as b grows. The integral of 1/x from 1 to infinity diverges: the log grows without bound. Comparison with a known p-integral is allowed when a direct antiderivative is ugly. Convergence of an improper integral is a limit statement, which is why Unit 1 language returns here.",
      "These three BC techniques are original tools in this course, not optional extras. Parts handles product structures, partial fractions handle rational structures, and improper limits handle unbounded windows. A later series integral test will ask you to decide whether an improper integral of a positive decreasing function converges. That decision is this lesson, reused.",
    ].join("\n\n"),
  },
];
