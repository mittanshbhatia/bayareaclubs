/**
 * Original BayAreaClubs lesson bodies for AP Computer Science Principles.
 * Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_CSP_NAMESPACE,
  AP_CSP_SOURCE_BASIS,
  type ApCspOfficialUnitSlug,
} from "@/features/learn/courses/ap-csp/manifest";

export type ApCspLessonSlug =
  | "purpose-users-and-iteration"
  | "collaboration-and-shared-drafts"
  | "bits-patterns-and-meaning"
  | "datasets-bias-and-charts"
  | "sequences-selection-and-loops"
  | "lists-procedures-and-simulations"
  | "packets-paths-and-redundancy"
  | "protocols-bandwidth-and-open-internet"
  | "computing-innovations-and-effects"
  | "crowdsourcing-legal-and-ethical-limits";

export type ApCspLesson = {
  namespace: typeof AP_CSP_NAMESPACE;
  unitSlug: ApCspOfficialUnitSlug;
  slug: ApCspLessonSlug;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_CSP_SOURCE_BASIS;
  /** Official public CED identifiers only. */
  objectiveCodes: readonly string[];
  bodyPlain: string;
};

export const lessons: readonly ApCspLesson[] = [
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "creative-development",
    slug: "purpose-users-and-iteration",
    title: "Purpose, Users, and Iteration",
    position: 1,
    estimatedMinutes: 18,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["CRD-1.A", "CRD-2.A", "CRD-2.B"],
    bodyPlain: [
      "A computing project starts with a purpose: a specific job a program should do for a specific group of people. Writing that purpose down is not decoration. It tells the team what to build first, what to test, and when a change is actually an improvement. A club checkout tool whose purpose is \"show officers who currently has the soldering iron\" succeeds when officers can answer that question quickly. Adding a photo collage of last year's banquet does not serve that purpose, even if it looks polished.",
      "Users are the people who will operate the program or be affected by it. Designers should name them, watch how they currently solve the problem, and list the steps that still confuse them. A volunteer who opens the app once a week needs different labels and defaults than an officer who uses it every afternoon. If the team never talks to those users, the program tends to match the programmers' habits instead of the club's real workflow.",
      "Iteration is the planned cycle of try, observe, and revise. After a short test, the team records what users attempted, where they stalled, and whether the stated purpose was met. The next version should change the parts that blocked the purpose—not just add features. Throwing away an early draft is not failure when the draft taught the team that the purpose was wrong or incomplete. Keeping a pretty draft that still cannot do the job is the more expensive mistake.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "creative-development",
    slug: "collaboration-and-shared-drafts",
    title: "Collaboration and Shared Drafts",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["CRD-1.A", "CRD-1.B", "CRD-1.C", "CRD-2.G"],
    bodyPlain: [
      "A robotics club on the Peninsula splits a checkout app across three officers. Collaboration is not just sitting together. It is deciding who owns which procedure, how to name shared data, and when a draft is ready for someone else to try. Pair work—two people at one keyboard, switching roles—catches mismatches early because one person types while the other watches the purpose statement. The team still needs a written record of those decisions; a hallway conversation evaporates by Friday.",
      "Comments and short design notes are part of the program, not leftovers. When a partner writes a checkout procedure, a note should say whether it assumes the tool already exists and what it returns if the identifier is unknown. Without that, the next student invents a second meaning for the same name. A dated folder of drafts, or any other version history, lets the team roll back a change that looked clever and broke the purpose.",
      "User feedback belongs in the same loop as teammate review. After a lunch-period test, officers write what they clicked, what they expected, and what actually happened. That list is more useful than a general request to make the screens nicer. Incremental development means shipping a thin slice that already serves the purpose—who has the iron—before adding themes or banquet photos.",
      "Disagreements are normal. One officer wants a map of the lab; another wants a searchable list. The purpose statement is the tie-breaker: if officers need an answer in two seconds, a sorted list may win. Recording that choice, and the rejected alternative, is documentation. It prevents the losing idea from sneaking back in as an untested extra.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "data",
    slug: "bits-patterns-and-meaning",
    title: "Bits, Patterns, and Meaning",
    position: 1,
    estimatedMinutes: 18,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["DAT-1.A", "DAT-1.B", "DAT-2.A"],
    bodyPlain: [
      "Computers store and send information as bits: values that can be in one of two states, often written 0 and 1. A single bit can represent a yes-or-no flag. Longer sequences of bits can represent integers, text characters, colors, or sound samples. None of those meanings lives inside the bits themselves. A program, a file format, or a protocol supplies a mapping that says how to interpret the pattern.",
      "Because the mapping is chosen, the same pattern can mean different things in different contexts. The eight bits 01000001 can be the integer 65, the character A in a common text encoding, or part of a color or audio sample. If two programs disagree about the mapping, they will read the same stored bits and produce different results. That is a representation problem, not a hardware failure.",
      "When a club collects data—temperatures, finish times, survey ratings—it also chooses what to record and how finely to encode it. An 8-bit whole-number temperature cannot store 72.5, and it cannot store values outside its numeric range. Those limits are not trivia: they decide which later questions the dataset can answer and which details are gone forever. Students should be able to explain both what a bit pattern can represent and what a particular encoding will lose.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "data",
    slug: "datasets-bias-and-charts",
    title: "Datasets, Bias, and Charts",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["DAT-2.A", "DAT-2.B", "DAT-2.C", "DAT-2.D"],
    bodyPlain: [
      "A climate club in San Jose logs afternoon temperatures on the quad. The numbers are not the weather. They are a sample: one courtyard, one hour, one cheap sensor. If the sensor sits in the sun, every value drifts high. If members only record sunny club days, rainy weeks disappear. Those choices are part of the dataset, even if nobody writes them down.",
      "Metadata is the data about the data: when it was collected, where, in what units, and who cleaned it. A spreadsheet of numbers without metadata cannot tell a later officer whether 18 means degrees Celsius, a volunteer count, or a sensor error code. Programs that chart the column will still draw a line; the line will just be meaningless.",
      "Cleaning is a series of decisions. Dropping impossible values, such as a 900-degree reading, can hide a broken sensor or a mistyped 90. Filling gaps with averages invents days that never happened. Students should record each rule they apply so another person can repeat, or challenge, the same cleanup.",
      "Charts can reveal a weekly pattern or hide it. A bar for each month can flatten a heat wave that lasted four days. A scatter of time of day versus temperature can show the courtyard oven effect. Bias here is a systematic tilt in what was measured, who was asked, or how the picture was drawn. A debate club that surveys only people already in the room will discover that everyone loves the current topic.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "algorithms-and-programming",
    slug: "sequences-selection-and-loops",
    title: "Sequences, Selection, and Loops",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["AAP-2.A", "AAP-2.B", "AAP-2.E", "AAP-2.H"],
    bodyPlain: [
      "An algorithm is a finite, ordered plan that a computer can follow. Sequence means do these steps in this order: read the membership card, look up the name, show the meeting room. If you swap the first two steps, the lookup has no card to use. Selection means choose a path: if the card is expired, show a renewal message; otherwise print a nametag. Iteration means repeat: keep asking for a locker code while the guess is wrong.",
      "Boolean expressions decide which path runs. A robotics shop might allow tool checkout only when the member is on the roster and the tool is marked in. Those two conditions together are stricter than either one alone. An or condition is useful when any of several officers may approve a late check-in. Negation flips a test: if the iron is not marked in, refuse a second checkout. Students should trace a few concrete cases on paper before trusting a compound condition.",
      "Nested selection is just selection inside a path. After confirming the member is on the roster, the program might then check whether they have a safety quiz on file. The inner test never runs for strangers. That is not mysterious; it is a flowchart with a box inside a box. Bugs appear when people assume the inner test always runs, or when they invert a condition and lock everyone out.",
      "Algorithms can be correct for some inputs and fail for others. A loop that stops at the first matching name works if names are unique; it silently picks the wrong person if two members share a first name. Writing the assumed rule next to the algorithm is part of making it usable. Efficiency matters later, but a fast wrong answer still fails the club.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "algorithms-and-programming",
    slug: "lists-procedures-and-simulations",
    title: "Lists, Procedures, and Simulations",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["AAP-1.A", "AAP-1.C", "AAP-3.A", "AAP-3.B", "AAP-3.F"],
    bodyPlain: [
      "Lists store an ordered collection: the snack shop item names, the robotics team match scores, the choir call times. An index is a position, counted from zero or one depending on the language. Inserting at the front shifts later items. Removing a sold-out snack leaves a hole that the program must close or skip. Traversing a list means visiting each element once to total, filter, or print.",
      "Procedures package a process behind a name and, often, parameters. A stock procedure can run from the concession stand screen and from the inventory audit. Parameters are the inputs for one call; they keep the procedure reusable instead of hard-coding chips and the number one. A return value is the answer the caller receives, such as the new count or a flag that the item was missing. Testing one procedure is cheaper than testing four pasted copies.",
      "Simulations use a model to explore what-if questions without running the real event. A dance committee might simulate ticket lines with a list of arrival times and a procedure that serves the next person every thirty seconds. The model omits details on purpose: it may ignore friends cutting in line. Those omissions are assumptions. If the simulation says two cashiers are enough, the team should ask whether the omitted behavior would change the conclusion.",
      "Randomness in a simulation is a tool, not magic. Drawing a random late-bus delay can show a range of outcomes instead of one tidy story. Running the same model many times and recording the spread is more honest than a single lucky run. Students should still be able to explain which parts are measured data, which parts are invented rules, and which outputs are just the model talking to itself.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "computing-systems-and-networks",
    slug: "packets-paths-and-redundancy",
    title: "Packets, Paths, and Redundancy",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["CSN-1.A", "CSN-1.B", "CSN-1.C", "CSN-2.A"],
    bodyPlain: [
      "When a journalism club uploads a long interview from a library laptop, the file does not travel as one unbreakable chunk. The sending computer splits it into packets: addressed pieces that can take different routes and reassemble at the yearbook drive. Each packet carries enough addressing information for routers to forward it. If one packet is dropped, only that piece needs to be sent again.",
      "Paths are sequences of hops. The library wifi might fail while a wired lab jack still reaches the same school server. Redundancy—more than one usable path—lets the upload continue. That is fault tolerance: the system is designed so one failure does not stop the whole job. A single cheap link with no backup is simpler and also more fragile.",
      "Packets can arrive out of order. A livestream of a robotics match may show a brief glitch while missing pieces are requested again. Protocols decide whether the application waits for every piece, as a file that must be complete, or plays what it has, as a live scoreboard that prefers speed. Students should separate the idea that the internet can route around damage from the false idea that every app is therefore unbreakable.",
      "Scale changes the picture. Ten club laptops sharing one access point may be fine; a whole gym of phones at a playoff may stall. Adding devices shares the same radio and the same uplink. Redundancy at the building level, such as a second uplink, does not help if the bottleneck is the crowded gym wifi. Designers name the failure they are protecting against instead of waving at a vague cloud.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "computing-systems-and-networks",
    slug: "protocols-bandwidth-and-open-internet",
    title: "Protocols, Bandwidth, and the Open Internet",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["CSN-1.D", "CSN-1.E", "CSN-2.B"],
    bodyPlain: [
      "A protocol is an agreed set of rules for how devices talk: how a request starts, what an address looks like, and how both sides know a message is complete. Browsers and school servers that share the same web protocol can exchange a club calendar even if they were built by different teams. If one side invents a private greeting, the other side will not understand it. Open, published rules are what let a phone, a lab PC, and a borrowed tablet all reach the same page.",
      "Bandwidth is the capacity of a path over time—how much can move per second, not how far it travels. A high-bandwidth lab jack can carry a club documentary that would stall on a weak phone hotspot. Latency is wait time. A narrow but nearby link can feel snappy for a text chat and still be a poor choice for uploading raw video. Clubs should match the job to the path: submit a form on any connection; save huge media for a wired hour.",
      "The internet is a network of networks. Packets move across independently owned systems that have agreed to forward traffic using shared addressing and routing protocols. That openness is why a student at a San Mateo library can reach a college portal. It is also why a misconfigured school filter or a severed backbone can suddenly make a working site unreachable from one campus and fine from another.",
      "Parallel and distributed work split a job across processors or machines. Encoding twenty interview clips on one laptop is sequential; handing five clips to four lab computers is parallel. The wall-clock time drops only if the pieces are independent enough and the merge step is not itself a new bottleneck. A shared drive that accepts one file at a time can erase the speedup. Students should estimate both the split and the join.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "impact-of-computing",
    slug: "computing-innovations-and-effects",
    title: "Computing Innovations and Effects",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["IOC-1.A", "IOC-1.B", "IOC-1.F", "IOC-2.A"],
    bodyPlain: [
      "A computing innovation is a program or device that uses computing to solve a problem or provide a service. A hall-pass kiosk, a carpool matcher, and a livestream scoreboard all count. Effects are not only the intended help. The kiosk that speeds up passes can also broadcast which students left class, and when, to anyone in the hallway. Designers should name beneficial and harmful effects for different groups—staff, students, families, people walking by—not just for the people who requested the tool.",
      "Impact can be local or wide. A carpool app used by one robotics team changes after-school pickup for a few families. If the same idea spreads across a district, traffic, privacy, and exclusion effects grow. People without smartphones, or without permission to share a home area, may be left out of a convenient system. An effect that is small for officers can be large for a student who cannot opt in.",
      "Legal and ethical questions overlap but are not identical. A public screen of student movement may violate school policy even if a programmer can build it in an afternoon. Ethical review asks whether the team should build it, who is exposed, and what consent looks like. Being able to ship a feature is not the same as having a reason to ship it. Clubs that collect photos, locations, or nurse-visit flags need a narrower purpose and a tighter audience.",
      "Bias shows up when a system works better for some groups than others. Face-blur software trained on a narrow set of photos may miss students. A recommended-clubs model trained on last year's join lists may keep suggesting the same popular teams. Students should ask whose data trained the system, who was missing, and how a person can appeal a wrong automated decision.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSP_NAMESPACE,
    unitSlug: "impact-of-computing",
    slug: "crowdsourcing-legal-and-ethical-limits",
    title: "Crowdsourcing, Legal, and Ethical Limits",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CSP_SOURCE_BASIS,
    objectiveCodes: ["IOC-1.D", "IOC-1.E", "IOC-2.A", "IOC-2.B"],
    bodyPlain: [
      "Crowdsourcing asks a large group to contribute data, judgments, or labor. A city-wide pothole map, a shared set of practice quizzes, or a call for captioning last night's concert are examples. The gain is scale: many eyes find more holes than one public-works truck. The risk is quality and representation. If only drivers in one neighborhood report, the map will look like that neighborhood has all the problems.",
      "Legal limits include copyright, licenses, and student-record rules. A yearbook photographer's image is not free raw material for a meme generator just because it appeared in a club chat. Open licenses spell out whether remix is allowed. School directories and pass logs are not public datasets. Using them to train a who-skips-class model can be both unlawful and harmful even if the spreadsheet was easy to download from a shared drive.",
      "Privacy is about control of personal information. Personally identifiable information includes names, student IDs, precise home locations, and combinations that pick one person out of a crowd. An anonymous survey that still asks for unusual club roles plus grade plus school can re-identify someone. Aggregation, using counts instead of names, and access limits, officers only, reduce exposure. Posting a raw export to a public site does the opposite.",
      "Ethical use of other people's work and data includes citation, consent, and a plan to stop. If a crowdsourced lyric project includes a song still under copyright, the ethical move is to remove it, not to hide the source. If volunteers contributed traces for a safe-walk map, the team should say how long traces are kept and how a volunteer can delete theirs. Computing makes collection cheap; responsibility does not get cheaper.",
    ].join("\n\n"),
  },
];

export const content = {
  namespace: AP_CSP_NAMESPACE,
  sourceBasis: AP_CSP_SOURCE_BASIS,
  frameworkCode: "AP-CSP" as const,
  frameworkYear: 2020 as const,
  lessons,
};

export default content;
