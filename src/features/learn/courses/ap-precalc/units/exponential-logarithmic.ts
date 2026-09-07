/**
 * Unit 2 lessons. Original BayAreaClubs prose. source_basis: ORIGINAL.
 */

import {
  AP_PRECALC_NAMESPACE,
  AP_PRECALC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-precalc/manifest";

export const exponentialLogarithmicLessons = [
  {
    namespace: AP_PRECALC_NAMESPACE,
    unitSlug: "exponential-logarithmic",
    slug: "exponential-change-and-log-inverses",
    title: "Exponential change and logarithmic inverses",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    objectiveCodes: ["2.1.A", "2.2.A", "2.3.A", "2.3.B", "2.9.A", "2.10.A"],
    bodyPlain: [
      "Sequences make the difference between adding and multiplying visible. An arithmetic sequence adds the same constant each step. A geometric sequence multiplies by the same constant each step. If a compost club records weekly masses 4, 12, 36, the common ratio is 3, not a common difference. Predicting the next value as 60 would treat the list as arithmetic and miss the actual growth rule.",
      "An exponential function extends that multiplicative idea to a real input: f(x) = a · b^x with a ≠ 0 and b > 0, b ≠ 1. The value a is the output at x = 0. The base b is the factor attached to each increase of 1 in x. If b > 1 the outputs grow; if 0 < b < 1 they decay toward 0. Mission Compost Club might model bin mass as m(t) = 2.5 · (1.08)^t kilograms after t weeks. Each week multiplies the previous mass by 1.08, which is an 8 percent increase, not an 8 kilogram add-on.",
      "Linear change and exponential change can look similar on a short interval, which is why clubs mis-fit them. A linear model adds a constant. An exponential model multiplies by a constant. If first differences in a table stay near one number, linear is the better first try. If ratios of consecutive outputs stay near one number, exponential is the better first try. Checking both is part of the modeling job, not extra credit.",
      "A logarithm undoes an exponential. The statement log_b(y) = x means b^x = y. So log_2(32) = 5 because 2^5 = 32. Applied to the compost model, solving 2.5 · (1.08)^t = 10 is asking for the week when the bin hits 10 kilograms. Dividing by 2.5 and taking a log isolates t. The log is not a new kind of mass; it is a tool for reading the exponent.",
      "Because exponential and log functions are inverses, their graphs reflect across y = x, and composing them in either order returns the original input on the proper domain. That inverse relationship is why a club can move from “what mass after 6 weeks?” to “how many weeks until 10 kilograms?” without inventing a second model.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    unitSlug: "exponential-logarithmic",
    slug: "composition-equations-and-semi-log",
    title: "Composition, equations, and semi-log plots",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    objectiveCodes: ["2.7.A", "2.8.A", "2.13.A", "2.14.A", "2.15.A"],
    bodyPlain: [
      "Composition feeds one function’s output into another function. If a bio club converts plate counts to a log scale and then fits a line, the second function sees log values, not the raw counts. Written (g ◦ f)(x) = g(f(x)), the inner function runs first. Order matters: converting to a log and then doubling is not the same as doubling and then converting to a log.",
      "An inverse function undoes a composition partner. If f maps weeks to mass, a matching inverse maps mass back to weeks. Exponential and logarithmic functions with the same base are that pair. You should still check the domain. A log is only defined for positive inputs, so an inverse that lands on a nonpositive mass is not a valid week in the story.",
      "Solving exponential equations uses that inverse on purpose. From 3^(2x) = 27, rewrite 27 as 3^3 so the bases match and the exponents must match: 2x = 3, so x = 3/2. When bases do not match cleanly, take a log of both sides and use log(b^x) = x log b. The algebra is a rewrite, not a new physical law. You still interpret the solution in the club units.",
      "A semi-log plot is a modeling test. Plot x on the ordinary axis and log(y) on the other. If those points sit near a line, an exponential model for y versus x is a reasonable candidate, because a constant multiplicative factor becomes a constant additive step on the log scale. If the semi-log plot bends, the exponential story is already in trouble, even if a calculator can still spit out a regression.",
      "Peninsula Astronomy Club sometimes compares a linear fit on raw brightness and an exponential fit checked on a semi-log grid. The winning model is the one whose residuals and whose transformed plot both stay honest, not the one with the flashiest equation. Articulating the assumption—constant add versus constant multiply—is part of the answer.",
    ].join("\n\n"),
  },
] as const;
