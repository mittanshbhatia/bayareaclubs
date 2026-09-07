/**
 * Advanced original AP Statistics items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "confound-not-lurking-label-only",
    lessonSlug: "experiments-random-assignment-and-scope",
    prompt:
      "A club assigns the first 20 arrivals to a new warm-up and the late arrivals to the old one, then compares sprint times. What is the core problem?",
    choices: [
      "The sample size is even, so inference is impossible.",
      "Arrival time is mixed with treatment, so the design is confounded.",
      "Sprint time is not a quantitative variable.",
      "Only blocking can ever be used in clubs.",
    ],
    answer: "b",
    explanation:
      "Early arrivals may already be different. Treatment and punctuality are tangled, so you cannot attribute a time change to the warm-up alone.",
    codes: ["3.5.A"],
  }),
  originalItem({
    slug: "ci-interpret-not-probability-on-mu",
    lessonSlug: "t-intervals-for-means",
    prompt:
      "A 95% t-interval for mean build time is (38, 46) minutes. Which sentence is correct?",
    choices: [
      "There is a 95% chance the true mean is between 38 and 46.",
      "The method that produced this interval captures the true mean in about 95% of repeated samples.",
      "95% of all Saturday builds last 38 to 46 minutes.",
      "The interval is a range for one student's time.",
    ],
    answer: "b",
    explanation:
      "Confidence is about the method in repeated sampling, not a posterior probability on this one interval, and not a claim about every individual build.",
    codes: ["6.2.A"],
  }),
  originalItem({
    slug: "power-vs-type-ii",
    lessonSlug: "significance-tests-for-proportions",
    prompt:
      "Officers keep α=0.05 and increase sample size for a one-proportion test. What happens?",
    choices: [
      "Type I error rate rises automatically.",
      "Power typically rises; Type II error typically falls.",
      "Power falls because n is in the denominator.",
      "α becomes 0.",
    ],
    answer: "b",
    explanation:
      "α is chosen. Larger n usually makes it easier to detect a real difference (higher power, lower β). It does not change the definition of α.",
    codes: ["6.7.A"],
  }),
  originalItem({
    slug: "chi-square-expected-too-small",
    lessonSlug: "chi-square-goodness-of-fit",
    prompt:
      "A flavor goodness-of-fit test has an expected count of 3.2 in one cell. What should the club do first?",
    choices: [
      "Ignore the expected-count condition because n is large.",
      "Combine categories or collect more data so expected counts are adequate.",
      "Switch to a t-test for means.",
      "Report p=0 because 3.2 is small.",
    ],
    answer: "b",
    explanation:
      "Chi-square approximations need large enough expected counts. Combining sensible categories or sampling more is the honest fix.",
    codes: ["8.3.A"],
  }),
  originalItem({
    slug: "slope-inference-residual",
    lessonSlug: "inference-for-slope-and-conditions",
    prompt:
      "A residual plot for hours vs. score fans out as hours grow. What does that do to a slope t-interval?",
    choices: [
      "Nothing; residuals never matter for slope inference.",
      "The equal-variance condition is in doubt, so the interval's coverage is untrustworthy.",
      "The slope must be zero.",
      "You should invert every residual.",
    ],
    answer: "b",
    explanation:
      "A megaphone residual plot violates roughly constant variance. Slope intervals and tests that assume it become unreliable.",
    codes: ["9.2.A"],
  }),
  originalItem({
    slug: "paired-not-two-sample",
    lessonSlug: "t-tests-for-means-and-differences",
    prompt:
      "Each member runs a lap before and after a new stretch. Which procedure matches the design?",
    choices: [
      "Two-sample t for independent means.",
      "Paired t on the differences.",
      "Chi-square test of independence.",
      "One-proportion z-test.",
    ],
    answer: "b",
    explanation:
      "The same person supplies both times. Analyze the differences. A two-sample t would ignore the pairing.",
    codes: ["7.6.A"],
  }),
] as const;
