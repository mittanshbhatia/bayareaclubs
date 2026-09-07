import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "inference-chi-square",
    slug: "chi-square-goodness-of-fit",
    title: "Chi-Square Goodness of Fit",
    position: 15,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.J", "VAR-8.A", "VAR-8.B", "VAR-8.C", "DAT-3.I"],
    bodyPlain: [
      "A chi-square goodness-of-fit test checks whether one categorical variable follows a claimed distribution. Mission Bake Sale advertised that weekend trays would be 30% chocolate, 20% oatmeal, 15% lemon, and 35% brownie. One invented Saturday produced 40 chocolate, 18 oatmeal, 22 lemon, and 40 brownie, for n = 120 trays. Those 120 trays are the observed counts. The hypothesized percentages times 120 are the expected counts: 36, 24, 18, and 42.",
      "The hypotheses are H0: the tray-type probabilities equal 0.30, 0.20, 0.15, 0.35 versus Ha: at least one probability differs. The statistic is χ² = Σ (O − E)² / E. For these invented numbers, the four terms are (40 − 36)²/36, (18 − 24)²/24, (22 − 18)²/18, and (40 − 42)²/42, which add to about 3.75. Degrees of freedom are categories minus 1, here 3. Large χ² means the observed list is far from the claimed mix.",
      "Conditions: random sample, 10% condition, and every expected count at least 5 (not every observed count). Here the smallest expected count is 18, so the expected-count condition holds. The P-value is the area to the right of the observed χ² on a chi-square curve with the stated df. A small P-value is evidence against the advertised mix. A large P-value, such as the one that belongs with 3.75 on 3 df, means this Saturday is compatible with the claim.",
      "Goodness-of-fit is one sample and one variable. It is the wrong tool for a two-way table that compares groups. Write expected counts from the hypothesis, not from a guess at what \"looks even.\" If the officers had claimed equal shares, each expected count would be 120/4 = 30, and the test would be a different question. The advertised 30-20-15-35 mix is the H0 this lesson actually tests.",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "inference-chi-square",
    slug: "chi-square-homogeneity-and-independence",
    title: "Chi-Square Homogeneity and Independence",
    position: 16,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-8.H", "VAR-8.I", "VAR-8.J", "DAT-3.K", "DAT-3.L"],
    bodyPlain: [
      "Homogeneity and independence both use a two-way table and the same χ² statistic, but they start from different designs. A test of homogeneity compares the distribution of one categorical variable across several groups that you sampled separately. A test of independence takes one sample and classifies each individual on two categorical variables. The calculator does not know which design you used. You do.",
      "Bayshore Drama sampled 50 cast members and 60 pit-orchestra members separately and asked each person for a favorite call-time window: before school, lunch, or after school. That is homogeneity: two independent samples, one response. Expected counts are (row total × column total) / table total. If 18 cast members chose lunch and the lunch column total is 40 in a table of 110, the expected count in that cell is (50 × 40) / 110 ≈ 18.2. The χ² adds (O − E)² / E over all cells. Degrees of freedom are (rows − 1)(columns − 1).",
      "Independence uses one SRS. East Bay Debate took one SRS of 90 cafeteria students and recorded whether the student already has a club (yes or no) and whether the student wants the club fair moved (stay or move). H0 says club membership and fair preference are independent in the cafeteria population. Expected counts use the same (row total × column total) / n formula. Conditions still need random sampling (or random assignment), the 10% condition, and all expected counts at least 5.",
      "Conclusions stay in design language. Homogeneity: \"There is convincing evidence that the distribution of call-time preference differs for cast and pit.\" Independence: \"There is convincing evidence of an association between current club membership and fair-location preference among cafeteria students.\" Do not say the test proved that being in a club causes someone to want the tables moved. Chi-square sees association in counts, not a mechanism.",
    ].join("\n\n"),
  },
];
