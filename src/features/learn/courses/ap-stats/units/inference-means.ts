import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "inference-means",
    slug: "t-intervals-for-means",
    title: "t Intervals for Means",
    position: 13,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.I", "VAR-7.A", "UNC-4.O", "UNC-4.P", "UNC-4.Q"],
    bodyPlain: [
      "When you estimate a mean and σ is unknown, the standard error is s/√n and the multiplier comes from a t distribution, not from z. Peninsula Robotics timed n = 22 autonomous runs on one invented Friday. The sample mean was x̄ = 19.8 seconds and the sample standard deviation was s = 3.4 seconds. The one-sample t interval is x̄ ± t* s/√n, with degrees of freedom n − 1 = 21.",
      "Conditions: random sample or randomized experiment, 10% condition when sampling a finite population, and a normal enough population or a large enough n. A dotplot of the 22 times should not show strong skew or a hard outlier if n is only 22. For 95% confidence and df = 21, t* is about 2.08, a little larger than 1.96 because s is extra uncertain. The standard error is 3.4/√22 ≈ 0.725. The interval is about 19.8 ± 2.08 × 0.725, or roughly 18.3 to 21.3 seconds.",
      "Interpret in context. \"We are 95% confident that the mean Friday autonomous time for this team's current robot-and-driver process is between 18.3 and 21.3 seconds.\" The interval estimates μ, not a single run, and not 95% of the 22 recorded times. If the officers needed a narrower interval, they would plan a larger n, not shrink t* by pretending s is σ.",
      "A two-sample t interval estimates μ1 − μ2 when the groups are independent. A paired t interval is different: you subtract within pairs first and then treat the differences as one sample. If each of 12 robots ran once with the countdown playlist and once silent, the data are paired. If 12 robots used the playlist and 10 different robots stayed silent, the data are two independent samples. Choosing the wrong interval is a design mistake, not a calculator mistake.",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "inference-means",
    slug: "t-tests-for-means-and-differences",
    title: "t Tests for Means and Differences",
    position: 14,
    estimatedMinutes: 22,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-7.B", "VAR-7.C", "VAR-7.D", "VAR-7.E", "DAT-3.E", "DAT-3.F"],
    bodyPlain: [
      "A one-sample t test asks whether μ equals a claimed value. Harbor Coding Club's advisor claimed that students spend 5.0 hours on the judging rubric. After an SRS of 18 members, x̄ = 5.8 hours and s = 1.4 hours. H0: μ = 5.0 versus Ha: μ > 5.0 if the club only cares about more time. The t statistic is t = (x̄ − μ0) / (s/√n) = (5.8 − 5.0) / (1.4/√18) ≈ 2.42 with df = 17. The P-value is the upper tail of t_17.",
      "Check random, 10%, and a roughly normal population of hours (or a large n). A single 12-hour outlier in a sample of 18 would make the t procedure shaky. State the conclusion in hours and in club language. Rejecting H0 at α = 0.05 would mean there is convincing evidence that the mean rubric time is greater than 5.0 hours. Failing to reject would mean the sample does not make 5.0 hours implausible. It would not prove the advisor's claim.",
      "Independent two-sample t tests compare μ1 and μ2. Use H0: μ1 − μ2 = 0 unless a different difference is claimed. Do not pool variances unless a rare equal-variance story is justified; the unpooled two-sample t with conservative or technology df is the AP-facing default. Paired t tests use the mean of the differences. The playlist-versus-silent design with the same 12 robots is paired. The two-team comparison of Peninsula Robotics versus a visiting squad's 10 different robots is two-sample.",
      "Matched pairs remove person-to-person or robot-to-robot variation that would otherwise inflate the two-sample standard error. If you ignore the pairing and treat 24 runs as two independent samples of 12, you usually lose power and you violate independence. Always go back to how the times were collected. The inference procedure is a sentence about the design, then a statistic, then a P-value, then a context conclusion.",
    ].join("\n\n"),
  },
];
