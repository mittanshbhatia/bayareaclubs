/**
 * Original BayAreaClubs multiple-choice items for the AP CSP published skeleton.
 * Written from scratch. Not derived from College Board, Unlimited Voices,
 * Stellar Learning, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_CSP_NAMESPACE,
  AP_CSP_SOURCE_BASIS,
} from "@/features/learn/courses/ap-csp/manifest";

export type ApCspChoiceId = "a" | "b" | "c" | "d";

export type ApCspChoice = {
  id: ApCspChoiceId;
  text: string;
};

export type ApCspDifficulty = "easy" | "medium" | "hard";

export type ApCspQuestion = {
  namespace: typeof AP_CSP_NAMESPACE;
  slug: string;
  lessonSlug: "purpose-users-and-iteration" | "bits-patterns-and-meaning" | null;
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
];

export const AP_CSP_QUESTION_COUNT = questions.length;

export default questions;
