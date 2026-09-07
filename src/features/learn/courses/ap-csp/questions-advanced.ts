/**
 * Advanced original AP CSP items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "iteration-feedback-not-feature",
    lessonSlug: "purpose-users-and-iteration",
    prompt:
      "A robotics club ships a hallway map after one teacher interview and never watches students use it. Which statement is the strongest critique?",
    choices: [
      "The program cannot be an innovation unless it uses machine learning.",
      "The team skipped iteration with actual users, so they cannot tell whether the purpose is met.",
      "One interview is enough because teachers are the only users.",
      "Maps do not need users because they only display data.",
    ],
    answer: "b",
    explanation:
      "Purpose is judged against users. Shipping once without watching the people who walk the hallway skips the feedback loop that would show a missed purpose.",
    codes: ["CRD-1.A"],
  }),
  originalItem({
    slug: "same-bits-three-contexts",
    lessonSlug: "bits-patterns-and-meaning",
    prompt:
      "The bit pattern 01000001 is stored once. Which claim is correct?",
    choices: [
      "It can only represent the integer 65.",
      "It can only represent the letter A.",
      "The same bits can mean 65, 'A', or a color channel depending on the program's interpretation.",
      "Bits have one universal meaning agreed by every computer.",
    ],
    answer: "c",
    explanation:
      "Bits are patterns. Meaning comes from the encoding the program applies. 01000001 is 65 as an unsigned integer and 'A' in ASCII, or something else in another scheme.",
    codes: ["DAT-1.A"],
  }),
  originalItem({
    slug: "training-set-exclusion",
    lessonSlug: "datasets-bias-and-charts",
    prompt:
      "A club-recommender trains only on after-school clubs that already have 40 members. What bias is most likely?",
    choices: [
      "The model will prefer small new clubs.",
      "The model will under-recommend newer or niche clubs that never reached 40 members.",
      "Training data size cannot affect recommendations.",
      "The model must be unbiased because it uses numbers.",
    ],
    answer: "b",
    explanation:
      "What you omit from training is a design choice. Clubs that never hit 40 never appear as positive examples, so the model learns the already-large pattern.",
    codes: ["DAT-2.C"],
  }),
  originalItem({
    slug: "procedure-parameter-length",
    lessonSlug: "lists-procedures-and-simulations",
    prompt:
      "stock(n) appends n to bins and returns bins.length. bins starts as [4]. What does the second call return after stock(3) then stock(2)?",
    choices: ["1", "2", "3", "9"],
    answer: "c",
    explanation:
      "After stock(3) the list is [4, 3] and the return is 2. After stock(2) the list is [4, 3, 2] and the return is 3. The parameter is the value appended, not the new length.",
    codes: ["AAP-3.A"],
  }),
  originalItem({
    slug: "redundancy-not-speed",
    lessonSlug: "packets-paths-and-redundancy",
    prompt:
      "A livestream uses two independent school-to-cloud paths. The club says redundancy exists so the stream is always faster. What is the accurate claim?",
    choices: [
      "Redundancy guarantees lower latency on every packet.",
      "Redundancy mainly raises the chance the stream survives if one path fails.",
      "Two paths always double bandwidth for every user.",
      "Redundancy removes the need for protocols.",
    ],
    answer: "b",
    explanation:
      "Extra paths help availability. They do not automatically cut latency or double bandwidth for every packet.",
    codes: ["CSN-1.B"],
  }),
  originalItem({
    slug: "bandwidth-vs-latency-upload",
    lessonSlug: "protocols-bandwidth-and-open-internet",
    prompt:
      "A yearbook club uploads one 80 MB video. The path has high bandwidth and high latency. Which outcome is most likely compared with a low-bandwidth low-latency path of the same length?",
    choices: [
      "The first byte arrives sooner, but the whole file may finish later.",
      "The first byte may wait longer, but the large file can still finish sooner.",
      "Latency and bandwidth are the same quantity.",
      "High latency always makes large uploads impossible.",
    ],
    answer: "b",
    explanation:
      "Latency is delay before useful transfer. Bandwidth is how much can move once it starts. A large file can still finish sooner on a fatter pipe even if the first byte waits.",
    codes: ["CSN-1.C"],
  }),
  originalItem({
    slug: "public-screen-pii",
    lessonSlug: "computing-innovations-and-effects",
    prompt:
      "A hall-pass app shows full student names and destinations on a lobby TV. Which harm is the club actually introducing?",
    choices: [
      "The TV uses electricity, so the app cannot be an innovation.",
      "The display publishes student movement to anyone in the lobby.",
      "Any public screen is illegal in every school.",
      "Names on a screen improve privacy because they are not emails.",
    ],
    answer: "b",
    explanation:
      "An innovation can create a privacy harm even when the feature works. A lobby TV is a public channel for student location.",
    codes: ["IOC-1.A"],
  }),
  originalItem({
    slug: "crowdsource-not-license",
    lessonSlug: "crowdsourcing-legal-and-ethical-limits",
    prompt:
      "Members paste yearbook photos from classmates' public social posts into a club archive. What limit still applies?",
    choices: [
      "Public posts are always free to copy for any school use.",
      "Crowdsourcing the collection does not grant the club the right to reuse each photo.",
      "Only printed photos have legal limits.",
      "If the archive is private, reuse rights never matter.",
    ],
    answer: "b",
    explanation:
      "Gathering files is not the same as having a license. Public visibility is not a blanket grant to copy and store student photos.",
    codes: ["IOC-1.F"],
  }),
] as const;
