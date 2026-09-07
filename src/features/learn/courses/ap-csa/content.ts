/**
 * Original BayAreaClubs lesson bodies for AP Computer Science A.
 * Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_CSA_NAMESPACE,
  AP_CSA_SOURCE_BASIS,
  type ApCsaLessonSlug,
  type ApCsaOfficialUnitSlug,
} from "@/features/learn/courses/ap-csa/manifest";
import { questions } from "@/features/learn/courses/ap-csa/questions";

export type { ApCsaLessonSlug };

export type ApCsaLesson = {
  namespace: typeof AP_CSA_NAMESPACE;
  unitSlug: ApCsaOfficialUnitSlug;
  slug: ApCsaLessonSlug;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_CSA_SOURCE_BASIS;
  /** Official public CED identifiers only. */
  objectiveCodes: readonly string[];
  bodyPlain: string;
};

export const lessons: readonly ApCsaLesson[] = [
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "using-objects-and-methods",
    slug: "primitive-values-and-expressions",
    title: "Primitive values and expressions",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["1.2.B", "1.3.C", "1.4.A", "1.5.A"],
    bodyPlain: [
      "A Java program keeps numbers and true-or-false facts in named boxes called variables. In AP Computer Science A you work with three primitive types: int for whole counts, double for measurements that need a decimal, and boolean for a condition that is either true or false.",
      "Picture a school garden club on a Saturday work day. An int named trays can store 8. A double named litersOfWater can store 3.5. A boolean named hoseConnected can store true. The type you pick is a promise: an int cannot keep the leftover half liter, and a boolean cannot store a count.",
      "Arithmetic uses +, -, *, /, and %. When both sides of / are ints, Java throws away the fraction. 17 / 5 is 3, not 3.4. The remainder operator answers a different question: what is left after you make as many full groups as possible. 17 % 5 is 2. That pair is useful when 17 seedlings go into trays of 5 — three full trays and two plants still on the table.",
      "If either side of a calculation is a double, the result is a double. 17 / 5.0 is 3.4. Casting converts on purpose. (int) 3.9 becomes 3; the extra 0.9 is dropped toward zero, not rounded. (double) 8 becomes 8.0 so a later division can keep a fraction.",
      "Assignment with = copies the value on the right into the variable on the left. A compound form such as trays += 2 means \"add 2 to whatever trays already holds.\" Java evaluates * / % before + - unless you add parentheses. (4 + 6) / 2 is 5, while 4 + 6 / 2 is 7.",
      "Boolean expressions compare values: trays >= 4, litersOfWater < 2.0, hoseConnected == true. Later lessons use those comparisons when a program must choose a path or repeat a step.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "using-objects-and-methods",
    slug: "objects-methods-and-control",
    title: "Objects, methods, and first control flow",
    position: 2,
    estimatedMinutes: 25,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["1.12.A", "1.13.C", "1.14.A", "1.15.A"],
    bodyPlain: [
      "A class is a blueprint. An object is one real thing built from that blueprint. If GardenBed is the class, the raised box by the library wall is one object and the box beside the bike rack is another. Each object keeps its own data and can run the behaviors the class defines.",
      "You create an object with new and a constructor:\nGardenBed libraryBed = new GardenBed(\"Library\", 12);",
      "The variable libraryBed holds a reference to that object. It is not a copy of the wood and soil. Calling libraryBed.getPlants() asks that specific bed how many plants it currently holds. Calling a String method works the same way: \"Library\".length() is 7 because the method runs on that string object.",
      "Methods hide detail. You can call substring or indexOf without writing the search loop yourself. You learn the signature — the name, the parameter types, and the return type — and then you use it. substring(start, end) includes the character at start and stops before end.",
      "Two variables can refer to the same object or to two different objects. After GardenBed wall = new GardenBed(\"Library wall\", 6); and GardenBed rack = new GardenBed(\"Bike rack\", 6); a change through wall.addPlants(3) does not change rack. Assignment such as rack = wall makes both names point at one object.",
      "A short if or for can already appear when you call a method. The next unit treats selection and iteration as the main topic. For now, remember that a method call is a request to one object, and the result depends on that object's current data.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "selection-and-iteration",
    slug: "boolean-choices-and-branches",
    title: "Boolean choices and branches",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["2.2.A", "2.3.A", "2.5.A"],
    bodyPlain: [
      "A program chooses a path by evaluating a boolean expression and then running only the statements that match. In Java, if, else if, and else are the usual tools. The condition in parentheses must be a boolean: a comparison such as score >= 80, a boolean variable, or a compound expression joined with && or ||.",
      "Picture a hiking club meeting at the Marin Headlands. The leader checks whether the fog is thick and whether every hiker brought a jacket. Both facts can be stored as booleans. A compound test such as fogThick && !hasJacket is true only when the fog is thick and the jacket is missing. Then the program can print a stay-back message.",
      "An if-else chain stops at the first true condition. If the first test is true, later branches do not run even if they would also have been true. That is why the order of the tests matters when you label a crate as full, half, or leftover.",
      "You can rewrite a test instead of nesting more ifs. The opposite of (fogThick && hasJacket) is !fogThick || !hasJacket. The opposite of (a || b) is !a && !b. Short-circuit evaluation means && skips the right side when the left side is already false, and || skips the right side when the left side is already true.",
      "String and other object comparisons need care. == on two String variables asks whether they refer to the same object, not whether the characters match. Use equals when you care about the text. Primitive ints and booleans compare with == as you expect.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "selection-and-iteration",
    slug: "loops-and-tracing",
    title: "Loops and tracing",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["2.8.A"],
    bodyPlain: [
      "A loop repeats a block while a boolean test stays true. A while loop checks the test before each pass. A for loop packages the start value, the test, and the update in one header. Both forms can do the same work; you pick the one that matches how you think about the counter.",
      "A robotics club in Oakland counts battery packs. This loop adds 2, 4, 6, and 8:\nint total = 0;\nfor (int n = 2; n <= 8; n += 2) {\n  total += n;\n}",
      "The header starts n at 2, continues while n is at most 8, and adds 2 after each body. When n becomes 10 the test fails and the loop ends. total is 20. If the test were n < 8, the value 8 would never join the sum.",
      "Off-by-one mistakes are common. If the update is missing, the loop never ends. Trace the counter and the accumulator on paper for two or three passes before you guess the final result. A while loop that counts down from 5 while the value is greater than 2 runs three times and leaves 2.",
      "Nested loops run an inner loop to completion for each outer pass. A seating chart with 3 rows and 4 chairs can be filled with an outer row index and an inner chair index. The inner loop restarts from its initial value every time the outer loop takes a new step. Enhanced for loops walk every element when you do not need the index.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "class-creation",
    slug: "writing-classes-and-constructors",
    title: "Writing classes and constructors",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["3.1.A", "3.2.A"],
    bodyPlain: [
      "A class you write is still a blueprint, but now you decide the data and the behaviors. The fields hold the state of each object. The constructor runs once when new is used and should give every field a sensible starting value.",
      "A film club in Berkeley might model one screening:\npublic class Screening {\n  private String title;\n  private int seatsLeft;\n  public Screening(String title, int seatsLeft) {\n    this.title = title;\n    this.seatsLeft = seatsLeft;\n  }\n}",
      "The word this distinguishes the field from the parameter when the names match. After Screening friday = new Screening(\"Night Market\", 40); the friday object holds that title and 40 seats. A second new call builds a different object with its own fields.",
      "Constructors do not return a value. If you write a return type, you have written an ordinary method instead, and Java will supply a no-argument constructor that leaves numbers at 0 and object references at null. That surprise shows up when a field you thought you set is empty.",
      "Keep fields private so other classes cannot overwrite seatsLeft directly. Other classes talk to the object through methods you publish. The next lesson writes those accessors and mutators.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "class-creation",
    slug: "encapsulation-and-methods",
    title: "Encapsulation and methods",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["3.4.A", "3.5.A", "3.7.A"],
    bodyPlain: [
      "An accessor method returns a value without changing the object. A mutator method updates state, often after a check. A void method does work and returns nothing. A method with a return type must return a value on every path.",
      "A screening can expose seats without letting callers write the field:\npublic int getSeatsLeft() {\n  return seatsLeft;\n}\npublic boolean reserve(int wanted) {\n  if (wanted <= 0 || wanted > seatsLeft) {\n    return false;\n  }\n  seatsLeft -= wanted;\n  return true;\n}",
      "The reserve method both changes seatsLeft and reports whether the request succeeded. Callers do not need to know the field name. A mutator can refuse a bad value and leave the object unchanged, such as ignoring a negative hour count.",
      "Static members belong to the class, not to one object. A static int named open can count how many Screening objects have been constructed. Instance methods may read static data. A static method cannot use instance fields unless it is given an object.",
      "Scope is the region where a name is visible. A parameter named wanted exists only inside reserve. A local variable declared in an if block is gone after the brace. The field seatsLeft is visible to every instance method of Screening. Inheritance is outside the Fall 2025 public course, so this unit stops at one class you write.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "data-collections",
    slug: "arrays-and-arraylists",
    title: "Arrays and ArrayLists",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["4.3.A", "4.4.A", "4.8.A", "4.9.A"],
    bodyPlain: [
      "A one-dimensional array has a fixed length chosen when you create it. Indexes start at 0. The last valid index is length - 1. Reading or writing outside that range throws an ArrayIndexOutOfBoundsException.",
      "A debate club shuttle can record riders at five stops:\nint[] riders = {4, 11, 8, 15, 6};\nriders[2] is 8. riders[riders.length - 1] is 6. A loop from 0 through riders.length - 1 can add every entry or find a maximum. When you assign int[] copy = riders, both variables refer to the same array object, so a change through one name is visible through the other.",
      "An ArrayList of names grows as you add entries. add appends. add at an index inserts and shifts later items right. remove at an index deletes and shifts later items left. get and set read or replace at an index without changing the size. size() is the current count.",
      "A bake-sale waitlist that adds Nia, Omar, and Pia and then removes index 1 leaves Nia and Pia. get(1) is then Pia. That shift is the usual source of off-by-one bugs on ArrayList items. add(1, \"Jo\") on a two-name list puts Jo in the middle.",
      "You choose an array when the length is known and stable. You choose an ArrayList when a club roster grows and shrinks during the program. Both store references for objects and copies of values for ints if you use the matching wrapper type in an ArrayList.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "data-collections",
    slug: "two-d-arrays-and-recursion-tracing",
    title: "Two-dimensional arrays and recursion tracing",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["4.11.A", "4.12.A", "4.16.A"],
    bodyPlain: [
      "A two-dimensional array is an array of arrays. seats[row][col] names one cell. The number of rows is seats.length. The number of columns in row r is seats[r].length. Row-major traversal uses an outer loop on the row and an inner loop on the column.",
      "A film club can map empty seats:\nint[][] seats = {\n  {2, 1, 0},\n  {3, 3, 1},\n  {0, 4, 2}\n};\nseats[1][0] is 3. seats[2][1] is 4. Mixing the indexes is a common mistake.",
      "Recursion in this course is for tracing, not for inventing new recursive designs as a required skill. A recursive method calls itself with a smaller argument until a base case returns a value. To trace fold(7) when fold(n) returns n + fold(n - 2) and returns n when n is at most 1, write the chain 7 + 5 + 3 + 1.",
      "Each call waits for the smaller call to finish. The base case stops the chain. If you miss the base case, the calls never end. On a multiple-choice item, expand two or three calls on paper and then add.",
      "Inheritance is outside the Fall 2025 public course. This lesson stays with tables of values and with reading a recursive method you are given.",
    ].join("\n\n"),
  },
];

export const content = {
  namespace: AP_CSA_NAMESPACE,
  sourceBasis: AP_CSA_SOURCE_BASIS,
  frameworkCode: "AP-CSA" as const,
  frameworkYear: 2025 as const,
  lessons,
  questions,
};

export default content;
