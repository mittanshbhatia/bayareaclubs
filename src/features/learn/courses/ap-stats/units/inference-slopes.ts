import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "inference-slopes",
    slug: "regression-slope-confidence-intervals",
    title: "Regression Slope Confidence Intervals",
    position: 17,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.K", "VAR-7.J", "VAR-7.K", "DAT-3.M"],
    bodyPlain: [
      "The least-squares slope b from a sample of students is a statistic. The slope β of the true linear relationship in the population is a parameter. Harbor Coding Club's 12 invented pairs of practice hours and presentation scores produced b ≈ 2.9 points per hour. A confidence interval for β looks like b ± t* SE_b, with df = n − 2. The extra lost degree of freedom is the price of estimating both intercept and slope.",
      "Suppose technology reports SE_b = 0.34 for those 12 points. For 95% confidence and df = 10, t* is about 2.23. The interval is about 2.9 ± 2.23 × 0.34, or roughly 2.1 to 3.7 points per hour. The club sentence is \"We are 95% confident that the true change in mean presentation score for each additional practice hour is between 2.1 and 3.7 points, for students like these.\" The interval estimates the slope, not one student's leftover residual.",
      "If the interval contains 0, 0 is a plausible value for β and a linear association in the population is not established by this interval. The interval 2.1 to 3.7 does not contain 0, so it is consistent with a positive population slope. That is not a guarantee that every extra hour causes a higher score. It is a statement about the linear model under the conditions you still have to check.",
      "Do not confuse the slope interval with a prediction interval for one future y, or with an interval for the intercept. The intercept interval answers a different question and is often meaningless when x = 0 is outside the data. These 12 students start at 1.0 hour, not at 0. Keep the units: points per hour, not just \"2.9.\"",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "inference-slopes",
    slug: "inference-for-slope-and-conditions",
    title: "Inference for Slope and Conditions",
    position: 18,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-7.L", "VAR-7.M", "DAT-3.N"],
    bodyPlain: [
      "A t test for slope uses H0: β = 0 (no linear relationship in the population) unless a different slope is claimed. The statistic is t = (b − β0) / SE_b with df = n − 2. For b = 2.9, β0 = 0, and SE_b = 0.34, t ≈ 8.5 on 10 df. The P-value is tiny. The club can say there is convincing evidence of a positive linear relationship between practice hours and mean presentation score for students like the ones sampled. The test does not say the relationship is curved, causal, or equally strong next semester.",
      "Conditions for inference about slope are stricter than \"the scatterplot looks okay.\" You need a linear form in the scatterplot, independent observations (random sample or randomized experiment, and no leftover time pattern), roughly constant residual spread (no megaphone), and residuals that look approximately normal (a residual histogram or normal probability plot without wild skew). The LINER mnemonic — Linear, Independent, Normal residuals, Equal variance, Random — is a checklist, not a magic word.",
      "A curved residual plot kills the linear inference even if r is large. A student who practiced 20 hours when everyone else practiced 1 to 7 hours is high leverage and can drag the slope. Always plot before you quote t. If the officers later add a new explanatory variable, they have left this one-predictor model. The interval and test in this unit are for the slope of a single least-squares line.",
      "Write the conclusion with both the statistical decision and the club meaning. \"Because the P-value is far below 0.05, we reject H0: β = 0. There is convincing evidence that mean presentation score is linearly associated with practice hours among Harbor Coding Club students like these.\" Then stop. Do not invent a story about motivation or sleep that the 12 points cannot support.",
    ].join("\n\n"),
  },
];
