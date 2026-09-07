import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "inference-proportions",
    slug: "confidence-intervals-for-proportions",
    title: "Confidence Intervals for Proportions",
    position: 11,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.H", "UNC-4.A", "UNC-4.B", "UNC-4.C", "UNC-4.D"],
    bodyPlain: [
      "A confidence interval for a proportion uses one sample to give a range of plausible values for p. Peninsula Robotics asked an SRS of 80 current members whether Saturday afternoon builds should stay on the calendar. 47 said yes, so p̂ = 47/80 = 0.5875. A one-sample z interval is p̂ ± z* sqrt(p̂(1 − p̂)/n), after you check the conditions that make the sampling distribution of p̂ approximately normal and the standard error honest.",
      "Conditions: random sample or randomized experiment, 10% condition when sampling without replacement, and at least 10 expected successes and failures using the sample, n p̂ ≥ 10 and n(1 − p̂) ≥ 10. Here 47 and 33 both beat 10. For 95% confidence, z* is about 1.96. The standard error is sqrt(0.5875 × 0.4125 / 80) ≈ 0.055. The interval is about 0.5875 ± 1.96 × 0.055, or roughly 0.48 to 0.70.",
      "Interpret the interval, not the point. \"We are 95% confident that the proportion of all current members who want Saturday builds is between 0.48 and 0.70\" is the club sentence. It does not say that 95% of members are in that range. It does not say there is a 95% chance this one interval caught p after you have already computed it. The 95% refers to the method: in the long run, 95% of intervals built this way would contain the true p.",
      "A two-sample z interval estimates p1 − p2, the difference of two population proportions. If 47/80 robotics members want Saturday builds and 22/70 bake-sale members want Saturday shifts, the parameter is the difference of those two club-wide proportions. Check random, 10%, and success-failure in each sample. The standard error adds the two sample variances under the square root. Never write a one-sample sentence for a two-sample interval.",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "inference-proportions",
    slug: "significance-tests-for-proportions",
    title: "Significance Tests for Proportions",
    position: 12,
    estimatedMinutes: 22,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["UNC-4.E", "VAR-6.D", "VAR-6.E", "VAR-6.F", "DAT-3.A", "DAT-3.B"],
    bodyPlain: [
      "A significance test asks whether sample data are surprising if a claim about p is true. South Bay Chess claimed that half the students who stop at the lunch-table booth will try a rated game, so H0: p = 0.50. After an SRS of 60 visitors, 21 tried a game, so p̂ = 0.35. The alternative might be Ha: p < 0.50 if the officers only care about a drop, or Ha: p ≠ 0.50 if any difference from half matters. Write H0 and Ha in words and symbols before you compute.",
      "The one-sample z statistic is z = (p̂ − p0) / sqrt(p0(1 − p0)/n). Notice the null value p0, not p̂, goes into the standard deviation. Conditions use n p0 and n(1 − p0) ≥ 10, plus random and 10%. Here n p0 = 30. For p̂ = 0.35 and p0 = 0.50, z ≈ (0.35 − 0.50) / sqrt(0.50 × 0.50 / 60) ≈ −2.32. The P-value is the probability, if H0 is true, of a statistic at least this extreme in the direction of Ha.",
      "A small P-value means the data would be unusual if H0 were true, so you reject H0 at a stated α such as 0.05. A large P-value means the data are compatible with H0; you fail to reject, which is not the same as proving p = 0.50. \"There is convincing evidence that fewer than half of booth visitors try a rated game\" is a conclusion in context. \"We proved the claim is false\" is too strong. \"The P-value is the probability H0 is true\" is wrong.",
      "A Type I error is rejecting a true H0 — telling the chess club the booth is below half when it is not. A Type II error is failing to reject a false H0 — missing a real drop. Power is 1 minus the Type II probability. Larger n, a larger true difference from 0.50, and a larger α all raise power. Two-sample z tests compare p1 and p2 with H0: p1 − p2 = 0 (or another difference). Pool the success counts only for the two-sample z test of no difference, not for the two-sample interval.",
    ].join("\n\n"),
  },
];
