import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "exploring-one-variable",
    slug: "variables-and-one-variable-graphs",
    title: "Variables and One-Variable Graphs",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.A", "VAR-1.B", "VAR-1.C", "UNC-1.A", "UNC-1.C", "UNC-1.G"],
    bodyPlain: [
      "A statistics question is a question that anticipates an answer based on data that vary. Peninsula Robotics does not ask \"What is the one true autonomous time?\" The useful question is \"How do Friday autonomous times vary across the 24 robots that ran the warehouse path?\" The individuals are the robot runs. The variables are the measurements or labels we record for each run.",
      "A categorical variable names a group. Alliance color (red or blue), drive coach (Asha, Luis, or Mei), and whether the climb succeeded (yes or no) are categorical. A quantitative variable takes numerical values that you can add, average, and spread. Autonomous time in seconds and cubes scored are quantitative. The number printed on a jersey is not automatically quantitative: if 17 and 42 are only labels, they do not measure an amount.",
      "Graph the type you have. For one categorical variable, a frequency table and a bar graph (or a pie chart when parts of a whole matter) show how often each category appears. On the last bake-sale Saturday, Mission Bake Sale recorded 34 chocolate chip trays, 21 oatmeal, 15 lemon, and 28 brownie. Those four bars have gaps between them because the categories are names, not a number line.",
      "For one quantitative variable, use a dotplot, stemplot, histogram, or boxplot. The 24 Peninsula Robotics Friday times we invented for this lesson, in seconds, were 16.8, 17.1, 17.4, 18.0, 18.2, 18.4, 18.6, 18.9, 19.0, 19.2, 19.4, 19.7, 20.0, 20.3, 20.5, 20.8, 21.0, 21.2, 21.4, 21.8, 22.1, 22.6, 23.4, and 26.9. A histogram of these times uses adjacent bins on a number line. A bar graph would be the wrong picture here because time is not a category name.",
      "When you read a quantitative graph, say the shape, the center, the variability, and any unusual features. This robotics list is unimodal and a little right-skewed: most runs sit near 19 to 21 seconds, and 26.9 sits apart on the high side. That one long run is a candidate outlier. The graph does not yet tell you why the robot stalled. It only shows that the distribution is not a single number.",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "exploring-one-variable",
    slug: "center-spread-and-the-normal-curve",
    title: "Center, Spread, and the Normal Curve",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["UNC-1.H", "UNC-1.I", "UNC-1.J", "UNC-1.K", "UNC-1.L", "UNC-1.M", "UNC-1.N"],
    bodyPlain: [
      "Numerical summaries compress a quantitative list so a club can compare weeks. For a roughly symmetric distribution, the mean and the standard deviation are reasonable. For a skewed list or a list with a stubborn outlier, the median and the interquartile range (IQR) stay more stable. On the robotics list from the previous lesson, the median is the average of the 12th and 13th ordered times, 19.7 and 20.0, so the median is 19.85 seconds. The mean is pulled a bit higher by the 26.9-second stall.",
      "Quartiles split the ordered list into fourths. Q1 is the median of the lower half; Q3 is the median of the upper half. IQR = Q3 − Q1. A common outlier fence is 1.5 × IQR below Q1 or above Q3. The 26.9-second run is the value to check against that fence. Report the five-number summary (minimum, Q1, median, Q3, maximum) when you draw a boxplot. The box shows the middle half of the data; the whiskers reach the last values inside the fences.",
      "A z-score locates one value inside a distribution: z = (x − mean) / s for a sample. If Mission Bake Sale's Saturday cookie-box counts are treated as roughly mound-shaped with mean 48 boxes and standard deviation 6 boxes, a day with 60 boxes has z = (60 − 48) / 6 = 2. That Saturday sat two standard deviations above the club's typical count. A z-score has no boxes-and-cookies unit; it is a count of standard deviations.",
      "The normal model is a smooth, symmetric, unimodal density used when a quantitative variable is well described by a mean μ and a standard deviation σ. The empirical rule says that about 68% of values fall within one σ of μ, about 95% within two σ, and about 99.7% within three σ. If Harbor Coding Club hackathon hours are modeled as N(5.0, 1.2), then about 95% of students fall between 2.6 and 7.4 hours. Do not force the normal model onto a sharply skewed bake-sale list just because the calculator can draw the curve.",
      "To find a proportion or a percentile from a normal model, standardize to z and use a normal table or a calculator's normalcdf. To find a value from a percentile, work backwards from z. Always state the model you used and keep the club context in the sentence. \"About 16% of robotics runs would be slower than 22.6 seconds if times were N(20.0, 2.0)\" is an interpretation. \"The area is 0.16\" is only a calculation.",
    ].join("\n\n"),
  },
];
