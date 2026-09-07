/**
 * Advanced original AP Chemistry items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "limiting-not-excess",
    lessonSlug: "stoichiometry-and-titration",
    prompt:
      "2 H2 + O2 → 2 H2O. A club burns 8 mol H2 with 3 mol O2. Water produced is:",
    choices: ["3 mol", "6 mol", "8 mol", "11 mol"],
    answer: "b",
    explanation:
      "O2 is limiting: 3 mol O2 make 6 mol water. 8 mol H2 would need 4 mol O2. Leftover H2 is not extra product.",
    codes: ["1.4.A"],
  }),
  originalItem({
    slug: "keq-not-rate",
    lessonSlug: "k-q-and-equilibrium-calculations",
    prompt:
      "K = 50 for A ⇌ B at 298 K. A catalyst is added. At the new equilibrium:",
    choices: [
      "K becomes much larger.",
      "K is unchanged; the mixture reaches the same K faster.",
      "The reverse reaction stops.",
      "Q can never equal K.",
    ],
    answer: "b",
    explanation:
      "A catalyst speeds both directions. It does not change K. Equilibrium amounts still satisfy the same K.",
    codes: ["7.3.A"],
  }),
  originalItem({
    slug: "buffer-ratio",
    lessonSlug: "buffers-and-titrations",
    prompt:
      "A buffer has equal moles of weak acid and its salt. Adding a small amount of strong base:",
    choices: [
      "Sends pH to 14.",
      "Converts some HA to A−, so pH rises only a little.",
      "Destroys buffering forever.",
      "Leaves pH unchanged exactly.",
    ],
    answer: "b",
    explanation:
      "The base is consumed by HA. The HA/A− ratio shifts slightly, so pH moves a little, not to the strong-base extreme.",
    codes: ["8.8.A"],
  }),
  originalItem({
    slug: "cell-potential-not-mass",
    lessonSlug: "electrochemistry-and-cell-potential",
    prompt:
      "A galvanic cell has E° > 0. Doubling both electrode masses, with concentrations unchanged:",
    choices: [
      "Doubles E°.",
      "Leaves E° the same; E° is intensive.",
      "Reverses the cell.",
      "Makes E° zero.",
    ],
    answer: "b",
    explanation:
      "Standard cell potential does not scale with how much metal is present. Amounts can affect how long the cell lasts, not E°.",
    codes: ["9.7.A"],
  }),
  originalItem({
    slug: "entropy-gas-more",
    lessonSlug: "entropy-gibbs-and-favorability",
    prompt:
      "Which change most reliably increases entropy of the system?",
    choices: [
      "2 mol gas → 1 mol gas at the same T and P.",
      "A solid dissolving into many ions in water, producing more mobile particles.",
      "Cooling a gas at constant volume.",
      "Freezing a pure liquid at its melting point in a way that decreases disorder.",
    ],
    answer: "b",
    explanation:
      "More mobile particles usually raise S. Forming fewer gas moles or freezing lowers S. Dissolving an ionic solid typically increases S.",
    codes: ["9.3.A"],
  }),
  originalItem({
    slug: "rate-law-from-orders",
    lessonSlug: "rates-and-rate-laws",
    prompt:
      "Rate = k[A]^2[B]. Doubling A and B multiplies the rate by:",
    choices: ["2", "4", "8", "16"],
    answer: "c",
    explanation:
      "2^2 from A and 2 from B → factor of 8. k is unchanged at constant T.",
    codes: ["5.3.A"],
  }),
] as const;
