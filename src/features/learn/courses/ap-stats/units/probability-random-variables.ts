import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "probability-random-variables",
    slug: "probability-rules-and-independence",
    title: "Probability Rules and Independence",
    position: 7,
    estimatedMinutes: 22,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.F", "UNC-2.A", "VAR-4.A", "VAR-4.B", "VAR-4.C"],
    bodyPlain: [
      "A probability is a long-run relative frequency between 0 and 1. Mission Bake Sale still has 8 brownies and 12 cookies on one tray when a customer reaches in without looking. If each of the 20 items is equally likely, the probability of a brownie is 8/20 = 0.40. That 0.40 is a claim about many imaginary reaches, not a promise about the next hand. Simulation — repeating the reach with slips of paper — is a legitimate way to estimate a harder probability when listing outcomes is messy.",
      "The complement rule says P(not A) = 1 − P(A). The probability the customer does not get a brownie is 1 − 0.40 = 0.60. The addition rule for disjoint events says P(A or B) = P(A) + P(B) when A and B cannot happen together. Brownie and cookie on one reach are disjoint. If the officers later ask about \"brownie or item baked this morning,\" those events can overlap, so you must subtract the intersection: P(A or B) = P(A) + P(B) − P(A and B).",
      "Independent events do not change each other's probabilities: P(A and B) = P(A)P(B), or equivalently P(A | B) = P(A). Two reaches without replacement are not independent. After a brownie is taken, 7 brownies remain among 19 items, so the second-brownie probability is 7/19, not 8/20. Two reaches with replacement, or two different customers grabbing from restocked trays, can be treated as independent if the restock really restores the 8-and-12 mix.",
      "Conditional probability is P(A | B) = P(A and B) / P(B). Suppose 0.30 of customers take a brownie and, among brownie-takers, 0.25 also buy tea. Then P(brownie and tea) = 0.30 × 0.25 = 0.075 only if that 0.25 is already a conditional. A tree diagram keeps the order visible. Mutually exclusive is not the same as independent. Disjoint events with positive probability cannot be independent, because knowing one happened makes the other impossible.",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "probability-random-variables",
    slug: "random-variables-binomial-and-geometric",
    title: "Random Variables, Binomial, and Geometric",
    position: 8,
    estimatedMinutes: 22,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-4.D", "VAR-4.E", "VAR-5.A", "VAR-5.B", "UNC-3.A", "UNC-3.B"],
    bodyPlain: [
      "A random variable assigns a number to each outcome. Let X be the number of successful climbs in 8 independent Peninsula Robotics playoff matches, where the club's long-run climb rate is 0.35. X is discrete because it can be 0, 1, 2, ..., 8. A probability distribution lists each possible value and its probability; the probabilities add to 1. The expected value μ_X = Σ x P(x) is the long-run average of X, not the value you will see this Saturday.",
      "For a discrete random variable, the variance is Σ (x − μ_X)² P(x) and the standard deviation is the square root. Linear changes are friendly: if Y = a + bX, then μ_Y = a + b μ_X and σ_Y = |b| σ_X. Adding a constant shifts the center and leaves spread alone. Multiplying by 2.5 to convert a point score into a weighted score stretches both the mean and the standard deviation.",
      "A binomial setting needs a fixed number of trials n, two outcomes per trial (success or failure), a constant success probability p, and independent trials. The robotics climb count with n = 8 and p = 0.35 is binomial if one match does not change the next. Then P(X = k) = C(n, k) p^k (1 − p)^{n−k}. The mean is np = 2.8 climbs. The standard deviation is sqrt(np(1 − p)) ≈ 1.35 climbs. Do not use the binomial if the coach pulls the climber after the first two failures; n is no longer fixed in the same way, and independence is gone.",
      "A geometric setting counts the trial number of the first success. Let W be the first match in which the robot climbs, still with p = 0.35 and independent matches. Then P(W = k) = (1 − p)^{k−1} p for k = 1, 2, 3, .... The mean of a geometric random variable is 1/p, here about 2.86 matches. There is no fixed n. If the club stops after 8 matches whether or not a climb happened, you are no longer in a pure geometric story. Name the model before you compute.",
    ].join("\n\n"),
  },
];
