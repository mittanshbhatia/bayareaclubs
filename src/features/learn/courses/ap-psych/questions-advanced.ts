/**
 * Advanced original AP Psychology items. source_basis: ORIGINAL.
 * Educational overview only. Not clinical advice.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "action-potential-all-or-none",
    lessonSlug: "neurons-signals-and-nervous-systems",
    prompt:
      "A club demo traces a motor neuron. The stimulus is just above threshold. Which claim is accurate?",
    choices: [
      "A larger stimulus makes a taller action potential.",
      "Once threshold is crossed, the spike has a typical size; intensity is coded more by frequency than by height.",
      "Dendrites fire the action potential first.",
      "The myelin sheath stores the neurotransmitter.",
    ],
    answer: "b",
    explanation:
      "An action potential is all-or-none. Stronger input usually means more spikes per second, not a taller single spike. The axon hillock/axon carries the spike; vesicles release transmitter at the terminal.",
    codes: ["1.2.A"],
  }),
  originalItem({
    slug: "sleep-stage-not-wish",
    lessonSlug: "brain-sleep-and-sensation",
    prompt:
      "A student says REM sleep exists so the brain can grant wishes. What is the better teaching point?",
    choices: [
      "REM is the only stage with slow waves.",
      "REM is a measurable stage with rapid eyes and a wake-like EEG; function claims are hypotheses, not wish fulfillment.",
      "Sleep has no stages.",
      "REM never includes dreaming reports.",
    ],
    answer: "b",
    explanation:
      "Stages are defined by physiology. Wish fulfillment is a historical interpretation, not the definition of REM.",
    codes: ["1.5.A"],
  }),
  originalItem({
    slug: "availability-not-base-rate",
    lessonSlug: "perception-thinking-and-judgment",
    prompt:
      "After one viral flood video, officers overestimate creek-flood risk for every campus. Which bias is that?",
    choices: [
      "Confirmation that vivid events are always more probable.",
      "Availability: easy-to-recall cases crowd out base rates.",
      "The representativeness of a fair coin.",
      "A failure of sensory transduction.",
    ],
    answer: "b",
    explanation:
      "Availability uses ease of recall. One vivid clip can outweigh quieter frequency data. That is a judgment bias, not a sensation failure.",
    codes: ["2.3.A"],
  }),
  originalItem({
    slug: "retrieval-not-erasure",
    lessonSlug: "memory-systems-and-intelligence",
    prompt:
      "A member cannot name last year's officer slate during a meeting but later recognizes every name on a list. What is the best account?",
    choices: [
      "The memories were erased, so recognition is impossible.",
      "Recall failed while recognition cues still worked, so storage may be intact.",
      "Working memory is the only memory system.",
      "Intelligence scores explain the missed names.",
    ],
    answer: "b",
    explanation:
      "Retrieval can fail when storage remains. Recognition supplies cues that free recall did not. Do not treat a missed name as proof of erasure.",
    codes: ["2.6.A"],
  }),
  originalItem({
    slug: "critical-period-not-destiny",
    lessonSlug: "development-across-the-lifespan",
    prompt:
      "A club reads that early language exposure matters. Which statement stays honest?",
    choices: [
      "No later learning is possible after age 3.",
      "Sensitive periods change how easily some skills are acquired; they are not a claim that later growth is impossible.",
      "Development is only biological.",
      "Attachment style is a personality diagnosis.",
    ],
    answer: "b",
    explanation:
      "Sensitive or critical periods describe timing effects, not a ban on later learning. Development is biological and social.",
    codes: ["3.2.A"],
  }),
  originalItem({
    slug: "reinforcement-not-bribe-label",
    lessonSlug: "conditioning-and-social-learning",
    prompt:
      "A robotics coach thanks a student every time a safety check is completed, and the checks become more reliable. In operant terms, the thanks is:",
    choices: [
      "Positive reinforcement if it increases the check.",
      "Punishment because praise is social.",
      "Classical pairing of two reflexes only.",
      "Extinction of the safety check.",
    ],
    answer: "a",
    explanation:
      "If a consequence makes the behavior more likely, it is reinforcement. Adding a thanks is positive reinforcement. Labels like bribe are not the operant definition.",
    codes: ["3.5.A"],
  }),
  originalItem({
    slug: "fundamental-attribution-club",
    lessonSlug: "attribution-attitudes-and-social-situations",
    prompt:
      "A late volunteer is called lazy. Later the group learns the bus line stopped. What bias did the first judgment show?",
    choices: [
      "The fundamental attribution error: over-using the person, under-using the situation.",
      "Groupthink, because no one spoke.",
      "Deindividuation from a costume.",
      "A correct trait inference because lateness is always disposition.",
    ],
    answer: "a",
    explanation:
      "The first story blamed character. The bus is a situational cause. That pattern is the fundamental attribution error.",
    codes: ["4.2.A"],
  }),
  originalItem({
    slug: "vignette-is-not-diagnosis",
    lessonSlug: "classification-and-treatment-traditions",
    prompt:
      "A textbook vignette describes intense, persistent worry that impairs classwork. What should the club do with that story?",
    choices: [
      "Diagnose the named student in the room.",
      "Use it as a reasoning exercise about intensity, duration, and impairment — not as a diagnosis of anyone present.",
      "Assume every worried student has the same pattern.",
      "Treat the vignette as a treatment plan.",
    ],
    answer: "b",
    explanation:
      "Course vignettes teach criteria. They are not licenses to diagnose classmates or to prescribe care.",
    codes: ["5.1.A"],
  }),
] as const;
