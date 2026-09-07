/**
 * Original BayAreaClubs multiple-choice items for AP Statistics.
 * Written from scratch. Not derived from College Board, Unlimited Voices,
 * Stellar Learning, or any other question bank. source_basis: ORIGINAL.
 * Invented club numbers only — no published exam tables.
 */

import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";

export type ApStatsChoiceId = "a" | "b" | "c" | "d";

export type ApStatsChoice = {
  id: ApStatsChoiceId;
  text: string;
};

export type ApStatsDifficulty = "easy" | "medium" | "hard";

export type ApStatsQuestion = {
  namespace: typeof AP_STATS_NAMESPACE;
  slug: string;
  lessonSlug: string | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApStatsChoice, ApStatsChoice, ApStatsChoice, ApStatsChoice];
  answerId: ApStatsChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApStatsDifficulty;
  sourceBasis: typeof AP_STATS_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApStatsQuestion[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "robotics-variable-type",
    lessonSlug: "variables-and-one-variable-graphs",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Robotics records alliance color (red or blue) for each Friday run. What kind of variable is alliance color?",
    choices: [
      { id: "a", text: "Quantitative, because red can be coded as 1 and blue as 2." },
      { id: "b", text: "Categorical, because the values are group labels, not measured amounts." },
      { id: "c", text: "Quantitative, because every robot must have a color." },
      { id: "d", text: "Neither, because a variable cannot have only two values." },
    ],
    answerId: "b",
    explanation:
      "Alliance color names a group. Coding labels as 1 and 2 does not make them measured amounts you can average in a meaningful way.",
    objectiveCodes: ["VAR-1.C"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "histogram-vs-bar-choice",
    lessonSlug: "variables-and-one-variable-graphs",
    questionType: "multiple_choice",
    prompt:
      "Officers have 24 invented autonomous times in seconds, including 16.8, 19.2, 21.4, and 26.9. Which display is appropriate for this one quantitative variable?",
    choices: [
      { id: "a", text: "A bar graph with a gap between every time, because each run is a category." },
      { id: "b", text: "A pie chart of the 24 exact times." },
      { id: "c", text: "A histogram or dotplot on a number line, with adjacent bins for nearby times." },
      { id: "d", text: "A two-way table of time versus time." },
    ],
    answerId: "c",
    explanation:
      "Time in seconds is quantitative. A histogram or dotplot places values on a number line. A bar graph is for category names.",
    objectiveCodes: ["UNC-1.G"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "z-score-bake-sale-cookies",
    lessonSlug: "center-spread-and-the-normal-curve",
    questionType: "multiple_choice",
    prompt:
      "Mission Bake Sale treats Saturday cookie-box counts as mound-shaped with mean 48 and standard deviation 6. What is the z-score for a Saturday with 60 boxes?",
    choices: [
      { id: "a", text: "z = 2, because (60 − 48) / 6 = 2." },
      { id: "b", text: "z = 12, because 60 − 48 = 12." },
      { id: "c", text: "z = 0.125, because 6 / 48 = 0.125." },
      { id: "d", text: "z = 10, because 60 / 6 = 10." },
    ],
    answerId: "a",
    explanation:
      "z = (x − mean) / s = (60 − 48) / 6 = 2. The Saturday is two standard deviations above the club mean.",
    objectiveCodes: ["UNC-1.K"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "empirical-rule-hackathon",
    lessonSlug: "center-spread-and-the-normal-curve",
    questionType: "multiple_choice",
    prompt:
      "Harbor Coding Club models hackathon hours as N(5.0, 1.2). Using the empirical rule, about 95% of students fall between which pair of hours?",
    choices: [
      { id: "a", text: "3.8 and 6.2 hours (one standard deviation from 5.0)." },
      { id: "b", text: "2.6 and 7.4 hours (two standard deviations from 5.0)." },
      { id: "c", text: "1.4 and 8.6 hours (three standard deviations from 5.0)." },
      { id: "d", text: "0 and 10 hours, because those are nice bounds." },
    ],
    answerId: "b",
    explanation:
      "About 95% lie within two σ of μ: 5.0 − 2(1.2) = 2.6 and 5.0 + 2(1.2) = 7.4. One σ is about 68%; three σ is about 99.7%.",
    objectiveCodes: ["UNC-1.M"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "bake-sale-two-way-joint",
    lessonSlug: "two-way-tables-and-association",
    questionType: "multiple_choice",
    prompt:
      "An invented Saturday table has morning lemon = 4 trays and a grand total of 98 trays. What is the joint relative frequency of morning lemon?",
    choices: [
      { id: "a", text: "4/42, the morning-row conditional." },
      { id: "b", text: "4/15, lemon as a share of all lemon trays." },
      { id: "c", text: "4/98, the cell count divided by the table total." },
      { id: "d", text: "42/98, the morning marginal." },
    ],
    answerId: "c",
    explanation:
      "A joint relative frequency divides the cell by the grand total. 4/42 is a morning conditional, not a joint.",
    objectiveCodes: ["UNC-1.P"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "two-way-conditional-association",
    lessonSlug: "two-way-tables-and-association",
    questionType: "multiple_choice",
    prompt:
      "Morning lemon is 4/42 ≈ 9.5% of morning trays. Afternoon lemon is 11/56 ≈ 19.6% of afternoon trays. What do those two conditionals say?",
    choices: [
      { id: "a", text: "Flavor and shift are associated in this sample, because the conditionals differ." },
      { id: "b", text: "The variables must be independent, because both percents are under 20%." },
      { id: "c", text: "Afternoon baking causes people to want lemon." },
      { id: "d", text: "The joint relative frequencies must add to 100% inside one row." },
    ],
    answerId: "a",
    explanation:
      "Different conditional distributions are the sample evidence of association. They do not prove a cause, and they are not required to be under 20%.",
    objectiveCodes: ["UNC-1.R"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "least-squares-residual-sign",
    lessonSlug: "scatterplots-correlation-and-least-squares",
    questionType: "multiple_choice",
    prompt:
      "A Harbor Coding Club line predicts ŷ = 16.1 + 2.9x. A student with 4.0 practice hours scored 29. What is the residual, and what does the sign mean?",
    choices: [
      { id: "a", text: "29 − 27.7 = 1.3; the actual score is 1.3 points above the line." },
      { id: "b", text: "27.7 − 29 = −1.3; the line is 1.3 below the score, so the residual is negative." },
      { id: "c", text: "29 + 27.7 = 56.7; residuals add the fit and the data." },
      { id: "d", text: "2.9; the residual equals the slope." },
    ],
    answerId: "a",
    explanation:
      "ŷ = 16.1 + 2.9(4.0) = 27.7. Residual = y − ŷ = 29 − 27.7 = 1.3. A positive residual means the actual score sits above the predicted value.",
    objectiveCodes: ["DAT-1.C"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "correlation-not-slope",
    lessonSlug: "scatterplots-correlation-and-least-squares",
    questionType: "multiple_choice",
    prompt:
      "For the same hours-versus-score cloud, r is about 0.94. Which sentence is correct?",
    choices: [
      { id: "a", text: "Predicted score rises 0.94 points per extra practice hour." },
      { id: "b", text: "94% of students scored exactly on the line." },
      { id: "c", text: "r describes a strong positive linear association; it is not the slope and not a percent of students." },
      { id: "d", text: "Swapping hours and score would change r from 0.94 to −0.94." },
    ],
    answerId: "c",
    explanation:
      "Correlation measures direction and strength of a linear association. The slope is a different number (about 2.9 here). Swapping x and y does not change r.",
    objectiveCodes: ["DAT-1.B"],
    difficulty: "hard",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "lunch-line-convenience-bias",
    lessonSlug: "sampling-surveys-and-bias",
    questionType: "multiple_choice",
    prompt:
      "East Bay Debate asks the first 40 students in the pizza line whether the club fair should move. Why is this a biased design?",
    choices: [
      { id: "a", text: "Any sample of 40 is too small to have a mean." },
      { id: "b", text: "A convenience sample systematically misses students who do not arrive early for pizza." },
      { id: "c", text: "Pizza eaters cannot hold opinions about tables." },
      { id: "d", text: "Bias means the officers forgot to compute a standard deviation." },
    ],
    answerId: "b",
    explanation:
      "Convenience sampling over-represents whoever is easy to reach. Early pizza-line students are not a random cross-section of the cafeteria.",
    objectiveCodes: ["DAT-2.C"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "srs-vs-stratified-clubs",
    lessonSlug: "sampling-surveys-and-bias",
    questionType: "multiple_choice",
    prompt:
      "The debate officers want ninth graders and everyone else both represented. They take an SRS of 20 ninth graders and an SRS of 20 other students. What method is this?",
    choices: [
      { id: "a", text: "A cluster sample of two lunch tables." },
      { id: "b", text: "A stratified sample, with grade band as the stratum." },
      { id: "c", text: "A voluntary response sample, because students can refuse." },
      { id: "d", text: "A census of the 480 cafeteria IDs." },
    ],
    answerId: "b",
    explanation:
      "Strata are groups you sample inside on purpose. Grade band is the stratum. Clusters would take whole groups, not an SRS inside each grade band.",
    objectiveCodes: ["DAT-2.B"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "playlist-experiment-confounding",
    lessonSlug: "experiments-random-assignment-and-scope",
    questionType: "multiple_choice",
    prompt:
      "All four-motor robots get a countdown playlist and all two-motor robots stay silent. Why can the club not claim the playlist caused faster autonomous times?",
    choices: [
      { id: "a", text: "Experiments are never allowed to have two treatments." },
      { id: "b", text: "Drivetrain type is confounded with audio: the two factors change together." },
      { id: "c", text: "Autonomous time is categorical, so no experiment can use it." },
      { id: "d", text: "The silent pit is not a treatment, so there is nothing to compare." },
    ],
    answerId: "b",
    explanation:
      "When drivetrain and audio are stacked, you cannot tell which factor changed the times. Random assignment inside blocks or a completely randomized design would separate them.",
    objectiveCodes: ["VAR-3.C"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "scope-inference-robotics",
    lessonSlug: "experiments-random-assignment-and-scope",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Robotics randomly assigns 16 in-house pairs to playlist or silent pit. It does not sample other Bay Area teams. What inference is justified if playlist times are lower?",
    choices: [
      { id: "a", text: "A causal claim for these 16 pairs, but not a generalization to every regional team." },
      { id: "b", text: "A generalization to every regional team, but never a causal claim." },
      { id: "c", text: "Both cause for all regional teams and a census of all robots." },
      { id: "d", text: "Neither cause nor any description of these 16 pairs." },
    ],
    answerId: "a",
    explanation:
      "Random assignment supports cause for the units you used. Without a random sample from a larger population, you do not get a free generalization to every team.",
    objectiveCodes: ["VAR-3.E"],
    difficulty: "hard",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "brownie-complement-rule",
    lessonSlug: "probability-rules-and-independence",
    questionType: "multiple_choice",
    prompt:
      "A tray has 8 brownies and 12 cookies. One item is equally likely. What is the probability the customer does not get a brownie?",
    choices: [
      { id: "a", text: "8/20 = 0.40" },
      { id: "b", text: "1 − 8/20 = 0.60" },
      { id: "c", text: "8 × 12 / 20" },
      { id: "d", text: "0, because someone will take a brownie eventually." },
    ],
    answerId: "b",
    explanation:
      "P(brownie) = 8/20 = 0.40, so P(not brownie) = 0.60. That is the complement rule for one reach.",
    objectiveCodes: ["UNC-2.A"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "without-replacement-not-independent",
    lessonSlug: "probability-rules-and-independence",
    questionType: "multiple_choice",
    prompt:
      "After a brownie is taken from the 8-and-12 tray, a second customer reaches without replacement. Why are the two reaches not independent?",
    choices: [
      { id: "a", text: "The second brownie probability is 7/19, which is not 8/20." },
      { id: "b", text: "Two events are never independent if they happen on the same day." },
      { id: "c", text: "Independence requires at least 30 items." },
      { id: "d", text: "Disjoint events are always independent." },
    ],
    answerId: "a",
    explanation:
      "Independence would keep the brownie probability at 8/20. Without replacement it becomes 7/19. Disjoint events with positive probability are not independent.",
    objectiveCodes: ["VAR-4.C"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "climb-binomial-conditions",
    lessonSlug: "random-variables-binomial-and-geometric",
    questionType: "multiple_choice",
    prompt:
      "A coach will run exactly 8 independent matches and count successful climbs with constant p = 0.35. Which model is this?",
    choices: [
      { id: "a", text: "Geometric, because the club cares about the first climb." },
      { id: "b", text: "Binomial with n = 8 and p = 0.35." },
      { id: "c", text: "Normal with mean 8 and standard deviation 0.35." },
      { id: "d", text: "Chi-square with 8 categories." },
    ],
    answerId: "b",
    explanation:
      "Fixed n, two outcomes, constant p, and independence is a binomial setting. Geometric would count the trial of the first success and would not fix n = 8.",
    objectiveCodes: ["VAR-5.A"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "geometric-first-success",
    lessonSlug: "random-variables-binomial-and-geometric",
    questionType: "multiple_choice",
    prompt:
      "Let W be the first match a robot climbs, with independent matches and p = 0.35. What is P(W = 3)?",
    choices: [
      { id: "a", text: "0.35³" },
      { id: "b", text: "C(3, 1) (0.35)(0.65)²" },
      { id: "c", text: "(0.65)² (0.35)" },
      { id: "d", text: "1 / 0.35" },
    ],
    answerId: "c",
    explanation:
      "Geometric: two failures then a success. P(W = 3) = (1 − p)² p = 0.65² × 0.35. 1/p is the mean, not this probability.",
    objectiveCodes: ["UNC-3.B"],
    difficulty: "hard",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "membership-phat-center",
    lessonSlug: "sampling-distributions-of-proportions",
    questionType: "multiple_choice",
    prompt:
      "Sunset Yearbook takes many SRS samples of size 80 from a list whose true yes-proportion is p = 0.40. What is the mean of the sampling distribution of p̂?",
    choices: [
      { id: "a", text: "0.40, the same as the parameter p." },
      { id: "b", text: "80, the sample size." },
      { id: "c", text: "0, because sampling error averages away only at n = 1." },
      { id: "d", text: "sqrt(0.40 × 0.60 / 80)" },
    ],
    answerId: "a",
    explanation:
      "p̂ is unbiased for p: the sampling-distribution mean is p. The square-root expression is the standard deviation, not the mean.",
    objectiveCodes: ["UNC-3.H"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "phat-standard-deviation",
    lessonSlug: "sampling-distributions-of-proportions",
    questionType: "multiple_choice",
    prompt:
      "For an SRS of n = 80 and p = 0.40, what is the standard deviation of p̂, assuming the 10% condition holds?",
    choices: [
      { id: "a", text: "0.40 / 80" },
      { id: "b", text: "sqrt(0.40 × 0.60 / 80) ≈ 0.055" },
      { id: "c", text: "0.40 × 0.60" },
      { id: "d", text: "80 × 0.40" },
    ],
    answerId: "b",
    explanation:
      "SD(p̂) = sqrt(p(1 − p)/n) = sqrt(0.24/80) ≈ 0.055. np = 32 is a mean count, not this standard deviation.",
    objectiveCodes: ["UNC-3.I"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "bake-sale-clt-mean",
    lessonSlug: "sampling-distributions-of-means",
    questionType: "multiple_choice",
    prompt:
      "Individual cashier revenues are skewed right with σ = 6.4 dollars. For SRS samples of n = 16, what happens to the sampling distribution of x̄?",
    choices: [
      { id: "a", text: "Its mean is 6.4 and it stays as skewed as one cashier." },
      { id: "b", text: "Its mean is μ and its standard deviation is 6.4/√16 = 1.6; the CLT makes the shape more normal than one revenue." },
      { id: "c", text: "Its standard deviation is 6.4 × 16." },
      { id: "d", text: "x̄ cannot be used unless n is at least 1,200." },
    ],
    answerId: "b",
    explanation:
      "E(x̄) = μ and SD(x̄) = σ/√n = 1.6. The central limit theorem says sample means become more normal as n grows, even when individuals are skewed.",
    objectiveCodes: ["UNC-3.M"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "success-failure-small-n",
    lessonSlug: "sampling-distributions-of-proportions",
    questionType: "multiple_choice",
    prompt:
      "A club wants a normal model for p̂ with p = 0.40 and n = 12. Why is that model a poor choice?",
    choices: [
      { id: "a", text: "np = 4.8 is less than 10, so the success-failure condition fails." },
      { id: "b", text: "n = 12 is larger than 10, so the model is required." },
      { id: "c", text: "p̂ is never approximately normal for any n." },
      { id: "d", text: "The 10% condition is the only condition that matters." },
    ],
    answerId: "a",
    explanation:
      "Need np and n(1 − p) at least 10. Here np = 4.8, so a normal model for p̂ is not justified. Sample size alone is not the check.",
    objectiveCodes: ["UNC-3.I"],
    difficulty: "hard",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "saturday-build-ci-interpret",
    lessonSlug: "confidence-intervals-for-proportions",
    questionType: "multiple_choice",
    prompt:
      "A 95% z interval for the proportion of robotics members who want Saturday builds is 0.48 to 0.70. Which interpretation is correct?",
    choices: [
      { id: "a", text: "95% of members fall between 0.48 and 0.70." },
      { id: "b", text: "There is a 95% chance this already-computed interval contains p." },
      {
        id: "c",
        text: "We are 95% confident that the true member proportion is between 0.48 and 0.70.",
      },
      { id: "d", text: "p̂ is guaranteed to be 0.59 for every future sample of 80." },
    ],
    answerId: "c",
    explanation:
      "Confidence describes the method's long-run success rate and is phrased as confidence that p lies in the interval. It is not a percent of members and not a post-data probability for this one interval.",
    objectiveCodes: ["UNC-4.D"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "two-prop-interval-parameter",
    lessonSlug: "confidence-intervals-for-proportions",
    questionType: "multiple_choice",
    prompt:
      "Officers compute a two-sample z interval from 47/80 robotics yeses and 22/70 bake-sale yeses about Saturday work. What parameter does the interval estimate?",
    choices: [
      { id: "a", text: "A single p for both clubs combined." },
      { id: "b", text: "p_robotics − p_bake-sale, the difference of the two population proportions." },
      { id: "c", text: "The sample difference 47 − 22." },
      { id: "d", text: "The P-value of H0: p = 0.50." },
    ],
    answerId: "b",
    explanation:
      "A two-sample interval is for p1 − p2. Combining the clubs into one p, or quoting a count difference, answers a different question.",
    objectiveCodes: ["UNC-4.A"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "type-i-error-club-vote",
    lessonSlug: "significance-tests-for-proportions",
    questionType: "multiple_choice",
    prompt:
      "South Bay Chess tests H0: p = 0.50 that half of booth visitors try a rated game. What is a Type I error?",
    choices: [
      { id: "a", text: "Failing to reject H0 when the true p is 0.35." },
      { id: "b", text: "Rejecting H0 when p really is 0.50." },
      { id: "c", text: "Computing p̂ incorrectly." },
      { id: "d", text: "Using z* = 1.96 in a test." },
    ],
    answerId: "b",
    explanation:
      "Type I is rejecting a true null. Type II is failing to reject a false null. Arithmetic mistakes are not Type I errors.",
    objectiveCodes: ["DAT-3.B"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "z-test-uses-p0",
    lessonSlug: "significance-tests-for-proportions",
    questionType: "multiple_choice",
    prompt:
      "For H0: p = 0.50, n = 60, and p̂ = 0.35, which standard deviation belongs in the one-sample z statistic?",
    choices: [
      { id: "a", text: "sqrt(0.35 × 0.65 / 60), using p̂." },
      { id: "b", text: "sqrt(0.50 × 0.50 / 60), using the null value p0." },
      { id: "c", text: "0.50 / 60" },
      { id: "d", text: "s / √n, as if the data were hours." },
    ],
    answerId: "b",
    explanation:
      "The z test standardizes with p0 inside the square root. The interval uses p̂ in the standard error. Those two formulas are not interchangeable.",
    objectiveCodes: ["VAR-6.E"],
    difficulty: "hard",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "autonomous-t-interval-why",
    lessonSlug: "t-intervals-for-means",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Robotics has n = 22 times, x̄ = 19.8 seconds, and s = 3.4 seconds. Why is a t interval used instead of a z interval for μ?",
    choices: [
      { id: "a", text: "The population standard deviation σ is unknown, so s/√n and t* are required." },
      { id: "b", text: "n = 22 is even, so z is illegal." },
      { id: "c", text: "Times are categorical." },
      { id: "d", text: "t intervals are for proportions only." },
    ],
    answerId: "a",
    explanation:
      "z intervals for a mean need a known σ. Here only s is known, so the multiplier is t* with df = 21.",
    objectiveCodes: ["UNC-4.O"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "mean-df-one-sample-t",
    lessonSlug: "t-intervals-for-means",
    questionType: "multiple_choice",
    prompt:
      "A one-sample t interval uses 22 autonomous times. How many degrees of freedom does t* have?",
    choices: [
      { id: "a", text: "22" },
      { id: "b", text: "21" },
      { id: "c", text: "20" },
      { id: "d", text: "n − 2 = 20, as in regression." },
    ],
    answerId: "b",
    explanation:
      "One-sample t procedures use df = n − 1 = 21. Regression slope uses n − 2.",
    objectiveCodes: ["UNC-4.P"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "paired-vs-two-sample-times",
    lessonSlug: "t-tests-for-means-and-differences",
    questionType: "multiple_choice",
    prompt:
      "Each of 12 robots runs once with a playlist and once silent. Officers want to compare the two audio conditions. Which procedure matches the design?",
    choices: [
      { id: "a", text: "A two-sample t interval treating 24 runs as two independent samples of 12." },
      { id: "b", text: "A paired t procedure on the 12 playlist-minus-silent differences." },
      { id: "c", text: "A one-proportion z test." },
      { id: "d", text: "A chi-square goodness-of-fit test with 12 categories." },
    ],
    answerId: "b",
    explanation:
      "The same robot in both conditions is a matched pair. Subtract first, then use one-sample t on the differences. Ignoring the pairing treats dependent runs as independent.",
    objectiveCodes: ["VAR-7.E"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "t-statistic-coding-hours",
    lessonSlug: "t-tests-for-means-and-differences",
    questionType: "multiple_choice",
    prompt:
      "Harbor Coding Club tests H0: μ = 5.0 hours with n = 18, x̄ = 5.8, and s = 1.4. What is t?",
    choices: [
      { id: "a", text: "(5.8 − 5.0) / (1.4 / √18) ≈ 2.42" },
      { id: "b", text: "(5.8 − 5.0) / 1.4 ≈ 0.57" },
      { id: "c", text: "5.8 / 1.4 ≈ 4.14" },
      { id: "d", text: "(5.0 − 5.8) / √18 ≈ −0.19" },
    ],
    answerId: "a",
    explanation:
      "t = (x̄ − μ0) / (s/√n) = 0.8 / (1.4/√18) ≈ 2.42 with df = 17. Do not drop the √n, and do not reverse the subtraction if you want this signed value.",
    objectiveCodes: ["VAR-7.C"],
    difficulty: "hard",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "flavor-gof-hypotheses",
    lessonSlug: "chi-square-goodness-of-fit",
    questionType: "multiple_choice",
    prompt:
      "Mission Bake Sale claims trays are 30% chocolate, 20% oatmeal, 15% lemon, and 35% brownie. What is H0 for a goodness-of-fit test?",
    choices: [
      { id: "a", text: "The four observed counts are equal to 30, 20, 15, and 35." },
      { id: "b", text: "The four probabilities equal 0.30, 0.20, 0.15, and 0.35." },
      { id: "c", text: "Flavor is independent of shift." },
      { id: "d", text: "The mean number of trays is 0.25." },
    ],
    answerId: "b",
    explanation:
      "Goodness-of-fit H0 is a probability model for one categorical variable. Observed counts are data, not the hypothesis. Independence is a two-way-table hypothesis.",
    objectiveCodes: ["VAR-8.A"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "gof-expected-count",
    lessonSlug: "chi-square-goodness-of-fit",
    questionType: "multiple_choice",
    prompt:
      "Under the 15% lemon claim, 120 trays are sold. What lemon expected count goes into χ²?",
    choices: [
      { id: "a", text: "22, the observed lemon count." },
      { id: "b", text: "0.15" },
      { id: "c", text: "120 × 0.15 = 18" },
      { id: "d", text: "120 / 4 = 30, because every flavor must be equal." },
    ],
    answerId: "c",
    explanation:
      "Expected count = n × hypothesized probability = 18. The test uses expected counts from H0, not the observed 22 and not an equal-share 30 unless that was the claim.",
    objectiveCodes: ["VAR-8.B"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "homogeneity-expected-count",
    lessonSlug: "chi-square-homogeneity-and-independence",
    questionType: "multiple_choice",
    prompt:
      "Cast n = 50, lunch-column total = 40, table total = 110. What is the expected count for cast-and-lunch in a homogeneity test?",
    choices: [
      { id: "a", text: "18, because 18 cast members chose lunch." },
      { id: "b", text: "(50 × 40) / 110 ≈ 18.2" },
      { id: "c", text: "50 / 3" },
      { id: "d", text: "40 / 110" },
    ],
    answerId: "b",
    explanation:
      "Expected count = (row total × column total) / n. The observed 18 is O, not E. χ² compares those two numbers.",
    objectiveCodes: ["VAR-8.I"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "independence-vs-homogeneity",
    lessonSlug: "chi-square-homogeneity-and-independence",
    questionType: "multiple_choice",
    prompt:
      "East Bay Debate takes one SRS of 90 cafeteria students and records club membership and fair-location preference. Which test is this?",
    choices: [
      { id: "a", text: "Chi-square test of independence, because one sample is classified on two variables." },
      { id: "b", text: "Chi-square test of homogeneity, because two clubs were sampled separately." },
      { id: "c", text: "One-sample t test for a mean preference." },
      { id: "d", text: "Geometric test for the first student who says move." },
    ],
    answerId: "a",
    explanation:
      "One sample and two categorical labels is independence. Homogeneity would draw separate samples from groups you chose in advance, such as cast versus pit.",
    objectiveCodes: ["DAT-3.K"],
    difficulty: "hard",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "hours-slope-interval-meaning",
    lessonSlug: "regression-slope-confidence-intervals",
    questionType: "multiple_choice",
    prompt:
      "A 95% interval for the practice-hours slope is 2.1 to 3.7 points per hour. What does the interval estimate?",
    choices: [
      { id: "a", text: "The residual for the student with 4 hours." },
      { id: "b", text: "The population slope β, the change in mean score per extra hour." },
      { id: "c", text: "The correlation r." },
      { id: "d", text: "A prediction interval for one future student who practices 0 hours." },
    ],
    answerId: "b",
    explanation:
      "b ± t* SE_b estimates β. It is not a residual, not r, and not a prediction interval for a single new y.",
    objectiveCodes: ["DAT-3.M"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "slope-test-null",
    lessonSlug: "inference-for-slope-and-conditions",
    questionType: "multiple_choice",
    prompt:
      "Harbor Coding Club tests whether practice hours and mean presentation score have a linear relationship. What is the usual H0?",
    choices: [
      { id: "a", text: "H0: b = 2.9, using the sample slope as the null." },
      { id: "b", text: "H0: β = 0 (no linear relationship in the population)." },
      { id: "c", text: "H0: r = 0 for this exact sample of 12." },
      { id: "d", text: "H0: μ = 0 hours." },
    ],
    answerId: "b",
    explanation:
      "The parameter is the population slope β. The default no-association claim is β = 0. The sample slope b is the statistic, not the null value.",
    objectiveCodes: ["VAR-7.L"],
    difficulty: "easy",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "slope-conditions-residual",
    lessonSlug: "inference-for-slope-and-conditions",
    questionType: "multiple_choice",
    prompt:
      "The residual plot of hours versus score shows a clear curve. What should the club do about a t interval for the slope?",
    choices: [
      { id: "a", text: "Proceed, because a large r always saves a curved residual plot." },
      { id: "b", text: "Do not trust the linear-slope interval; the linear form condition fails." },
      { id: "c", text: "Switch to a one-proportion z interval." },
      { id: "d", text: "Delete the intercept and keep the same t*." },
    ],
    answerId: "b",
    explanation:
      "Inference for a straight-line slope needs a linear form. A curved residual plot is a condition failure, even when r looks large.",
    objectiveCodes: ["VAR-7.M"],
    difficulty: "medium",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_STATS_NAMESPACE,
    slug: "slope-df",
    lessonSlug: "regression-slope-confidence-intervals",
    questionType: "multiple_choice",
    prompt:
      "A least-squares line is fit to 12 Harbor Coding Club students. How many degrees of freedom does the t interval for the slope use?",
    choices: [
      { id: "a", text: "12" },
      { id: "b", text: "11" },
      { id: "c", text: "10" },
      { id: "d", text: "2" },
    ],
    answerId: "c",
    explanation:
      "Slope inference uses df = n − 2 = 10 because both intercept and slope are estimated. One-sample mean t uses n − 1.",
    objectiveCodes: ["VAR-7.K"],
    difficulty: "hard",
    sourceBasis: AP_STATS_SOURCE_BASIS,
    version: 1,
  },
];

export const AP_STATS_QUESTION_COUNT = questions.length;

export default questions;
