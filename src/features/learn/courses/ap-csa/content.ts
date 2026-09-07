/**
 * Original BayAreaClubs lesson bodies for the AP CSA published skeleton.
 * Plain text only. Not a complete AP course. source_basis: ORIGINAL.
 */

import {
  AP_CSA_NAMESPACE,
  AP_CSA_SOURCE_BASIS,
} from "@/features/learn/courses/ap-csa/manifest";
import { questions } from "@/features/learn/courses/ap-csa/questions";

export type ApCsaLesson = {
  namespace: typeof AP_CSA_NAMESPACE;
  unitSlug: "java-foundations";
  slug: "primitive-values-and-expressions" | "objects-methods-and-control";
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
    unitSlug: "java-foundations",
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
      "Boolean expressions compare values: trays >= 4, litersOfWater < 2.0, hoseConnected == true. The next lesson uses those comparisons when a program must choose a path or repeat a step.",
      "This lesson is original BayAreaClubs teaching text. It is not College Board sample material, and two lessons do not make a complete AP course.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CSA_NAMESPACE,
    unitSlug: "java-foundations",
    slug: "objects-methods-and-control",
    title: "Objects, methods, and first control flow",
    position: 2,
    estimatedMinutes: 25,
    sourceBasis: AP_CSA_SOURCE_BASIS,
    objectiveCodes: ["1.12.A", "1.13.C", "1.14.A", "1.15.A", "2.3.A", "2.8.A"],
    bodyPlain: [
      "A class is a blueprint. An object is one real thing built from that blueprint. If GardenBed is the class, the raised box by the library wall is one object and the box beside the bike rack is another. Each object keeps its own data and can run the behaviors the class defines.",
      "You create an object with new and a constructor:\n\nGardenBed libraryBed = new GardenBed(\"Library\", 12);",
      "The variable libraryBed holds a reference to that object. It is not a copy of the wood and soil. Calling libraryBed.getPlants() asks that specific bed how many plants it currently holds. Calling a String method works the same way: \"Library\".length() is 7 because the method runs on that string object.",
      "Methods hide detail. You can call substring or indexOf without writing the search loop yourself. You learn the signature — the name, the parameter types, and the return type — and then you use it.",
      "Programs also choose and repeat. An if statement checks a boolean and runs one branch:\n\nif (libraryBed.getPlants() < 4) {\n  libraryBed.water(2.0);\n}",
      "A for loop repeats while a counter follows a pattern you write. This loop adds the odd locker numbers 3, 5, 7, and 9:\n\nint sum = 0;\nfor (int n = 3; n <= 9; n += 2) {\n  sum += n;\n}",
      "Later public AP CSA topics expand this into one-dimensional arrays, ArrayList, two-dimensional tables, and tracing recursive methods. This skeleton only introduces the idea so you can try original practice items tagged to those public objective codes.",
      "All wording in this lesson was written for BayAreaClubs. Do not treat this pair of lessons as a full AP Computer Science A course.",
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
