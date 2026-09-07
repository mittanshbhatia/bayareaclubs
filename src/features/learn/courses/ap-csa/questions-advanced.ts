/**
 * Advanced original AP CSA items. source_basis: ORIGINAL.
 * Not derived from Stellar, College Board, or any other bank.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "compound-cast-remainder-advanced",
    lessonSlug: "primitive-values-and-expressions",
    prompt:
      "A ferry club records leftover life jackets. After these statements run, what is stored in left?\n\ndouble packed = 19.6;\nint crates = 4;\nint left = (int) packed % crates + (int) (packed / crates);",
    choices: ["3", "7", "8", "The statements do not compile."],
    answer: "b",
    explanation:
      "(int) packed is 19. 19 % 4 is 3. packed / crates is 4.9, and (int) of that is 4. 3 + 4 is 7. Casting happens before the remainder on the left term because cast binds tightly to packed, not to the whole remainder expression.",
    codes: ["1.3.C", "1.5.A"],
  }),
  originalItem({
    slug: "alias-then-mutate",
    lessonSlug: "objects-methods-and-control",
    prompt:
      "After these statements, what is printed?\n\nStringBuilder a = new StringBuilder(\"oak\");\nStringBuilder b = a;\nb.append(\" trail\");\nSystem.out.print(a.toString().length());",
    choices: ["3", "9", "10", "A NullPointerException is thrown."],
    answer: "c",
    explanation:
      "b and a refer to the same StringBuilder. append changes that one object. \"oak trail\" has 9 characters plus the space, so length is 10. The common miss is thinking b is a copy.",
    codes: ["1.12.A", "1.13.C"],
  }),
  originalItem({
    slug: "short-circuit-guard",
    lessonSlug: "boolean-choices-and-branches",
    prompt:
      "Which test is safe when tickets may be null and must not throw?\n\nint[] tickets = null;",
    choices: [
      "tickets.length > 0 && tickets[0] == 4",
      "tickets != null && tickets.length > 0 && tickets[0] == 4",
      "tickets[0] == 4 && tickets != null",
      "tickets.length > 0 || tickets != null",
    ],
    answer: "b",
    explanation:
      "&& short-circuits. If tickets is null, the later length and index checks never run. Putting the index test first throws. || does not protect the length read.",
    codes: ["2.2.A", "2.5.A"],
  }),
  originalItem({
    slug: "nested-loop-off-by-one",
    lessonSlug: "loops-and-tracing",
    prompt:
      "How many times does add run?\n\nfor (int r = 1; r <= 3; r++) {\n  for (int c = r; c < 4; c++) {\n    add();\n  }\n}",
    choices: ["6", "7", "9", "12"],
    answer: "a",
    explanation:
      "r=1 runs c=1,2,3 (3). r=2 runs c=2,3 (2). r=3 runs c=3 (1). Total 6. The inner start depends on r, so it is not 3×3.",
    codes: ["2.8.A"],
  }),
  originalItem({
    slug: "constructor-shadow-field",
    lessonSlug: "writing-classes-and-constructors",
    prompt:
      "After new Bench(\"Ferry\", 12), what is seats?\n\npublic class Bench {\n  private String stop;\n  private int seats;\n  public Bench(String stop, int seats) {\n    stop = stop;\n    this.seats = seats;\n  }\n}",
    choices: [
      "stop is Ferry and seats is 12",
      "stop is null and seats is 12",
      "stop is Ferry and seats is 0",
      "The constructor does not compile.",
    ],
    answer: "b",
    explanation:
      "stop = stop assigns the parameter to itself. The field stays null. this.seats = seats does set the field to 12.",
    codes: ["3.1.A", "3.2.A"],
  }),
  originalItem({
    slug: "mutator-refuses-negative",
    lessonSlug: "encapsulation-and-methods",
    prompt:
      "reserve(-2) is called when seatsLeft is 9. What is seatsLeft afterward if reserve returns false when wanted is not positive?",
    choices: ["7", "9", "11", "0"],
    answer: "b",
    explanation:
      "A guarded mutator refuses a non-positive request and leaves the field unchanged. Subtracting would be a bug.",
    codes: ["3.4.A", "3.5.A"],
  }),
  originalItem({
    slug: "arraylist-shift-trace",
    lessonSlug: "arrays-and-arraylists",
    prompt:
      "After add(\"Nia\"); add(\"Omar\"); add(1, \"Pia\"); remove(2); what is get(1)?",
    choices: ["Nia", "Omar", "Pia", "An exception is thrown."],
    answer: "c",
    explanation:
      "The list becomes Nia, Omar; insert Pia at 1 → Nia, Pia, Omar; remove index 2 deletes Omar → Nia, Pia. get(1) is Pia.",
    codes: ["4.8.A", "4.9.A"],
  }),
  originalItem({
    slug: "recursion-unfold-sum",
    lessonSlug: "two-d-arrays-and-recursion-tracing",
    prompt:
      "fold(8) returns n + fold(n - 3) when n > 2 and returns n otherwise. What is fold(8)?",
    choices: ["8", "11", "15", "The calls never end."],
    answer: "c",
    explanation:
      "fold(8) = 8 + fold(5); fold(5) = 5 + fold(2); fold(2) = 2. 8 + 5 + 2 = 15.",
    codes: ["4.16.A"],
  }),
] as const;
