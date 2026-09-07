/**
 * Original BayAreaClubs lesson bodies for AP Psychology.
 * Plain text only. source_basis: ORIGINAL. Not clinical advice.
 */

import {
  AP_PSYCH_NAMESPACE,
  AP_PSYCH_SOURCE_BASIS,
  type ApPsychOfficialUnitSlug,
} from "@/features/learn/courses/ap-psych/manifest";

export type ApPsychLesson = {
  namespace: typeof AP_PSYCH_NAMESPACE;
  unitSlug: ApPsychOfficialUnitSlug;
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_PSYCH_SOURCE_BASIS;
  /** Official public CED topic identifiers only. */
  objectiveCodes: readonly string[];
  bodyPlain: string;
};

export const lessons: readonly ApPsychLesson[] = [
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "biological-bases",
    slug: "neurons-signals-and-nervous-systems",
    title: "Neurons, Signals, and Nervous Systems",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["1.1", "1.2", "1.3"],
    bodyPlain: [
      "Behavior does not appear out of nowhere. It depends on cells that collect, combine, and send electrochemical signals. A neuron is one of those cells. Dendrites take in input. The cell body integrates that input. If the combined signal crosses a threshold, an action potential travels down the axon. At the axon terminal, chemical messengers cross a tiny gap called a synapse and influence the next cell. The bits themselves are not thoughts. They are the hardware that makes thoughts and movements possible.",
      "Neurotransmitters are those chemical messengers. Different molecules tend to be discussed with different jobs: some are linked to muscle action and memory encoding, some to mood and sleep timing, some to alertness. A club example helps. Peninsula Robotics notices that after a late caffeine-heavy build night, hands are shakier on fine soldering. That is not a diagnosis. It is a reminder that chemical states change how readily neurons fire and how steadily muscles respond.",
      "The nervous system is organized into larger divisions. The central nervous system is the brain and spinal cord. The peripheral nervous system carries messages between that core and the rest of the body. Within the peripheral system, a somatic path handles voluntary movement and incoming sensory reports, while an autonomic path handles organs that usually run without a meeting agenda: heart rate, digestion, pupil size. The autonomic side itself splits into a mobilizing branch and a restoring branch. Both can be active in the same afternoon, which is why a debate final can leave someone wired and then suddenly tired.",
      "Heredity and environment work together rather than as a scoreboard. Genes provide recipes for proteins that build nervous tissue. Experience, nutrition, injury, and culture shape which circuits get used and strengthened. A twin-study number that says a trait is partly heritable does not say a person is doomed or gifted in a fixed way. It says that in a particular population, genetic differences explained some of the measured variation. Officers who plan a wellness week should treat that as a caution against slogans, not as a reason to sort members into biological teams.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "biological-bases",
    slug: "brain-sleep-and-sensation",
    title: "Brain Networks, Sleep, and Sensation",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["1.4", "1.5", "1.6"],
    bodyPlain: [
      "Brain regions are specialized, but they work as networks. The hindbrain helps with basic timing such as breathing and coordinated movement. Midbrain structures help route attention and sensory traffic. The forebrain includes the cortex, where different lobes handle vision, hearing and language, touch and body maps, and planning. Deeper structures such as the hippocampus, amygdala, and hypothalamus show up whenever memory, threat detection, or internal balance is on the table. Damage or disruption in one node can change a skill without erasing the whole person.",
      "Sleep is not empty time. Across a night, the brain cycles through lighter stages, deeper slow-wave sleep, and rapid-eye-movement sleep. Those stages support restoration, memory consolidation, and emotional processing in different mixes. East Bay Debate learned this the hard way when a team treated an all-nighter as a strategy. The next morning, members could still recite cards, but they missed opponent distinctions they would have caught after a normal night. Sleep debt is a biological constraint, not a character flaw.",
      "Sensation is the conversion of physical energy into neural signals. Photoreceptors, hair cells, skin receptors, and chemical receptors in the nose and tongue transduce different kinds of input. Those signals travel along dedicated pathways, often with a relay, before cortical areas begin to organize them. Thresholds matter. A stimulus that is too weak never enters the system. A change that is too small relative to the background may also go unnoticed. Yearbooks that print a poster in a dim hallway are fighting sensation limits, not just taste.",
      "The endocrine system partners with neural circuits by releasing hormones into the bloodstream. Effects are slower and longer than a single synapse, which is useful for growth, stress mobilization, and reproductive development. A student who understands both systems can explain why a sudden startle and a weeks-long exam season feel different even though both involve arousal. The course treats these as mechanisms to reason with, not as a kit for self-treatment.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "cognition",
    slug: "perception-thinking-and-judgment",
    title: "Perception, Thinking, and Judgment",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["2.1", "2.2"],
    bodyPlain: [
      "Perception is organized interpretation, not a camera feed. The same sensory data can be grouped, completed, or misread depending on expectation, context, and attention. Top-down knowledge fills gaps. Bottom-up features still constrain what is plausible. A lighting crew at San Jose Theater Club can dim a backdrop until the audience swears a flat canvas is a hallway. The canvas did not change. The perceptual system did extra work.",
      "Thinking uses concepts, prototypes, and problem-solving strategies. Algorithms are step-by-step procedures that should reach a correct answer if one exists. Heuristics are shortcuts that save time and sometimes miss. A chess club that always moves the same opening because it feels familiar is using a heuristic. That can be efficient in a lunch match and costly in a tournament against a prepared opponent.",
      "Judgment research catalogs systematic biases. Confirmation bias is the habit of hunting for evidence that fits a preferred story. Availability is overweighting whatever comes to mind easily. Anchoring is clinging to the first number in the room. Mission Yearbook once argued for an expensive cover because the first printer quote was high, then treated a slightly lower quote as a bargain. The second number was still over budget. The anchor did the work.",
      "Decision-making also depends on how a choice is framed. A fundraiser described as keeping eighty percent of proceeds feels different from one described as losing twenty percent, even when the math matches. Good psychological reasoning names the frame, lists the actual outcomes, and checks whether the group is solving the stated problem or defending an identity. That skill transfers from clubs to any claim that arrives with a chart and a slogan.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "cognition",
    slug: "memory-systems-and-intelligence",
    title: "Memory Systems and Intelligence",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["2.3", "2.4", "2.5", "2.6", "2.7", "2.8"],
    bodyPlain: [
      "Memory is not a single drawer. Sensory memory holds a brief trace. Working memory keeps a small amount of information active while you use it. Long-term memory can store episodes, facts, and skills for much longer, with different routes for each. Encoding is the work of getting information in. Storage is keeping a trace available. Retrieval is finding it again. A member who rereads a script ten times but never recites it without the page has practiced encoding poorly for the actual task.",
      "Encoding is stronger when it is elaborative, organized, and tied to meaning. Spacing practice over days beats one long cram. Retrieval practice, such as a closed-note recap after rehearsal, strengthens later access. Cues matter. The context present at learning can later help or hinder. Fremont Orchestra saw this when players practiced only in a quiet room and then stumbled in a buzzing lobby. The notes were not gone. The cues had changed.",
      "Forgetting has several honest explanations. Traces can decay. New learning can interfere with old, and old learning can block new. Retrieval can fail even when storage is intact. Memories can also be distorted by later information, confidence, or group retelling. That is why a club should not treat a vivid story as a transcript. Vividness is a feeling, not a certificate of accuracy.",
      "Intelligence, in this course, is a researched construct, not a moral ranking. Tests try to sample reasoning, knowledge, or processing under standard conditions. Reliability asks whether scores are consistent. Validity asks whether the test measures the intended construct and supports the intended use. A robotics tryout that correlates with later build quality has a kind of predictive validity for that club. The same score would be a poor measure of kindness or leadership. Achievement scores describe what someone has learned so far. They do not freeze a future.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "development-and-learning",
    slug: "development-across-the-lifespan",
    title: "Development Across the Lifespan",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"],
    bodyPlain: [
      "Developmental psychology asks how people change and stay the same from infancy through later adulthood. Researchers argue about continuity versus stages, about how much change is tied to age, and about how to separate cohort effects from true aging. A cross-sectional snapshot can mix those. A longitudinal design follows the same people and is slower and costlier. Club officers who survey only seniors and then claim teens have always felt a certain way are making a cohort claim they have not tested.",
      "Physical development includes growth, motor control, puberty, and later changes in strength and sensory acuity. Those changes alter what activities feel easy and what social roles peers expect. Cognitive development research describes how thinking becomes more abstract, more strategic, and sometimes more specialized. Young children often fail conservation tasks not because they are careless, but because their current representations of quantity are still forming. Adolescents can reason hypothetically and still show hot-context mistakes when peers are watching.",
      "Language development is a social and biological project. Infants move from shared attention and babbling to words, grammar, and pragmatic skill. Critical or sensitive periods describe windows when input has outsized effects, especially for first-language phonology. A bilingual household is not a problem to solve. It is a typical human setting. Theater clubs that coach projection are working with a late skill layered on that earlier system.",
      "Social-emotional development includes attachment patterns, identity work, and changing peer worlds. Psychologists distinguish sex assigned at birth, gender identity, gender expression, and sexual orientation as related but not identical constructs. The academic job is to use those terms precisely and to treat people with dignity. This course does not tell students who they are. It asks them to notice how families, peers, and institutions shape the stories available to a person across the lifespan.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "development-and-learning",
    slug: "conditioning-and-social-learning",
    title: "Conditioning and Social Learning",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["3.7", "3.8", "3.9"],
    bodyPlain: [
      "Classical conditioning pairs a neutral cue with a stimulus that already elicits a response until the cue starts to elicit a related response on its own. The unconditioned stimulus already works. The conditioned stimulus acquires power through pairing. Extinction is presenting the cue without the original partner until the learned response fades. Generalization spreads the response to similar cues. Discrimination narrows it. A theater bell that always precedes a sudden blackout can make people flinch at the bell alone. That is association, not superstition.",
      "Operant conditioning is about consequences. Reinforcement increases the future probability of a behavior. Punishment decreases it. Positive means adding a stimulus. Negative means removing one. A variable-ratio schedule, like an unpredictable prize after some unknown number of ticket sales, can keep a behavior going for a long time. Continuous reinforcement is better for teaching a brand-new action. Oakland Garden Club learned that thanking volunteers every week beat a single end-of-year trophy if the goal was regular weeding.",
      "Not all learning is a direct consequence to the learner. Observational learning lets people acquire actions by watching a model, especially when the model is similar, high status, or clearly rewarded. Vicarious reinforcement is seeing someone else get the consequence. Cognitive factors such as attention, retention, motor reproduction, and motivation sit between the model and the later act. A first-year who copies a senior's unsafe shortcut on a table saw is learning socially. The club's job is to put better models in view.",
      "Biological constraints matter. Some associations are easier because of evolutionary preparedness. Taste and nausea pair more readily than taste and a tone. Cognitive maps and latent learning show that organisms can acquire information without an immediate payoff. A complete account of learning therefore includes pairing, consequences, observation, and the nervous system that makes those processes possible. None of those tools is a license to manipulate classmates.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "social-and-personality",
    slug: "attribution-attitudes-and-social-situations",
    title: "Attribution, Attitudes, and Social Situations",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["4.1", "4.2", "4.3"],
    bodyPlain: [
      "Attribution is the story we tell about why someone acted. A dispositional attribution points to traits. A situational attribution points to context. The fundamental attribution error is overusing traits for other people, especially strangers. The actor-observer pattern is giving ourselves more situation credit than we give others. When a bus is late and a member snaps, a fair analysis asks about sleep, crowding, and the morning, not only about personality.",
      "Attitudes are evaluations that can include beliefs, feelings, and action tendencies. They predict behavior best when they are specific, strong, and formed through experience. Persuasion research contrasts routes that rely on careful argument with routes that rely on cues such as attractiveness or mere repetition. Cognitive dissonance is the discomfort of holding conflicting cognitions, often reduced by changing an attitude after a public act. A student who loudly pledges a zero-waste bake sale and then orders plastic trays may later insist the trays were unavoidable. The attitude moved to protect the self-story.",
      "Social situations exert pressure that is easy to underestimate. Conformity can be informational, when people use the group as data, or normative, when they want acceptance. Obedience research shows that legitimate-looking authority and stepwise requests can pull ordinary people toward harmful compliance in laboratory settings. Those studies are historical evidence about situations, not instructions for running a club. Bay Area officers should design defaults that make it easy to dissent, not easy to pile on.",
      "Group processes include social facilitation, social loafing, deindividuation, group polarization, and groupthink. A coding club that brainstorms only after everyone writes a private list will usually get a wider set of ideas than a club that starts with the loudest voice. Roles, norms, and perceived anonymity change behavior even when the people are the same. The lesson is not that groups are bad. It is that situations are part of the data.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "social-and-personality",
    slug: "personality-motivation-and-emotion",
    title: "Personality, Motivation, and Emotion",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["4.4", "4.5", "4.6", "4.7"],
    bodyPlain: [
      "Personality theories are maps, not destinies. Psychodynamic approaches emphasize unconscious conflict and early relationships. Humanistic approaches emphasize growth, acceptance, and the gap between the actual and ideal self. Both are historical traditions students should be able to compare. Neither is a method for diagnosing a classmate from a hallway comment.",
      "Trait approaches describe relatively stable patterns, often summarized with broad dimensions such as extraversion or conscientiousness. Social-cognitive approaches add reciprocal influence among traits, thoughts, and situations, including self-efficacy and observational learning. A person can be generally conscientious and still miss a deadline in a chaotic week. The useful question is which level of analysis fits the evidence you have.",
      "Motivation theories ask what starts, directs, and sustains behavior. Drive-reduction accounts emphasize restoring balance. Arousal accounts note that people sometimes seek stimulation. Incentive accounts highlight external pulls. Hierarchical models arrange needs from bodily stability through belonging and esteem toward growth. Intrinsic motivation, doing something because the activity itself matters, often produces more durable club work than points alone. Redwood City Chess Club kept more members when analysis nights were about beautiful games, not only about a leaderboard.",
      "Emotion includes physiological arousal, expressive behavior, and conscious experience. Theories disagree about the order of those pieces and about how much cognition labels the state. Basic-emotion views look for a small set of widely recognized expressions. Constructivist views treat emotion words as learned categories. Culture shapes display rules even when the underlying arousal is shared. Naming an emotion in class is analysis. It is not a demand that someone perform that emotion on cue.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "mental-and-physical-health",
    slug: "health-psychology-and-well-being",
    title: "Health Psychology and Well-Being",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["5.1", "5.2"],
    bodyPlain: [
      "Health psychology studies how behavior, cognition, and social context relate to physical health. Stress can be described as a process: an event, an appraisal of threat or challenge, and a response in the body and in behavior. Primary appraisal asks what is at stake. Secondary appraisal asks what resources are available. The same audition can be a threat to one student and a stretch goal to another. That difference is psychological, not a ranking of toughness.",
      "Chronic stress mobilization has costs. Sleep, immune function, attention, and mood can all shift when a person stays in high alert. Coping can be problem-focused, emotion-focused, or avoidant. Social support often buffers strain. None of those sentences is a treatment plan. They are research categories for reading a study or a news claim. A student who feels overwhelmed should talk with a trusted adult or school counselor, not treat a lesson as care.",
      "Positive psychology studies strengths, meaning, and well-being as empirical topics. It is not a command to be cheerful. Researchers distinguish pleasant affect, engagement, relationships, meaning, and accomplishment as measurable constructs. Interventions in studies are evaluated with methods, not with slogans. A club gratitude circle can be a nice ritual and still fail as evidence if nobody defined an outcome or a comparison.",
      "This unit stays educational on purpose. Personal health decisions belong with families, clinicians, and school supports. The academic skill is to read claims about stress, happiness, or resilience the way you would read any other study: who was sampled, what was measured, and what conclusion the design can actually support.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PSYCH_NAMESPACE,
    unitSlug: "mental-and-physical-health",
    slug: "classification-and-treatment-traditions",
    title: "Classification and Treatment Traditions",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_PSYCH_SOURCE_BASIS,
    objectiveCodes: ["5.3", "5.4", "5.5"],
    bodyPlain: [
      "Psychologists use classification systems as research and communication tools. A category name groups patterns of thinking, feeling, and behavior that have been studied together. Classification is not a moral verdict and it is not something this course applies to a named student. Reliability asks whether different clinicians or raters would place the same description in the same category. Validity asks whether the category helps explain, predict, or organize care in the professional settings where it is used.",
      "Introductory courses survey selected category families at a high level: anxiety-related patterns, depressive patterns, obsessive-compulsive patterns, trauma-related patterns, and others that appear in public outlines. The teaching point is how psychologists distinguish everyday variation from patterns that are intense, persistent, and impairing in context. A fictional vignette in a textbook is a reasoning exercise. It is not a diagnosis of anyone in the room.",
      "Treatment traditions are also academic families. Psychodynamic therapies emphasize insight into conflict and relationships. Humanistic therapies emphasize empathy and growth conditions. Cognitive and behavioral therapies emphasize changing thoughts and practicing new actions. Biomedical approaches, in professional care, include medications and other biological interventions prescribed by licensed clinicians. Group, family, and community approaches change the social unit of work. Students should be able to match a tradition to its typical target, not pick a therapy for a friend.",
      "Evidence standards matter. A randomized study, a comparison group, and a defined outcome are stronger than a testimonial. Even strong evidence applies to averages, not to a guaranteed personal result. If a classmate is in distress, the right move is to connect them with a counselor, a parent or guardian, or emergency help, not to role-play clinician. This lesson ends there on purpose.",
    ].join("\n\n"),
  },
];

export const content = {
  namespace: AP_PSYCH_NAMESPACE,
  sourceBasis: AP_PSYCH_SOURCE_BASIS,
  frameworkCode: "AP-PSYCH" as const,
  frameworkYear: 2024 as const,
  lessons,
};

export default content;
