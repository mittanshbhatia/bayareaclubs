/**
 * BayAreaClubs practice tools for AP Psychology.
 * Original copy. Not cloned third-party chrome. source_basis: ORIGINAL.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "ap-psych-practice",
    title: "Guided practice",
    description:
      "Short original items for trying one idea at a time: neurons, memory, conditioning, attribution, and health research language.",
    questionSlugs: [
      "neuron-signal-path",
      "encoding-vs-retrieval-yearbook",
      "bell-and-startle-rehearsal",
      "actor-observer-bus",
      "stress-appraisal-audition",
    ],
  },
  {
    kind: "quiz",
    slug: "ap-psych-quiz",
    title: "Mixed-unit quiz",
    description:
      "A timed-feeling mix across all five units. Answers stay educational; they are not a personal evaluation.",
    questionSlugs: [
      "heritability-misread",
      "confirmation-bias-budget",
      "variable-ratio-fundraiser",
      "cognitive-dissonance-pledge",
      "classification-is-not-diagnosis",
    ],
  },
  {
    kind: "review",
    slug: "ap-psych-review",
    title: "Spaced review",
    description:
      "Return to medium and hard items that connect systems: sleep and attention, working memory, social learning, traits, and treatment traditions.",
    questionSlugs: [
      "sleep-stage-attention-lab",
      "working-memory-rehearsal",
      "observational-vs-operant",
      "trait-vs-social-cognitive",
      "treatment-traditions-study",
    ],
  },
  {
    kind: "notes",
    slug: "ap-psych-notes",
    title: "Lesson notes",
    description:
      "Plain-text lesson bodies arranged by official unit so a club study group can annotate without leaving the course.",
    lessonSlugs: [
      "neurons-signals-and-nervous-systems",
      "brain-sleep-and-sensation",
      "perception-thinking-and-judgment",
      "memory-systems-and-intelligence",
      "development-across-the-lifespan",
      "conditioning-and-social-learning",
      "attribution-attitudes-and-social-situations",
      "personality-motivation-and-emotion",
      "health-psychology-and-well-being",
      "classification-and-treatment-traditions",
    ],
  },
  {
    kind: "readiness",
    slug: "ap-psych-readiness",
    title: "Readiness check",
    description:
      "Harder items that ask you to choose the best psychological account, not a slogan. Use this before a club review night.",
    questionSlugs: [
      "sleep-stage-attention-lab",
      "reliability-vs-validity-tryout",
      "observational-vs-operant",
      "trait-vs-social-cognitive",
      "treatment-traditions-study",
    ],
  },
];

export const AP_PSYCH_TOOL_KINDS = [
  "practice",
  "quiz",
  "review",
  "notes",
  "readiness",
] as const;

export default tools;
