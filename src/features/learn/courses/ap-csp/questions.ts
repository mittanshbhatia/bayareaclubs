/**
 * Original BayAreaClubs multiple-choice items for AP Computer Science Principles.
 * Written from scratch. Not derived from College Board, Unlimited Voices,
 * Stellar Learning, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_CSP_NAMESPACE,
  AP_CSP_SOURCE_BASIS,
} from "@/features/learn/courses/ap-csp/manifest";
import type { ApCspLessonSlug } from "@/features/learn/courses/ap-csp/content";

export type ApCspChoiceId = "a" | "b" | "c" | "d";

export type ApCspChoice = {
  id: ApCspChoiceId;
  text: string;
};

export type ApCspDifficulty = "easy" | "medium" | "hard";

export type ApCspQuestion = {
  namespace: typeof AP_CSP_NAMESPACE;
  slug: string;
  lessonSlug: ApCspLessonSlug | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApCspChoice, ApCspChoice, ApCspChoice, ApCspChoice];
  answerId: ApCspChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApCspDifficulty;
  sourceBasis: typeof AP_CSP_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApCspQuestion[] = [
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "soldering-iron-purpose",
    lessonSlug: "purpose-users-and-iteration",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Robotics writes this purpose statement: \"Officers should know which member currently has the soldering iron before the next lab.\" Which change best serves that purpose?",
    choices: [
      {
        id: "a",
        text: "Add a leaderboard of members who attended the most labs this semester.",
      },
      {
        id: "b",
        text: "Show a live list of who checked the iron out and who returned it.",
      },
      {
        id: "c",
        text: "Replace the club logo with an animated spark on the home screen.",
      },
      {
        id: "d",
        text: "Let members vote on their favorite microcontroller brand.",
      },
    ],
    answerId: "b",
    explanation:
      "The stated purpose is tracking who has the iron right now. A checkout list answers that question. Attendance ranks, decoration, and polls do not.",
    objectiveCodes: ["CRD-2.A"],
    difficulty: "easy",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "iteration-after-hallway-test",
    lessonSlug: "purpose-users-and-iteration",
    questionType: "multiple_choice",
    prompt:
      "Six testers cannot find the control that marks the soldering iron returned. The team spends the next week adding pastel color themes. Why is this a weak iteration?",
    choices: [
      { id: "a", text: "Color themes are never allowed in school software." },
      {
        id: "b",
        text: "Iteration requires deleting the entire program after every test.",
      },
      {
        id: "c",
        text: "The next change should reduce the confusion testers reported, not add unrelated decoration.",
      },
      {
        id: "d",
        text: "Testers are not users, so their notes should be ignored.",
      },
    ],
    answerId: "c",
    explanation:
      "Iteration means revise based on observed failures. Testers stalled on returning the iron, so that flow should change first. Themes do not fix the purpose.",
    objectiveCodes: ["CRD-2.B"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "timezone-assumption-docs",
    lessonSlug: "purpose-users-and-iteration",
    questionType: "multiple_choice",
    prompt:
      "Two partners each write a procedure named nextMeetingDate. One assumes Pacific Time. The other assumes UTC. They never record the rule. Which collaboration practice would most reduce the resulting bug?",
    choices: [
      { id: "a", text: "Delete comments so the merged file stays short." },
      {
        id: "b",
        text: "Write the shared time-zone rule in the procedure documentation and agree on it before merging.",
      },
      {
        id: "c",
        text: "Each partner keep a private copy and never combine the work.",
      },
      { id: "d", text: "Store every date as a Roman numeral string." },
    ],
    answerId: "b",
    explanation:
      "Hidden assumptions collide when work is combined. Documenting the shared rule makes the agreement visible and testable. Silence, isolation, or odd encodings do not.",
    objectiveCodes: ["CRD-1.A", "CRD-1.C"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "same-bits-three-meanings",
    lessonSlug: "bits-patterns-and-meaning",
    questionType: "multiple_choice",
    prompt:
      "The bit pattern 01000001 is sent to three programs. One treats it as an integer, one as a text character, and one as a color channel. Why can the three programs disagree about what they received?",
    choices: [
      { id: "a", text: "Bits spontaneously change value every time they are read." },
      {
        id: "b",
        text: "Meaning comes from the chosen mapping, not from the bits alone.",
      },
      {
        id: "c",
        text: "Only color programs are allowed to read eight-bit patterns.",
      },
      { id: "d", text: "Integers cannot be stored using binary digits." },
    ],
    answerId: "b",
    explanation:
      "A bit pattern has no built-in meaning. Each program applies its own mapping, so the same bits can be a number, a character, or a color sample.",
    objectiveCodes: ["DAT-1.A"],
    difficulty: "easy",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "eight-bit-temperature-range",
    lessonSlug: "bits-patterns-and-meaning",
    questionType: "multiple_choice",
    prompt:
      "A weather club stores each temperature as an 8-bit unsigned integer with no fractional part (values 0 through 255). Which measurement cannot be stored accurately?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "72" },
      { id: "c", text: "72.6" },
      { id: "d", text: "200" },
    ],
    answerId: "c",
    explanation:
      "The encoding only stores whole numbers in 0–255. 72.6 has a fractional part, so it cannot be recorded without rounding or a different representation.",
    objectiveCodes: ["DAT-1.B"],
    difficulty: "easy",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "locker-code-iteration",
    lessonSlug: "purpose-users-and-iteration",
    questionType: "multiple_choice",
    prompt:
      "A locker program asks for a code and keeps prompting until the typed code matches the stored value. Which control structure is essential to that behavior?",
    choices: [
      {
        id: "a",
        text: "Iteration that continues while the guess is wrong.",
      },
      {
        id: "b",
        text: "A single sequence of print statements with no decisions.",
      },
      {
        id: "c",
        text: "A list that stores every student enrolled in the district.",
      },
      {
        id: "d",
        text: "A network protocol that assigns addresses to devices.",
      },
    ],
    answerId: "a",
    explanation:
      "Repeating a prompt until a condition is met is iteration. A one-pass sequence cannot retry, and lists or addressing are unrelated to this control flow.",
    objectiveCodes: ["AAP-2.H"],
    difficulty: "easy",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "snack-inventory-procedure",
    lessonSlug: "purpose-users-and-iteration",
    questionType: "multiple_choice",
    prompt:
      "A snack treasurer copies the same five lines—find an item, subtract one, record the time—in four different screens. Why extract those steps into one procedure?",
    choices: [
      {
        id: "a",
        text: "Procedures let a program run without any computer.",
      },
      {
        id: "b",
        text: "One named abstraction can be tested once and reused, so a fix applies in every screen.",
      },
      {
        id: "c",
        text: "Programming languages require duplicated code in every file.",
      },
      {
        id: "d",
        text: "Procedures remove the need to store any data.",
      },
    ],
    answerId: "b",
    explanation:
      "A procedure is a reusable abstraction. One correct implementation replaces four copies, so later fixes and tests stay in one place.",
    objectiveCodes: ["AAP-3.A", "AAP-3.B"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "backup-path-livestream",
    lessonSlug: null,
    questionType: "multiple_choice",
    prompt:
      "During a robotics livestream, the library wifi fails, but a second wired path still reaches the same scoring server and the stream continues. Which idea does this illustrate?",
    choices: [
      { id: "a", text: "Lossy compression of a still image." },
      {
        id: "b",
        text: "A fault-tolerant setup that can keep working when one path fails.",
      },
      { id: "c", text: "A binary search through a sorted roster." },
      { id: "d", text: "Pair programming as a creative-development method." },
    ],
    answerId: "b",
    explanation:
      "Two independent paths to the same server mean one failure does not stop the system. That is fault tolerance, not compression, search, or pairing.",
    objectiveCodes: ["CSN-2.A"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "hall-pass-public-screen",
    lessonSlug: null,
    questionType: "multiple_choice",
    prompt:
      "A hall-pass kiosk posts every student's name, destination, and departure time on a public hallway screen. Which impact should the design team weigh first?",
    choices: [
      { id: "a", text: "Whether the on-screen font looks decorative." },
      {
        id: "b",
        text: "The privacy harm of broadcasting student movement to anyone walking by.",
      },
      { id: "c", text: "Whether bits are able to represent letters at all." },
      { id: "d", text: "Whether the kiosk program uses a loop somewhere." },
    ],
    answerId: "b",
    explanation:
      "A computing innovation can help staff and still harm students if it exposes movement data in a public place. Privacy impact is the relevant trade-off here.",
    objectiveCodes: ["IOC-1.A", "IOC-2.A"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "yearbook-poster-file-size",
    lessonSlug: "bits-patterns-and-meaning",
    questionType: "multiple_choice",
    prompt:
      "The yearbook club emails a poster photo. The tiny-file version looks blotchy on the printed poster. The larger file looks like the camera original. What trade-off is the team seeing?",
    choices: [
      {
        id: "a",
        text: "Lossy compression can shrink a file by discarding some visual detail.",
      },
      {
        id: "b",
        text: "Lossless compression always makes photographs unreadable.",
      },
      { id: "c", text: "Bits cannot represent images, only whole numbers." },
      {
        id: "d",
        text: "The only way to store color is to rewrite the program after every save.",
      },
    ],
    answerId: "a",
    explanation:
      "A much smaller image file that looks worse is a typical lossy trade-off: size drops because some detail is thrown away. Lossless methods keep the original data.",
    objectiveCodes: ["DAT-1.D"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "pair-roles-during-merge",
    lessonSlug: "collaboration-and-shared-drafts",
    questionType: "multiple_choice",
    prompt:
      "Two officers pair on a debate-timer screen. One types while the other checks each step against the written purpose. They swap roles after twenty minutes. What is the main benefit of this practice?",
    choices: [
      {
        id: "a",
        text: "It removes the need to test the program with any users.",
      },
      {
        id: "b",
        text: "A second person can catch mismatches with the purpose before the draft is merged.",
      },
      {
        id: "c",
        text: "Pairing guarantees that the program will never contain an error.",
      },
      {
        id: "d",
        text: "Only one person is allowed to read comments in a shared file.",
      },
    ],
    answerId: "b",
    explanation:
      "Pair work puts a second set of eyes on the draft against the purpose. It does not replace user tests or make errors impossible, and comments stay shared.",
    objectiveCodes: ["CRD-1.B"],
    difficulty: "easy",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "courtyard-sensor-bias",
    lessonSlug: "datasets-bias-and-charts",
    questionType: "multiple_choice",
    prompt:
      "A San Jose climate club records quad temperatures only on sunny club afternoons with a sensor taped to a black bench. Officers later claim the dataset shows typical school-year weather. What is the strongest objection?",
    choices: [
      {
        id: "a",
        text: "Bits cannot store numbers larger than ten.",
      },
      {
        id: "b",
        text: "The sample is systematically tilted: sunny days and a hot bench, not the full year.",
      },
      {
        id: "c",
        text: "Temperature must always be stored as text characters.",
      },
      {
        id: "d",
        text: "Charts are forbidden whenever a sensor is used.",
      },
    ],
    answerId: "b",
    explanation:
      "Collection choices tilt the dataset. Skipping rain and placing the sensor on a hot bench means the numbers do not represent typical weather.",
    objectiveCodes: ["DAT-2.D"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "expired-card-selection",
    lessonSlug: "sequences-selection-and-loops",
    questionType: "multiple_choice",
    prompt:
      "A club nametag program should print a tag only when the membership card is not expired. Which control structure makes that decision?",
    choices: [
      {
        id: "a",
        text: "Selection that chooses the print path or the renewal path.",
      },
      {
        id: "b",
        text: "A packet protocol that splits the nametag into hops.",
      },
      {
        id: "c",
        text: "Lossy compression of the member photo.",
      },
      {
        id: "d",
        text: "A list that stores every Wi-Fi password on campus.",
      },
    ],
    answerId: "a",
    explanation:
      "Choosing between printing and asking for renewal is selection. Packets, compression, and password lists do not make that program decision.",
    objectiveCodes: ["AAP-2.E"],
    difficulty: "easy",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "compound-boolean-tool-checkout",
    lessonSlug: "sequences-selection-and-loops",
    questionType: "multiple_choice",
    prompt:
      "Robotics checkout is allowed only when the member is on the roster and the iron is marked in. Maya is on the roster. The iron is marked out. What should the program do?",
    choices: [
      {
        id: "a",
        text: "Allow checkout because one of the two conditions is true.",
      },
      {
        id: "b",
        text: "Refuse checkout because both required conditions are not true.",
      },
      {
        id: "c",
        text: "Allow checkout because roster membership always overrides tool status.",
      },
      {
        id: "d",
        text: "Ignore both conditions and print a random member name.",
      },
    ],
    answerId: "b",
    explanation:
      "An and combination requires both parts to be true. The iron is out, so checkout should be refused even though Maya is on the roster.",
    objectiveCodes: ["AAP-2.E"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "procedure-parameter-stock",
    lessonSlug: "lists-procedures-and-simulations",
    questionType: "multiple_choice",
    prompt:
      "The snack stand needs to subtract different amounts for chips, water, and pretzels from one shared list. Why pass the item name and amount as parameters instead of writing three nearly identical procedures?",
    choices: [
      {
        id: "a",
        text: "Parameters let one procedure handle many calls without copying the same steps.",
      },
      {
        id: "b",
        text: "Parameters delete the list after every sale.",
      },
      {
        id: "c",
        text: "Languages forbid more than one procedure in a club program.",
      },
      {
        id: "d",
        text: "Parameters convert the snack list into a network packet.",
      },
    ],
    answerId: "a",
    explanation:
      "Parameters are inputs for one call. The same stock procedure can subtract one water or three pretzels without three pasted copies.",
    objectiveCodes: ["AAP-3.A", "AAP-3.C"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "dance-line-simulation-assumption",
    lessonSlug: "lists-procedures-and-simulations",
    questionType: "multiple_choice",
    prompt:
      "A dance committee simulates ticket lines by serving one person every thirty seconds and ignoring friends who cut ahead. The model says two cashiers are enough. Which statement is most accurate?",
    choices: [
      {
        id: "a",
        text: "The simulation proves the real dance will never have a wait.",
      },
      {
        id: "b",
        text: "The omitted cutting behavior is an assumption that could change the conclusion.",
      },
      {
        id: "c",
        text: "Simulations are not allowed to leave anything out.",
      },
      {
        id: "d",
        text: "Two cashiers are required by every programming language.",
      },
    ],
    answerId: "b",
    explanation:
      "A model is only as useful as its assumptions. Ignoring line-cutting may make two cashiers look sufficient when the real night is slower.",
    objectiveCodes: ["AAP-3.F"],
    difficulty: "hard",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "interview-split-into-packets",
    lessonSlug: "packets-paths-and-redundancy",
    questionType: "multiple_choice",
    prompt:
      "A journalism club uploads a long interview from the library. Why does the sending computer split the file into packets?",
    choices: [
      {
        id: "a",
        text: "So addressed pieces can travel separately and only missing pieces need to be resent.",
      },
      {
        id: "b",
        text: "So the interview is automatically converted into a locker combination.",
      },
      {
        id: "c",
        text: "So bits lose all meaning until a human retypes the file.",
      },
      {
        id: "d",
        text: "So the school can store the interview as a single unbreakable block only.",
      },
    ],
    answerId: "a",
    explanation:
      "Packets are addressed pieces. They can take different routes, and a drop only requires resending the missing piece, not the whole interview.",
    objectiveCodes: ["CSN-1.C"],
    difficulty: "easy",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "out-of-order-packets-livestream",
    lessonSlug: "packets-paths-and-redundancy",
    questionType: "multiple_choice",
    prompt:
      "Packets from a robotics livestream arrive at the scoreboard out of order. Why can the stream still make sense a moment later?",
    choices: [
      {
        id: "a",
        text: "Routers secretly rewrite the match score before forwarding.",
      },
      {
        id: "b",
        text: "Addressing and sequencing information lets the receiver reassemble or request missing pieces.",
      },
      {
        id: "c",
        text: "Livestreams never use packets, only paper printouts.",
      },
      {
        id: "d",
        text: "Out-of-order arrival means the file was never split.",
      },
    ],
    answerId: "b",
    explanation:
      "Packets carry addressing and order clues. The receiver can reassemble or request what is missing, which is why a brief glitch can recover.",
    objectiveCodes: ["CSN-1.C"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "bandwidth-vs-latency-upload",
    lessonSlug: "protocols-bandwidth-and-open-internet",
    questionType: "multiple_choice",
    prompt:
      "Officers can send a short RSVP form from a phone hotspot, but a raw concert video stalls. Which explanation is most accurate?",
    choices: [
      {
        id: "a",
        text: "Bandwidth is capacity over time; a small form fits a weak path that cannot carry huge media quickly.",
      },
      {
        id: "b",
        text: "Forms are not allowed to travel on the internet.",
      },
      {
        id: "c",
        text: "Video files do not contain bits, so they cannot be uploaded.",
      },
      {
        id: "d",
        text: "Latency is the only number that matters, and it is always zero on phones.",
      },
    ],
    answerId: "a",
    explanation:
      "Bandwidth is how much can move per second. A tiny form needs little capacity; raw video needs much more. Latency is wait time, not the same idea.",
    objectiveCodes: ["CSN-1.E"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "parallel-encode-shared-drive",
    lessonSlug: "protocols-bandwidth-and-open-internet",
    questionType: "multiple_choice",
    prompt:
      "Four lab computers each encode five interview clips, but all results must be saved through one shared drive that accepts a single file at a time. Why might wall-clock time barely improve?",
    choices: [
      {
        id: "a",
        text: "Parallel split work cannot help if the join step is a new bottleneck.",
      },
      {
        id: "b",
        text: "Computers are forbidden from working on more than one file in a semester.",
      },
      {
        id: "c",
        text: "Encoding always takes zero time once a protocol exists.",
      },
      {
        id: "d",
        text: "Shared drives automatically duplicate every clip onto a satellite.",
      },
    ],
    answerId: "a",
    explanation:
      "Splitting encoding is parallel, but a one-at-a-time save step can erase the speedup. Students should estimate both the split and the join.",
    objectiveCodes: ["CSN-2.B"],
    difficulty: "hard",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "carpool-exclusion-effect",
    lessonSlug: "computing-innovations-and-effects",
    questionType: "multiple_choice",
    prompt:
      "A robotics carpool matcher requires a smartphone and a shared home-area pin. Which harmful effect should the team weigh alongside faster pickups?",
    choices: [
      {
        id: "a",
        text: "Students without a phone or permission to share a home area can be left out.",
      },
      {
        id: "b",
        text: "Bits cannot represent street names.",
      },
      {
        id: "c",
        text: "Carpool apps are unable to use any protocol.",
      },
      {
        id: "d",
        text: "Faster pickups always cancel every privacy concern.",
      },
    ],
    answerId: "a",
    explanation:
      "A helpful innovation can exclude people who cannot meet its device or data requirements. That harmful effect belongs in the design review.",
    objectiveCodes: ["IOC-1.A", "IOC-1.B"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "recommended-clubs-training-bias",
    lessonSlug: "computing-innovations-and-effects",
    questionType: "multiple_choice",
    prompt:
      "A recommended-clubs model is trained only on last year's join lists, which were dominated by two large teams. New students keep seeing those same two teams. What is the best diagnosis?",
    choices: [
      {
        id: "a",
        text: "The model is biased toward patterns in the training data, so missing clubs stay missing.",
      },
      {
        id: "b",
        text: "Training data cannot influence later recommendations.",
      },
      {
        id: "c",
        text: "Every recommendation system must suggest exactly two teams.",
      },
      {
        id: "d",
        text: "Join lists are bits and therefore have no social effect.",
      },
    ],
    answerId: "a",
    explanation:
      "A model repeats patterns in its training data. If small or new clubs were scarce last year, they stay invisible unless the team changes the data or the rule.",
    objectiveCodes: ["IOC-1.F"],
    difficulty: "hard",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "pothole-map-representation",
    lessonSlug: "crowdsourcing-legal-and-ethical-limits",
    questionType: "multiple_choice",
    prompt:
      "A civic club builds a pothole map from phone reports. Almost every pin is from one neighborhood with many drivers. What should officers tell the city?",
    choices: [
      {
        id: "a",
        text: "The map proves every other neighborhood has zero potholes.",
      },
      {
        id: "b",
        text: "The map shows where reports came from, which may not match where all holes are.",
      },
      {
        id: "c",
        text: "Crowdsourcing always produces a complete census.",
      },
      {
        id: "d",
        text: "Phone reports cannot be stored as data.",
      },
    ],
    answerId: "b",
    explanation:
      "Crowdsourcing scales, but it reflects who reports. A cluster of pins can mean more drivers, not a unique pothole crisis.",
    objectiveCodes: ["IOC-1.D"],
    difficulty: "easy",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSP_NAMESPACE,
    slug: "yearbook-photo-not-free",
    lessonSlug: "crowdsourcing-legal-and-ethical-limits",
    questionType: "multiple_choice",
    prompt:
      "A meme generator pulls a yearbook photographer's image from a club chat and treats it as free raw material. Why is that a problem?",
    choices: [
      {
        id: "a",
        text: "Appearing in a chat does not grant a remix license or erase copyright.",
      },
      {
        id: "b",
        text: "Photographs cannot be represented with bits.",
      },
      {
        id: "c",
        text: "Club chats automatically place every file in the public domain.",
      },
      {
        id: "d",
        text: "Only printed posters can be copyrighted, never digital files.",
      },
    ],
    answerId: "a",
    explanation:
      "Legal reuse depends on license and permission, not on how easy the file was to copy from a chat. Open licenses, if any, must be checked.",
    objectiveCodes: ["IOC-1.E"],
    difficulty: "medium",
    sourceBasis: AP_CSP_SOURCE_BASIS,
    version: 1,
  },
];

export const AP_CSP_QUESTION_COUNT = questions.length;

export default questions;
