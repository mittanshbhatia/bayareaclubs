/**
 * Original BayAreaClubs multiple-choice items for AP Psychology.
 * Written from scratch. Not derived from College Board, Stellar Learning,
 * Unlimited Voices, or any other question bank. source_basis: ORIGINAL.
 * Educational overview only. Not clinical advice.
 */

import {
  AP_PSYCH_NAMESPACE,
  AP_PSYCH_SOURCE_BASIS,
} from "@/features/learn/courses/ap-psych/manifest";

export type ApPsychChoiceId = "a" | "b" | "c" | "d";

export type ApPsychChoice = {
  id: ApPsychChoiceId;
  text: string;
};

export type ApPsychDifficulty = "easy" | "medium" | "hard";

export type ApPsychQuestion = {
  namespace: typeof AP_PSYCH_NAMESPACE;
  slug: string;
  lessonSlug: string | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApPsychChoice, ApPsychChoice, ApPsychChoice, ApPsychChoice];
  answerId: ApPsychChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApPsychDifficulty;
  sourceBasis: typeof AP_PSYCH_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApPsychQuestion[] = [
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "neuron-signal-path",
    lessonSlug: "neurons-signals-and-nervous-systems",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Robotics diagrams a typical neuron on the whiteboard. In what order does a signal usually travel through that cell?",
    choices: [
      { id: "a", text: "Axon terminal, axon, dendrite, cell body" },
      { id: "b", text: "Dendrite, cell body, axon, axon terminal" },
      { id: "c", text: "Cell body, dendrite, synapse, nucleus" },
      { id: "d", text: "Myelin, hormone, receptor, bone" },
    ],
    answerId: "b",
    explanation:
      "Input typically arrives at dendrites, is integrated in the cell body, travels along the axon, and is released at terminals. The other orders mix outputs with inputs or leave the neuron entirely.",
    objectiveCodes: ["1.3"],
    difficulty: "easy",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "cns-vs-pns-split",
    lessonSlug: "neurons-signals-and-nervous-systems",
    questionType: "multiple_choice",
    prompt:
      "A study group lists the brain and spinal cord in one column and the nerves that reach the hands and organs in another. Which pair of labels is correct?",
    choices: [
      { id: "a", text: "Endocrine system versus digestive system" },
      { id: "b", text: "Sensory memory versus working memory" },
      { id: "c", text: "Central nervous system versus peripheral nervous system" },
      { id: "d", text: "Trait theory versus humanistic theory" },
    ],
    answerId: "c",
    explanation:
      "Brain and spinal cord are the central nervous system. Nerves linking that core to the body are peripheral. The other pairs belong to different units.",
    objectiveCodes: ["1.2"],
    difficulty: "easy",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "heritability-misread",
    lessonSlug: "neurons-signals-and-nervous-systems",
    questionType: "multiple_choice",
    prompt:
      "A poster says a trait is sixty percent heritable, so each member is sixty percent destined to have it. Why is that a misread of heritability?",
    choices: [
      {
        id: "a",
        text: "Heritability describes variation in a studied population, not a fixed percent of one person's fate.",
      },
      {
        id: "b",
        text: "Heritability numbers can only be used for eye color.",
      },
      {
        id: "c",
        text: "Any heritable trait must appear in every sibling.",
      },
      {
        id: "d",
        text: "Heritability means the environment has zero influence.",
      },
    ],
    answerId: "a",
    explanation:
      "A heritability estimate is about differences in a group under particular conditions. It does not assign a destiny percentage to an individual and it does not erase environment.",
    objectiveCodes: ["1.1"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "sleep-stage-attention-lab",
    lessonSlug: "brain-sleep-and-sensation",
    questionType: "multiple_choice",
    prompt:
      "East Bay Debate skips a night of sleep before a final. Members can still recite cards but miss fine distinctions they usually catch. Which biological account best fits that pattern?",
    choices: [
      {
        id: "a",
        text: "Sleep loss can impair attention and consolidation even when some facts remain available.",
      },
      {
        id: "b",
        text: "The peripheral nervous system stores debate cards during the day only.",
      },
      {
        id: "c",
        text: "Missing sleep permanently deletes the hippocampus.",
      },
      {
        id: "d",
        text: "Sensation thresholds rise so high that printed cards become invisible.",
      },
    ],
    answerId: "a",
    explanation:
      "Sleep supports attention and memory work. Loss can spare some rehearsal while hurting fine discrimination. The other options invent anatomy or sensation failures the scene does not show.",
    objectiveCodes: ["1.5", "1.4"],
    difficulty: "hard",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "encoding-vs-retrieval-yearbook",
    lessonSlug: "memory-systems-and-intelligence",
    questionType: "multiple_choice",
    prompt:
      "A yearbook editor rereads captions all week, then cannot say them without the page during layout. Which memory process is the weakest link for the live task?",
    choices: [
      { id: "a", text: "Transduction of light in the retina" },
      { id: "b", text: "Retrieval practice of the captions without the page" },
      { id: "c", text: "Release of melatonin at night" },
      { id: "d", text: "Formation of an attitude toward the cover color" },
    ],
    answerId: "b",
    explanation:
      "The editor encoded by rereading but did not practice retrieving the words as the job requires. Sensory transduction, hormones, and attitudes are the wrong processes.",
    objectiveCodes: ["2.4", "2.6"],
    difficulty: "easy",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "confirmation-bias-budget",
    lessonSlug: "perception-thinking-and-judgment",
    questionType: "multiple_choice",
    prompt:
      "Mission Yearbook wants an expensive cover. Officers only collect quotes that praise foil stamping and ignore cheaper options that meet the brief. Which thinking pattern is that?",
    choices: [
      { id: "a", text: "Classical conditioning of a startle to a bell" },
      { id: "b", text: "Confirmation bias: seeking evidence that fits a preferred story" },
      { id: "c", text: "Negative reinforcement of weeding" },
      { id: "d", text: "A valid intelligence test of spatial skill" },
    ],
    answerId: "b",
    explanation:
      "They searched only for support. That is confirmation bias. Conditioning, reinforcement, and testing are different ideas.",
    objectiveCodes: ["2.2"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "working-memory-rehearsal",
    lessonSlug: "memory-systems-and-intelligence",
    questionType: "multiple_choice",
    prompt:
      "A stage manager holds a five-item cue list in mind while calling lights, then loses the third item when a new instruction arrives. Which memory system was overloaded?",
    choices: [
      { id: "a", text: "Working memory, which keeps a small set active while you use it" },
      { id: "b", text: "Procedural memory for riding a bike" },
      { id: "c", text: "The endocrine system" },
      { id: "d", text: "Group polarization" },
    ],
    answerId: "a",
    explanation:
      "A short active list that collapses when a new item arrives is a working-memory limit. Skills, hormones, and group shift are not that system.",
    objectiveCodes: ["2.3", "2.5"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "reliability-vs-validity-tryout",
    lessonSlug: "memory-systems-and-intelligence",
    questionType: "multiple_choice",
    prompt:
      "A robotics tryout gives almost the same rank order on two Tuesdays, but those ranks do not predict later build quality. Which statement is most accurate?",
    choices: [
      {
        id: "a",
        text: "The tryout looks reliable yet lacks predictive validity for build quality.",
      },
      {
        id: "b",
        text: "Any consistent test is automatically a valid measure of every club skill.",
      },
      {
        id: "c",
        text: "Unreliable tests are the only tests that can be valid.",
      },
      {
        id: "d",
        text: "Predictive validity is a sleep stage, not a measurement idea.",
      },
    ],
    answerId: "a",
    explanation:
      "Consistency across days is reliability. Failing to predict the intended outcome is a validity problem. Reliability does not guarantee the right construct.",
    objectiveCodes: ["2.8"],
    difficulty: "hard",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "bell-and-startle-rehearsal",
    lessonSlug: "conditioning-and-social-learning",
    questionType: "multiple_choice",
    prompt:
      "San Jose Theater Club rings a bell just before every sudden blackout. After a week, the bell alone makes people flinch. Which learning idea is that?",
    choices: [
      { id: "a", text: "Classical conditioning: a cue gains power through pairing" },
      { id: "b", text: "A heritability coefficient for startle" },
      { id: "c", text: "Groupthink in a lighting meeting" },
      { id: "d", text: "An intelligence achievement gap" },
    ],
    answerId: "a",
    explanation:
      "The bell was paired with a startle-eliciting blackout until the bell itself elicited a related response. That is classical conditioning.",
    objectiveCodes: ["3.7"],
    difficulty: "easy",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "variable-ratio-fundraiser",
    lessonSlug: "conditioning-and-social-learning",
    questionType: "multiple_choice",
    prompt:
      "A bake-sale prize appears after an unpredictable number of ticket sales. Sellers keep selling longer than when every sale won a sticker. Which schedule is the club using?",
    choices: [
      { id: "a", text: "Continuous reinforcement only" },
      { id: "b", text: "A variable-ratio schedule of reinforcement" },
      { id: "c", text: "Extinction of a conditioned blink" },
      { id: "d", text: "A cross-sectional developmental design" },
    ],
    answerId: "b",
    explanation:
      "An unpredictable count of responses before a reward is variable ratio, which often maintains behavior. Continuous reward, extinction, and research design are different ideas.",
    objectiveCodes: ["3.8"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "conservation-task-garden",
    lessonSlug: "development-across-the-lifespan",
    questionType: "multiple_choice",
    prompt:
      "At a family day, a younger sibling says a tall thin pitcher has more water than a short wide one after a fair pour. Which developmental idea is the club illustrating?",
    choices: [
      {
        id: "a",
        text: "A conservation error: quantity looks changed when the container changes.",
      },
      {
        id: "b",
        text: "Obedience to an experimenter in a shock study",
      },
      {
        id: "c",
        text: "Negative punishment of watering",
      },
      {
        id: "d",
        text: "The validity of a college entrance exam",
      },
    ],
    answerId: "a",
    explanation:
      "Judging quantity by height after a transformation is a classic conservation miss. Obedience, operant terms, and admissions tests do not describe the pour.",
    objectiveCodes: ["3.4"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "observational-vs-operant",
    lessonSlug: "conditioning-and-social-learning",
    questionType: "multiple_choice",
    prompt:
      "A first-year copies a senior's unsafe table-saw shortcut after watching the senior get praised for speed. The first-year has not yet been rewarded. Which account is strongest?",
    choices: [
      {
        id: "a",
        text: "Observational learning with vicarious reinforcement, not a direct operant payoff to the first-year.",
      },
      {
        id: "b",
        text: "The first-year's genes independently invented the shortcut that afternoon.",
      },
      {
        id: "c",
        text: "A retrieval cue from a yearbook caption",
      },
      {
        id: "d",
        text: "Primary appraisal of a medical diagnosis",
      },
    ],
    answerId: "a",
    explanation:
      "The learner watched a rewarded model and copied without a personal consequence yet. That is social learning. Genes, captions, and clinical appraisal do not explain the copy.",
    objectiveCodes: ["3.9"],
    difficulty: "hard",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "actor-observer-bus",
    lessonSlug: "attribution-attitudes-and-social-situations",
    questionType: "multiple_choice",
    prompt:
      "A member snaps when the bus is late. Peers say the member is rude. The member says the morning was crowded and sleepless. Which attribution pattern is that?",
    choices: [
      {
        id: "a",
        text: "Actor-observer difference: others lean on traits, the actor leans on situation.",
      },
      {
        id: "b",
        text: "Variable-interval watering",
      },
      {
        id: "c",
        text: "A reliable spatial-intelligence score",
      },
      {
        id: "d",
        text: "Transduction of sound in the cochlea",
      },
    ],
    answerId: "a",
    explanation:
      "Observers used a disposition; the actor used context. That is the actor-observer pattern. Schedules, tests, and sensation are unrelated.",
    objectiveCodes: ["4.1"],
    difficulty: "easy",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "cognitive-dissonance-pledge",
    lessonSlug: "attribution-attitudes-and-social-situations",
    questionType: "multiple_choice",
    prompt:
      "An officer makes a public zero-waste pledge, then orders plastic trays and later insists the trays were the only responsible choice. Which process best describes the attitude shift?",
    choices: [
      { id: "a", text: "Cognitive dissonance reduced by changing the story after the act" },
      { id: "b", text: "An action potential jumping a myelin gap" },
      { id: "c", text: "Encoding specificity for a quiet practice room" },
      { id: "d", text: "A longitudinal cohort design" },
    ],
    answerId: "a",
    explanation:
      "A public commitment collided with the purchase, then the attitude moved to reduce conflict. Neural firing, memory cues, and research design are different topics.",
    objectiveCodes: ["4.2"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "conformity-brainstorm",
    lessonSlug: "attribution-attitudes-and-social-situations",
    questionType: "multiple_choice",
    prompt:
      "South Bay Coding Club starts idea time with the loudest voice. Later ideas cluster around that first pitch even when quieter members had other designs. Which social process is most likely?",
    choices: [
      {
        id: "a",
        text: "Normative or informational conformity around an early high-status suggestion",
      },
      {
        id: "b",
        text: "A conditioned taste aversion to whiteboards",
      },
      {
        id: "c",
        text: "Slow-wave sleep during the meeting",
      },
      {
        id: "d",
        text: "A validity coefficient for grip strength",
      },
    ],
    answerId: "a",
    explanation:
      "People aligned with an early, loud model. That is conformity pressure in a group. Aversion, sleep stages, and grip tests do not describe the clustering.",
    objectiveCodes: ["4.3"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "trait-vs-social-cognitive",
    lessonSlug: "personality-motivation-and-emotion",
    questionType: "multiple_choice",
    prompt:
      "A student is usually conscientious but misses a deadline in a chaotic production week. Which personality account highlights traits, thoughts, and the situation together?",
    choices: [
      {
        id: "a",
        text: "A social-cognitive view: traits interact with thinking and context.",
      },
      {
        id: "b",
        text: "A claim that personality is only blood type",
      },
      {
        id: "c",
        text: "A claim that one missed deadline proves zero conscientiousness",
      },
      {
        id: "d",
        text: "A claim that emotion does not involve arousal",
      },
    ],
    answerId: "a",
    explanation:
      "Social-cognitive theory treats personality as reciprocal among person, cognition, and situation. Blood type, all-or-none traits, and arousal denial are not that account.",
    objectiveCodes: ["4.5"],
    difficulty: "hard",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "stress-appraisal-audition",
    lessonSlug: "health-psychology-and-well-being",
    questionType: "multiple_choice",
    prompt:
      "Two singers face the same choir audition. One reads it as a threat to identity. The other reads it as a hard but workable challenge. Which health-psychology idea is that?",
    choices: [
      {
        id: "a",
        text: "Different cognitive appraisals of the same event",
      },
      {
        id: "b",
        text: "A peripheral nerve becoming a hormone",
      },
      {
        id: "c",
        text: "Groupthink requiring a unanimous vote",
      },
      {
        id: "d",
        text: "A test that is unreliable by definition",
      },
    ],
    answerId: "a",
    explanation:
      "Stress research treats appraisal as part of the process. The event is shared; the meaning differs. Anatomy mix-ups and group or testing terms do not capture that.",
    objectiveCodes: ["5.1"],
    difficulty: "easy",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "positive-psych-is-not-cheer",
    lessonSlug: "health-psychology-and-well-being",
    questionType: "multiple_choice",
    prompt:
      "A club poster says positive psychology means everyone must stay cheerful. What is the better educational description?",
    choices: [
      {
        id: "a",
        text: "It studies well-being constructs with methods; it is not an order to perform happiness.",
      },
      {
        id: "b",
        text: "It replaces all other psychology units.",
      },
      {
        id: "c",
        text: "It is a medical prescription written by a lesson file.",
      },
      {
        id: "d",
        text: "It proves that stress appraisal never happens.",
      },
    ],
    answerId: "a",
    explanation:
      "Positive psychology is an empirical topic about well-being, not a cheer mandate or a clinical order. It does not cancel the rest of the course.",
    objectiveCodes: ["5.2"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "classification-is-not-diagnosis",
    lessonSlug: "classification-and-treatment-traditions",
    questionType: "multiple_choice",
    prompt:
      "A classmate seems tired after finals. Another student assigns a disorder label from a unit outline. Why is that a misuse of this course?",
    choices: [
      {
        id: "a",
        text: "Classification here is an academic tool, not a license to diagnose a real person.",
      },
      {
        id: "b",
        text: "Tiredness after finals is impossible according to health psychology.",
      },
      {
        id: "c",
        text: "Only yearbook editors may use psychological words.",
      },
      {
        id: "d",
        text: "Unit outlines are heritability scores.",
      },
    ],
    answerId: "a",
    explanation:
      "Category names organize research. They are not a classroom diagnosis. Everyday tiredness after exams is common and is not a prompt to label a peer.",
    objectiveCodes: ["5.3", "5.4"],
    difficulty: "medium",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    slug: "treatment-traditions-study",
    lessonSlug: "classification-and-treatment-traditions",
    questionType: "multiple_choice",
    prompt:
      "A free-response prompt asks which tradition targets automatic thoughts and practiced new actions, as opposed to insight into early conflict. Which match is best for study purposes only?",
    choices: [
      {
        id: "a",
        text: "Cognitive-behavioral traditions, contrasted with psychodynamic insight work",
      },
      {
        id: "b",
        text: "A student-written prescription for a friend",
      },
      {
        id: "c",
        text: "A claim that all therapies are identical and need no evidence",
      },
      {
        id: "d",
        text: "An order to start medication from a practice quiz",
      },
    ],
    answerId: "a",
    explanation:
      "CBT families emphasize thoughts and practiced behavior. Psychodynamic families emphasize insight and early relationships. The item is a matching exercise, not advice to treat anyone.",
    objectiveCodes: ["5.5"],
    difficulty: "hard",
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    version: 1,
  },
];

export const AP_PSYCH_QUESTION_COUNT = questions.length;

export default questions;
