import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "sampling-distributions",
    slug: "sampling-distributions-of-proportions",
    title: "Sampling Distributions of Proportions",
    position: 9,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.G", "VAR-6.A", "VAR-6.B", "UNC-3.H", "UNC-3.I"],
    bodyPlain: [
      "A parameter describes a population. A statistic describes a sample. Sunset Yearbook wants the proportion p of the 1,200 students on the activity list who would pay $8 for a club color page. That p is a parameter. The officers take an SRS of n = 80 names and get 29 yes answers, so p̂ = 29/80 = 0.3625. That p̂ is a statistic. If they could repeat the SRS again and again, p̂ would bounce. The sampling distribution of p̂ is the distribution of those bounced values.",
      "When the sample is an SRS, the mean of the sampling distribution of p̂ is p. The standard deviation is sqrt(p(1 − p)/n), provided the population is at least 10 times the sample (the 10% condition) so that dependence from sampling without replacement stays small. For p = 0.40 and n = 80, the standard deviation is sqrt(0.40 × 0.60 / 80) ≈ 0.055. Larger n tightens the distribution. p̂ is unbiased for p because its sampling mean equals p.",
      "The shape becomes approximately normal when both np and n(1 − p) are at least 10. With n = 80 and p = 0.40, np = 32 and n(1 − p) = 48, so a normal model for p̂ is reasonable. With n = 12 and the same p, np = 4.8, and the normal shortcut is not. The success-failure condition is about the sampling distribution's shape, not about whether this one sample \"looks normal.\"",
      "Use the sampling distribution to talk about how far p̂ is likely to land from p, not to pretend one sample equals the population. If the true yearbook p were 0.40, seeing p̂ = 0.20 in an SRS of 80 would be unusual because 0.20 sits many standard deviations below 0.40. Seeing p̂ = 0.36 would be ordinary. That comparison is the seed of later confidence intervals and tests. Keep the invented yearbook numbers attached to the sentences so \"unusual\" has a context.",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "sampling-distributions",
    slug: "sampling-distributions-of-means",
    title: "Sampling Distributions of Means",
    position: 10,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["UNC-3.K", "UNC-3.L", "UNC-3.M", "UNC-3.N", "UNC-3.O"],
    bodyPlain: [
      "Let μ be the mean Saturday bake-sale revenue per student cashier, in dollars, for Mission Bake Sale's 90 trained cashiers. That μ is a parameter. An SRS of n cashiers produces a sample mean x̄. The sampling distribution of x̄ is the distribution of those sample means across repeated SRS draws of the same size.",
      "The mean of the sampling distribution of x̄ is μ. The standard deviation is σ/√n when the 10% condition holds. If the club treats σ = 6.4 dollars as known and takes n = 16, the standard deviation of x̄ is 6.4/4 = 1.6 dollars. Sample means vary less than individual cashier revenues. That is why a mean of 16 cashiers is a more stable summary than one cashier's till.",
      "Shape depends on the population and on n. If individual revenues are already approximately normal, then x̄ is approximately normal for any n. If individual revenues are skewed — a few huge catering orders on the right — the central limit theorem says that x̄ still becomes approximately normal when n is large enough. n = 16 can be enough for mild skew. A sharp skew with a small n is not a CLT free pass. Always state the population shape you are assuming.",
      "Standardize with z = (x̄ − μ) / (σ/√n) when σ is known and the normal model for x̄ is justified. Later, when σ is unknown, you will replace σ with the sample standard deviation s and use t. This lesson stays with the sampling-distribution idea: x̄ is a random variable with a center, a spread that shrinks like 1/√n, and a shape you must justify. Invented cashier dollars are here so the symbols stay attached to a club table, not to a floating formula.",
    ].join("\n\n"),
  },
];
