import {
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";
import type { ApStatsLesson } from "@/features/learn/courses/ap-stats/lesson-types";

export const lessons: readonly ApStatsLesson[] = [
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "collecting-data",
    slug: "sampling-surveys-and-bias",
    title: "Sampling, Surveys, and Bias",
    position: 5,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["VAR-1.E", "DAT-2.A", "DAT-2.B", "DAT-2.C", "DAT-2.D"],
    bodyPlain: [
      "A population is the whole group you want to describe. A sample is the part you actually measure. East Bay Debate wanted to know what share of the 480 students who eat in the main cafeteria would support moving club fair tables away from the lunch line. Measuring all 480 is a census. Asking 40 students is a sample. A statistic (the sample proportion who say yes) estimates a parameter (the cafeteria-wide proportion).",
      "A simple random sample (SRS) gives every set of the same size an equal chance. The debate officers numbered the 480 cafeteria IDs and used a random generator to take 40 distinct numbers. A stratified sample first splits the population into strata you care about — ninth grade and everyone else, or students who already have a club and students who do not — then takes an SRS inside each stratum. A cluster sample takes whole groups (every student at five randomly chosen tables). Cluster sampling is cheaper; it is not the same as stratifying.",
      "Convenience and voluntary samples are easy and usually biased. Standing at the front of the pizza line and asking the first 40 people over-represents students who arrive early and like pizza. A QR poster that says \"Scan if you have a strong opinion about the club fair\" over-represents people with strong opinions. Bias is a systematic miss, not a single unlucky sample. Undercoverage happens when a group cannot enter the frame: students who eat off campus never appear on the cafeteria ID list.",
      "Nonresponse is different from a voluntary sample, but it still bends results. If 18 of the 40 selected IDs never answer the two-question form, and those 18 are mostly seniors who leave campus, the responding 22 are not the SRS you designed. Wording can bias an answer too. \"Do you agree that the noisy club fair should be moved so people can eat in peace?\" already argues. \"Should club fair tables stay by the lunch line or move to the quad?\" is closer to a neutral choice. A well-chosen sample still cannot fix a loaded question.",
    ].join("\n\n"),
  },
  {
    namespace: AP_STATS_NAMESPACE,
    unitSlug: "collecting-data",
    slug: "experiments-random-assignment-and-scope",
    title: "Experiments, Random Assignment, and Scope",
    position: 6,
    estimatedMinutes: 20,
    sourceBasis: AP_STATS_SOURCE_BASIS,
    objectiveCodes: ["DAT-2.E", "VAR-3.A", "VAR-3.B", "VAR-3.C", "VAR-3.D", "VAR-3.E"],
    bodyPlain: [
      "An observational study records what happens without assigning treatments. An experiment assigns treatments so you can compare responses. Peninsula Robotics wanted to know whether a spoken countdown playlist in the pit changes autonomous time. Watching teams that already use music is observational: teams that play music may also have more experienced drivers. To talk about cause, the club has to assign the playlist.",
      "The experimental units are the robot-and-driver pairs available that Saturday. The factor is pit audio. The treatments are countdown playlist and silent pit. The response is autonomous time in seconds. Random assignment uses chance to put pairs into treatments so lurking variables — battery age, who last aligned the camera — are not systematically stacked on one side. Replication means more than one pair per treatment. Control means the silent pit is a comparison, not \"no data.\"",
      "A completely randomized design puts every pair into a treatment by chance. A randomized block design first groups similar pairs — two-motor drivetrains versus four-motor drivetrains — then randomizes inside each block. Blocking reduces variability that you can see in advance. Confounding is the design failure you are trying to avoid: if all four-motor robots get the playlist and all two-motor robots stay silent, you cannot tell audio from drivetrain. Blinding is limited in a pit, but the timekeeper who records seconds should not know which treatment a pair received.",
      "Scope of inference has two doors. Random sampling from a population lets you generalize to that population. Random assignment of treatments lets you talk about cause for the units you actually used. Peninsula Robotics randomized 16 in-house pairs and did not sample every Bay Area team. A clear drop in mean time for the playlist group supports a causal claim about these 16 pairs. It does not, by itself, describe every robotics club in the region. Write both sentences when you report an experiment.",
    ].join("\n\n"),
  },
];
