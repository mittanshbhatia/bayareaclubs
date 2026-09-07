import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "exploring-two-variable",
    slug: "two-way-tables-and-association",
    title: "Two-Way Tables and Association",
    position: 3,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.D", "UNC-1.P", "UNC-1.Q", "UNC-1.R"],
    bodyPlain: [
      "Two categorical variables live in a two-way table. Mission Bake Sale tracked flavor (chocolate, oatmeal, lemon, brownie) against shift (morning or afternoon) on one invented Saturday. The cells are joint counts. The row and column totals are marginal counts. Dividing a cell by the table total gives a joint relative frequency. Dividing a cell by its row total gives a conditional relative frequency for that row.",
      "Here is the invented table the officers actually used. Morning: chocolate 18, oatmeal 9, lemon 4, brownie 11. Afternoon: chocolate 16, oatmeal 12, lemon 11, brownie 17. The morning total is 42 trays. The afternoon total is 56 trays. The grand total is 98 trays. The joint relative frequency for morning lemon is 4/98, a little over 4%. That number answers \"What fraction of all trays were morning lemon?\" It does not answer \"Among morning trays, what fraction were lemon?\"",
      "Association is a comparison of conditional distributions. Among morning trays, lemon is 4/42, about 9.5%. Among afternoon trays, lemon is 11/56, about 19.6%. Those conditionals are not the same, so flavor and shift are associated in this Saturday's data. If the conditional distributions had matched, we would say the variables look independent in the sample. A segmented bar graph or a mosaic plot makes that comparison visible without forcing people to divide in their heads.",
      "Marginal distributions hide the association. The overall lemon share is 15/98, about 15%, which sits between the two shift conditionals. Reporting only the margin would make lemon look like a single club-wide taste. The two-way table is what lets a treasurer decide whether to bake more lemon for the afternoon line. Association in a table is not a cause. People who arrive after school may simply be hungrier, or the lemon glaze may have sold out in the morning for a reason the table cannot see.",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "exploring-two-variable",
    slug: "scatterplots-correlation-and-least-squares",
    title: "Scatterplots, Correlation, and Least Squares",
    position: 4,
    estimatedMinutes: 22,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["UNC-1.S", "DAT-1.A", "DAT-1.B", "DAT-1.C", "DAT-1.D", "DAT-1.E", "DAT-1.F"],
    bodyPlain: [
      "Two quantitative variables belong on a scatterplot. Harbor Coding Club logged hours a student practiced a judging rubric (x) and the student's hackathon presentation score out of 40 (y) for 12 members. The invented pairs were (1.0, 18), (1.5, 20), (2.0, 22), (2.5, 25), (3.0, 24), (3.5, 28), (4.0, 29), (4.5, 31), (5.0, 30), (5.5, 34), (6.0, 33), and (7.0, 36). Each point is one student. Form, direction, strength, and unusual points are the four things to name before anyone fits a line.",
      "This cloud is roughly linear, positive, and moderately strong: more practice hours go with higher scores, with a little scatter and no curved pattern that would make a straight line foolish. Correlation r measures the direction and strength of a linear association. It has no units, stays between −1 and 1, and does not change if you swap x and y or change units. Correlation is not a slope and is not a percent. An r near 0.9 would be a tighter line than this club's cloud; an r near 0.2 would be a weak linear signal.",
      "The least-squares line ŷ = a + b x is the line that minimizes the sum of squared residuals. A residual is y − ŷ, the vertical miss. For this invented list a calculator gives a line near ŷ = 16.1 + 2.9x. The slope 2.9 says that predicted score rises about 2.9 points for each extra practice hour, among these students. The intercept 16.1 is the predicted score at 0 hours. Treat a 0-hour intercept as a model number, not as a claim that a student who never practiced would actually walk in and score 16.1.",
      "r² is the fraction of the variation in y that the linear model accounts for. If r is about 0.94, then r² is about 0.88, so the line accounts for about 88% of the variability in presentation scores. The leftover 12% lives in the residuals. A residual plot should look like formless scatter. A curve, a megaphone, or one huge leftover means the linear summary is incomplete. An unusual x-value can be high leverage; a point that moves the slope a lot is influential. Always plot before you trust r or the slope.",
    ].join("\n\n"),
  },
];
