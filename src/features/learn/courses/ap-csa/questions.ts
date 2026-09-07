/**
 * Original BayAreaClubs multiple-choice items for AP Computer Science A.
 * Written from scratch. Not derived from College Board, Unlimited Voices,
 * Stellar Learning, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_CSA_NAMESPACE,
  AP_CSA_SOURCE_BASIS,
  type ApCsaLessonSlug,
} from "@/features/learn/courses/ap-csa/manifest";

export type ApCsaChoiceId = "a" | "b" | "c" | "d";

export type ApCsaChoice = {
  id: ApCsaChoiceId;
  text: string;
};

export type ApCsaDifficulty = "easy" | "medium" | "hard";

export type ApCsaQuestion = {
  namespace: typeof AP_CSA_NAMESPACE;
  slug: string;
  lessonSlug: ApCsaLessonSlug | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApCsaChoice, ApCsaChoice, ApCsaChoice, ApCsaChoice];
  answerId: ApCsaChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApCsaDifficulty;
  sourceBasis: typeof AP_CSA_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApCsaQuestion[] = [
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "ferry-leftover-seats",
    lessonSlug: "primitive-values-and-expressions",
    questionType: "multiple_choice",
    prompt:
      "A club ride to Sausalito has 47 students. Each water taxi holds 12 students. After these statements run, what is stored in leftover?\n\nint riders = 47;\nint seatsPerBoat = 12;\nint leftover = riders % seatsPerBoat;",
    choices: [
      { id: "a", text: "3" },
      { id: "b", text: "4" },
      { id: "c", text: "11" },
      { id: "d", text: "0" },
    ],
    answerId: "c",
    explanation:
      "The remainder operator % keeps what is left after as many full groups of 12 as possible. 47 / 12 is 3 full taxis; 47 % 12 is 11. Choice A is the integer quotient, not the leftover seats.",
    objectiveCodes: ["1.3.C"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "soil-bag-cast",
    lessonSlug: "primitive-values-and-expressions",
    questionType: "multiple_choice",
    prompt:
      "The garden club records 17.8 bags of soil. After these statements run, what is stored in wholeBags?\n\ndouble soilBags = 17.8;\nint wholeBags = (int) soilBags;",
    choices: [
      { id: "a", text: "17" },
      { id: "b", text: "18" },
      { id: "c", text: "17.8" },
      { id: "d", text: "16" },
    ],
    answerId: "a",
    explanation:
      "Casting a double to int drops the fraction toward zero. (int) 17.8 is 17. Java does not round 17.8 up to 18, and an int variable cannot store 17.8.",
    objectiveCodes: ["1.5.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "mural-tile-division",
    lessonSlug: "primitive-values-and-expressions",
    questionType: "multiple_choice",
    prompt:
      "Art club members cut a mural into tiles. After these statements run, what is stored in shade?\n\nint wide = 5;\nint gap = 2;\ndouble shade = wide / gap + 0.5;",
    choices: [
      { id: "a", text: "2.0" },
      { id: "b", text: "2.5" },
      { id: "c", text: "3.0" },
      { id: "d", text: "3.5" },
    ],
    answerId: "b",
    explanation:
      "wide and gap are both ints, so wide / gap is integer division: 5 / 2 is 2. Adding 0.5 then produces the double 2.5. The common mistake is treating 5 / 2 as 2.5 before the addition.",
    objectiveCodes: ["1.3.C", "1.4.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "kayak-tide-boolean",
    lessonSlug: "boolean-choices-and-branches",
    questionType: "multiple_choice",
    prompt:
      "A kayak club launches only when the tide height in inches is at least 36 and strictly less than 80. After these statements run, what is stored in canLaunch?\n\nint tideInches = 42;\nboolean canLaunch = tideInches >= 36 && tideInches < 80;",
    choices: [
      { id: "a", text: "true" },
      { id: "b", text: "false" },
      { id: "c", text: "42" },
      { id: "d", text: "The statements do not compile." },
    ],
    answerId: "a",
    explanation:
      "42 >= 36 is true and 42 < 80 is true, so the && expression is true. A boolean variable stores true or false, not the integer 42.",
    objectiveCodes: ["2.2.A", "2.5.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "garden-bed-object",
    lessonSlug: "objects-methods-and-control",
    questionType: "multiple_choice",
    prompt:
      "A garden club program uses the GardenBed class below. After the statements that follow the class run, which claim is true?\n\npublic class GardenBed {\n  private String location;\n  private int plants;\n\n  public GardenBed(String location, int plants) {\n    this.location = location;\n    this.plants = plants;\n  }\n\n  public int getPlants() {\n    return plants;\n  }\n\n  public void addPlants(int extra) {\n    plants += extra;\n  }\n}\n\nGardenBed wall = new GardenBed(\"Library wall\", 6);\nGardenBed rack = new GardenBed(\"Bike rack\", 6);\nwall.addPlants(3);",
    choices: [
      {
        id: "a",
        text: "wall and rack refer to the same object, so rack.getPlants() is 9.",
      },
      {
        id: "b",
        text: "wall.getPlants() is 9 and rack.getPlants() is 6.",
      },
      {
        id: "c",
        text: "wall.getPlants() is still 6 because addPlants cannot change private data.",
      },
      {
        id: "d",
        text: "The program does not compile because plants is private.",
      },
    ],
    answerId: "b",
    explanation:
      "Each new GardenBed(...) call creates a separate object. addPlants runs on wall only, so wall holds 9 plants and rack still holds 6. Methods of GardenBed may update private fields; other classes just cannot name those fields directly.",
    objectiveCodes: ["1.12.A", "1.13.C", "1.14.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "club-code-substring",
    lessonSlug: "objects-methods-and-control",
    questionType: "multiple_choice",
    prompt:
      "A robotics club stores a venue code. After these statements run, what is stored in slice?\n\nString code = \"OAKLAND\";\nString slice = code.substring(1, 4);",
    choices: [
      { id: "a", text: "OAK" },
      { id: "b", text: "AKL" },
      { id: "c", text: "AKLA" },
      { id: "d", text: "AKLAND" },
    ],
    answerId: "b",
    explanation:
      'substring(start, end) includes the character at start and stops before end. For "OAKLAND", index 1 is A and index 4 is A, so substring(1, 4) is AKL.',
    objectiveCodes: ["1.15.A", "1.14.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "jam-crate-selection",
    lessonSlug: "boolean-choices-and-branches",
    questionType: "multiple_choice",
    prompt:
      "A cooking club labels crates of jam. After these statements run, what is stored in label?\n\nint jars = 9;\nString label;\nif (jars >= 12) {\n  label = \"full crate\";\n} else if (jars >= 6) {\n  label = \"half crate\";\n} else {\n  label = \"loose jars\";\n}",
    choices: [
      { id: "a", text: "full crate" },
      { id: "b", text: "half crate" },
      { id: "c", text: "loose jars" },
      { id: "d", text: "The statements do not compile." },
    ],
    answerId: "b",
    explanation:
      "jars is 9, so jars >= 12 is false and the first branch is skipped. jars >= 6 is true, so label becomes half crate. The else branch never runs once an earlier condition is true.",
    objectiveCodes: ["2.3.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "locker-odd-sum",
    lessonSlug: "loops-and-tracing",
    questionType: "multiple_choice",
    prompt:
      "A chess club numbers lockers with odd integers. After the loop below finishes, what is stored in sum?\n\nint sum = 0;\nfor (int n = 3; n <= 7; n += 2) {\n  sum += n;\n}",
    choices: [
      { id: "a", text: "12" },
      { id: "b", text: "15" },
      { id: "c", text: "16" },
      { id: "d", text: "18" },
    ],
    answerId: "b",
    explanation:
      "n takes the values 3, 5, and 7. The loop stops when n becomes 9, which is not <= 7. 3 + 5 + 7 is 15. Choice D adds 9 as if the test were n <= 9.",
    objectiveCodes: ["2.8.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "shuttle-stop-array",
    lessonSlug: "arrays-and-arraylists",
    questionType: "multiple_choice",
    prompt:
      "A debate club shuttle records riders who board at five stops. After these statements run, what is stored in value?\n\nint[] stops = {4, 11, 8, 15, 6};\nint value = stops[2] + stops[stops.length - 1];",
    choices: [
      { id: "a", text: "17" },
      { id: "b", text: "19" },
      { id: "c", text: "14" },
      { id: "d", text: "21" },
    ],
    answerId: "c",
    explanation:
      "Array indexes start at 0. stops[2] is 8 and stops[stops.length - 1] is the last entry, 6. 8 + 6 is 14. Adding the first and last entries instead would be 4 + 6.",
    objectiveCodes: ["4.3.A", "4.4.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "bake-sale-waitlist",
    lessonSlug: "arrays-and-arraylists",
    questionType: "multiple_choice",
    prompt:
      "A bake-sale waitlist is stored in an ArrayList of names. After these statements run, what is stored in next?\n\nArrayList<String> waitlist = new ArrayList<String>();\nwaitlist.add(\"Nia\");\nwaitlist.add(\"Omar\");\nwaitlist.add(\"Pia\");\nwaitlist.remove(1);\nString next = waitlist.get(1);",
    choices: [
      { id: "a", text: "Nia" },
      { id: "b", text: "Omar" },
      { id: "c", text: "Pia" },
      { id: "d", text: "The statements throw an IndexOutOfBoundsException." },
    ],
    answerId: "c",
    explanation:
      "After the three add calls the list is Nia, Omar, Pia. remove(1) deletes Omar, so the list is Nia, Pia. get(1) is then Pia. The list still has two names, so the get call is in range.",
    objectiveCodes: ["4.8.A", "4.9.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "auditorium-seat-grid",
    lessonSlug: "two-d-arrays-and-recursion-tracing",
    questionType: "multiple_choice",
    prompt:
      "A film club maps empty seats in three rows. After these statements run, what is stored in total?\n\nint[][] seats = {\n  {2, 1, 0},\n  {3, 3, 1},\n  {0, 4, 2}\n};\nint total = seats[1][0] + seats[2][1];",
    choices: [
      { id: "a", text: "5" },
      { id: "b", text: "6" },
      { id: "c", text: "7" },
      { id: "d", text: "4" },
    ],
    answerId: "c",
    explanation:
      "seats[1][0] is the first value in the second row, 3. seats[2][1] is the middle value in the third row, 4. 3 + 4 is 7. A common mix-up is reading [row][column] in the opposite order.",
    objectiveCodes: ["4.11.A", "4.12.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "origami-fold-recursion",
    lessonSlug: "two-d-arrays-and-recursion-tracing",
    questionType: "multiple_choice",
    prompt:
      "An origami club traces this recursive method. What value does fold(7) return?\n\npublic static int fold(int n) {\n  if (n <= 1) {\n    return n;\n  }\n  return n + fold(n - 2);\n}",
    choices: [
      { id: "a", text: "7" },
      { id: "b", text: "13" },
      { id: "c", text: "16" },
      { id: "d", text: "28" },
    ],
    answerId: "c",
    explanation:
      "fold(7) is 7 + fold(5), which is 7 + 5 + fold(3), which is 7 + 5 + 3 + fold(1). The base case fold(1) returns 1, so the sum is 16. The method subtracts 2 each call, so it does not add every integer from 1 through 7.",
    objectiveCodes: ["4.16.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "compound-cast-remainder",
    lessonSlug: "primitive-values-and-expressions",
    questionType: "multiple_choice",
    prompt:
      "A garden club splits leftover seed packets. After these statements run, what is stored in leftover?\n\nint packets = 19;\nint trays = 4;\ndouble leftover = (double) (packets / trays) + packets % trays;",
    choices: [
      { id: "a", text: "4.75" },
      { id: "b", text: "7.0" },
      { id: "c", text: "7.75" },
      { id: "d", text: "8.0" },
    ],
    answerId: "b",
    explanation:
      "packets / trays is integer division, so 19 / 4 is 4. Casting that 4 to double yields 4.0. packets % trays is 3. 4.0 + 3 is 7.0. Casting after the division does not recover the discarded fraction.",
    objectiveCodes: ["1.3.C", "1.5.A"],
    difficulty: "hard",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "trail-permit-branch",
    lessonSlug: "boolean-choices-and-branches",
    questionType: "multiple_choice",
    prompt:
      "A hiking club at the Headlands prints a trail pass. After these statements run, what is stored in pass?\n\nint age = 15;\nboolean member = true;\nString pass;\nif (age >= 18) {\n  pass = \"adult\";\n} else if (member) {\n  pass = \"youth member\";\n} else {\n  pass = \"guest\";\n}",
    choices: [
      { id: "a", text: "adult" },
      { id: "b", text: "youth member" },
      { id: "c", text: "guest" },
      { id: "d", text: "The statements do not compile." },
    ],
    answerId: "b",
    explanation:
      "age >= 18 is false, so the first branch is skipped. member is true, so pass becomes youth member. The else branch never runs.",
    objectiveCodes: ["2.3.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "ticket-window-while",
    lessonSlug: "loops-and-tracing",
    questionType: "multiple_choice",
    prompt:
      "A theater club sells tickets while more than two remain. After the loop finishes, what is stored in sold?\n\nint left = 5;\nint sold = 0;\nwhile (left > 2) {\n  left--;\n  sold++;\n}",
    choices: [
      { id: "a", text: "2" },
      { id: "b", text: "3" },
      { id: "c", text: "4" },
      { id: "d", text: "5" },
    ],
    answerId: "b",
    explanation:
      "The loop runs while left is 5, then 4, then 3. Each pass decrements left and increments sold. When left becomes 2 the test fails. sold is 3.",
    objectiveCodes: ["2.8.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "nested-row-count",
    lessonSlug: "loops-and-tracing",
    questionType: "multiple_choice",
    prompt:
      "A yearbook club stamps photo sheets with this nested loop. After the loops finish, what is stored in count?\n\nint count = 0;\nfor (int r = 1; r <= 3; r++) {\n  for (int c = 0; c < r; c++) {\n    count++;\n  }\n}",
    choices: [
      { id: "a", text: "3" },
      { id: "b", text: "4" },
      { id: "c", text: "6" },
      { id: "d", text: "9" },
    ],
    answerId: "c",
    explanation:
      "When r is 1 the inner loop runs once. When r is 2 it runs twice. When r is 3 it runs three times. 1 + 2 + 3 is 6. Choice D would be a 3 by 3 rectangle.",
    objectiveCodes: ["2.8.A"],
    difficulty: "hard",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "screening-constructor",
    lessonSlug: "writing-classes-and-constructors",
    questionType: "multiple_choice",
    prompt:
      "A film club builds one Screening. After these statements run, what is stored in open?\n\npublic class Screening {\n  private String title;\n  private int seatsLeft;\n\n  public Screening(String title, int seatsLeft) {\n    this.title = title;\n    this.seatsLeft = seatsLeft;\n  }\n\n  public int getSeatsLeft() {\n    return seatsLeft;\n  }\n}\n\nScreening friday = new Screening(\"Night Market\", 40);\nint open = friday.getSeatsLeft();",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "40" },
      { id: "c", text: "null" },
      { id: "d", text: "The statements do not compile." },
    ],
    answerId: "b",
    explanation:
      "The constructor copies 40 into the seatsLeft field of the new object. getSeatsLeft returns that field. A missing constructor would have left the int at 0.",
    objectiveCodes: ["3.1.A", "3.2.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "hours-mutator-guard",
    lessonSlug: "encapsulation-and-methods",
    questionType: "multiple_choice",
    prompt:
      "A robotics club stores weekly shop hours. After these statements run, what is stored in result?\n\npublic class ClubRoom {\n  private int hours;\n\n  public void setHours(int hours) {\n    if (hours >= 0) {\n      this.hours = hours;\n    }\n  }\n\n  public int getHours() {\n    return hours;\n  }\n}\n\nClubRoom shop = new ClubRoom();\nshop.setHours(4);\nshop.setHours(-2);\nint result = shop.getHours();",
    choices: [
      { id: "a", text: "-2" },
      { id: "b", text: "0" },
      { id: "c", text: "2" },
      { id: "d", text: "4" },
    ],
    answerId: "d",
    explanation:
      "setHours(4) stores 4. setHours(-2) fails the hours >= 0 check, so the field stays 4. The mutator refuses the bad value instead of overwriting.",
    objectiveCodes: ["3.5.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "static-open-count",
    lessonSlug: "encapsulation-and-methods",
    questionType: "multiple_choice",
    prompt:
      "A film club counts constructed Screening objects with a static field. After these statements run, which claim is true?\n\npublic class Screening {\n  private static int open = 0;\n  private int seats;\n\n  public Screening(int seats) {\n    this.seats = seats;\n    open++;\n  }\n\n  public static int getOpen() {\n    return open;\n  }\n\n  public int getSeats() {\n    return seats;\n  }\n}\n\nScreening first = new Screening(10);\nScreening second = new Screening(8);",
    choices: [
      {
        id: "a",
        text: "Screening.getOpen() is 2 and second.getSeats() is 8.",
      },
      {
        id: "b",
        text: "Screening.getOpen() is 1 and second.getSeats() is 8.",
      },
      {
        id: "c",
        text: "Screening.getOpen() is 2 and second.getSeats() is 10.",
      },
      {
        id: "d",
        text: "The statements do not compile because getOpen is static.",
      },
    ],
    answerId: "a",
    explanation:
      "open is static, so both constructor calls increment the same counter to 2. seats is an instance field, so second keeps 8 and first keeps 10. Static methods may be called on the class name.",
    objectiveCodes: ["3.7.A", "3.2.A"],
    difficulty: "medium",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "accessor-keeps-title",
    lessonSlug: "writing-classes-and-constructors",
    questionType: "multiple_choice",
    prompt:
      "A poetry club reads a Screening title. After these statements run, what is stored in name?\n\npublic class Screening {\n  private String title;\n\n  public Screening(String title) {\n    this.title = title;\n  }\n\n  public String getTitle() {\n    return title;\n  }\n}\n\nScreening night = new Screening(\"Harbor Lights\");\nString name = night.getTitle();",
    choices: [
      { id: "a", text: "Harbor Lights" },
      { id: "b", text: "null" },
      { id: "c", text: "title" },
      { id: "d", text: "The statements do not compile." },
    ],
    answerId: "a",
    explanation:
      "The constructor stores Harbor Lights in the private field. getTitle is an accessor and returns that value without changing the object.",
    objectiveCodes: ["3.4.A", "3.2.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "reserve-three-calls",
    lessonSlug: "encapsulation-and-methods",
    questionType: "multiple_choice",
    prompt:
      "A film club reserves seats on one Screening. After these statements run, what is stored in left?\n\npublic class Screening {\n  private int seatsLeft;\n\n  public Screening(int seatsLeft) {\n    this.seatsLeft = seatsLeft;\n  }\n\n  public boolean reserve(int wanted) {\n    if (wanted <= 0 || wanted > seatsLeft) {\n      return false;\n    }\n    seatsLeft -= wanted;\n    return true;\n  }\n\n  public int getSeatsLeft() {\n    return seatsLeft;\n  }\n}\n\nScreening room = new Screening(10);\nroom.reserve(4);\nroom.reserve(8);\nroom.reserve(6);\nint left = room.getSeatsLeft();",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "2" },
      { id: "c", text: "6" },
      { id: "d", text: "10" },
    ],
    answerId: "a",
    explanation:
      "reserve(4) succeeds and leaves 6. reserve(8) fails because 8 is greater than 6, so the field stays 6. reserve(6) succeeds and leaves 0.",
    objectiveCodes: ["3.5.A", "3.6.A"],
    difficulty: "hard",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "waitlist-insert",
    lessonSlug: "arrays-and-arraylists",
    questionType: "multiple_choice",
    prompt:
      "A robotics outreach waitlist inserts a name. After these statements run, what is stored in mid?\n\nArrayList<String> names = new ArrayList<String>();\nnames.add(\"Kai\");\nnames.add(\"Lee\");\nnames.add(1, \"Jo\");\nString mid = names.get(1);",
    choices: [
      { id: "a", text: "Kai" },
      { id: "b", text: "Jo" },
      { id: "c", text: "Lee" },
      { id: "d", text: "The statements throw an IndexOutOfBoundsException." },
    ],
    answerId: "b",
    explanation:
      "After the first two add calls the list is Kai, Lee. add(1, \"Jo\") inserts Jo at index 1 and shifts Lee right, so the list is Kai, Jo, Lee. get(1) is Jo.",
    objectiveCodes: ["4.8.A", "4.9.A"],
    difficulty: "easy",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CSA_NAMESPACE,
    slug: "max-seen-scores",
    lessonSlug: "arrays-and-arraylists",
    questionType: "multiple_choice",
    prompt:
      "A chess club counts how many times the high score appears. After the loop finishes, what is stored in seen?\n\nint[] scores = {3, 8, 2, 8, 5};\nint max = scores[0];\nint seen = 0;\nfor (int i = 0; i < scores.length; i++) {\n  if (scores[i] > max) {\n    max = scores[i];\n    seen = 1;\n  } else if (scores[i] == max) {\n    seen++;\n  }\n}",
    choices: [
      { id: "a", text: "1" },
      { id: "b", text: "2" },
      { id: "c", text: "3" },
      { id: "d", text: "8" },
    ],
    answerId: "b",
    explanation:
      "max starts at 3 and seen starts at 0. The first 3 equals max, so seen becomes 1. Then 8 raises max and resets seen to 1. The later 8 equals max and increments seen to 2. 2 and 5 are smaller, so they are ignored.",
    objectiveCodes: ["4.3.A", "4.4.A"],
    difficulty: "hard",
    sourceBasis: AP_CSA_SOURCE_BASIS,
    version: 1,
  },
];

export default questions;
