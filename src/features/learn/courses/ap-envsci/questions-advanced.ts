/**
 * Advanced original AP Environmental Science items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "trophic-ten-percent",
    lessonSlug: "wetland-partners-and-resource-limits",
    prompt:
      "A restored marsh food chain has 10,000 kcal at producers. About how much reaches secondary consumers if 10% transfers each step?",
    choices: ["10 kcal", "100 kcal", "1,000 kcal", "10,000 kcal"],
    answer: "b",
    explanation:
      "10% to primary consumers → 1,000 kcal. 10% of that to secondary consumers → 100 kcal. The rest is heat, waste, and unconsumed tissue.",
    codes: ["ERT-1.D"],
  }),
  originalItem({
    slug: "island-distance-richness",
    lessonSlug: "islands-tolerance-and-recovery",
    prompt:
      "Two islands have the same area. Island A is closer to the mainland. Island biogeography predicts:",
    choices: [
      "A usually supports more species because immigration is easier.",
      "A must have fewer species because isolation creates endemics.",
      "Area is the only variable that ever matters.",
      "Distance cannot affect richness.",
    ],
    answer: "a",
    explanation:
      "Closer islands receive more immigrants, so richness is typically higher at the same area. Isolation can raise endemism, which is a different claim.",
    codes: ["ERT-3.C"],
  }),
  originalItem({
    slug: "el-nino-not-switch",
    lessonSlug: "atmosphere-winds-and-pacific-swings",
    prompt:
      "A water-year plan treats El Niño as a guaranteed wet winter for the entire Bay Area. What is the better framing?",
    choices: [
      "El Niño is a Pacific SST pattern that shifts odds; local rain is not a switch.",
      "El Niño always means drought in California.",
      "La Niña and El Niño are the same pattern.",
      "SST patterns cannot reach California.",
    ],
    answer: "a",
    explanation:
      "ENSO rearranges storm tracks and probabilities. Clubs should pair the label with local snow and reservoir data, not a promise.",
    codes: ["ERT-4.F"],
  }),
  originalItem({
    slug: "commons-overuse",
    lessonSlug: "commons-clearcuts-and-irrigation",
    prompt:
      "An open irrigation canal has no allotment. Each grower takes extra in a dry year. The canal fails in August. This is closest to:",
    choices: [
      "A private good with perfect exclusion.",
      "A commons problem: shared subtractable water without working limits.",
      "A pure public good like national defense.",
      "Proof that irrigation cannot be managed.",
    ],
    answer: "b",
    explanation:
      "Water in the canal is rival. Without rules, each user has reason to take more. Managed commons and allotments are the usual response, not despair.",
    codes: ["EIN-2.A"],
  }),
  originalItem({
    slug: "inversion-traps-smoke",
    lessonSlug: "smog-inversions-and-wildfire-smoke",
    prompt:
      "A winter inversion sits over a valley campus. Why can wildfire smoke linger?",
    choices: [
      "Warm air aloft caps cooler air below, so vertical mixing is weak.",
      "Inversions always create wind.",
      "Smoke is heavier than all gases and falls as rain.",
      "Inversions destroy PM2.5.",
    ],
    answer: "a",
    explanation:
      "A lid of warmer air stops the usual rise of polluted air. The valley then holds smoke until the inversion breaks.",
    codes: ["STB-2.A"],
  }),
  originalItem({
    slug: "biomagnify-not-dilute",
    lessonSlug: "toxins-waste-and-treatment-choices",
    prompt:
      "A persistent chemical is rare in slough water but high in a large striped bass. The advisory board should talk about:",
    choices: [
      "Dilution only; big fish always have lower concentrations.",
      "Bioaccumulation and biomagnification along the food chain.",
      "The chemical cannot be in the fish if water tests are low.",
      "Only airborne deposition, never food webs.",
    ],
    answer: "b",
    explanation:
      "Persistent lipophilic compounds concentrate in tissues and up trophic steps. A water grab sample can look clean while a top predator is not.",
    codes: ["STB-3.F"],
  }),
] as const;
