import { z } from "zod";

import {
  containsUnsafeContent,
  sanitizePlainText,
} from "@/lib/validation/communications";

export const LEARNING_SOURCE_BASIS = ["ORIGINAL", "LICENSED_EXTERNAL"] as const;
export type LearningSourceBasis = (typeof LEARNING_SOURCE_BASIS)[number];

export const LEARNING_QUESTION_TYPES = [
  "multiple_choice",
  "short_response",
] as const;

export const LEARNING_PUBLICATION_STATUSES = [
  "draft",
  "review",
  "approved",
  "published",
  "archived",
] as const;
export type LearningPublicationStatus =
  (typeof LEARNING_PUBLICATION_STATUSES)[number];

export const LEARNING_CATALOG_PAGE_SIZE = 12;

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case slug");

const namespaceSchema = slugSchema.max(80);

function plainText(max: number, message: string) {
  return z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !containsUnsafeContent(value), message)
    .refine((value) => !/<[^>]+>/.test(value), message)
    .transform((value) => sanitizePlainText(value));
}

const choiceSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[a-z0-9-]+$/i, "Choice ids must be short alphanumeric tokens"),
  text: plainText(400, "Choice text cannot include HTML."),
});

export const lessonInputSchema = z.object({
  courseId: z.string().uuid(),
  moduleId: z.string().uuid(),
  namespace: namespaceSchema,
  slug: slugSchema,
  position: z.coerce.number().int().min(0).max(500),
  title: plainText(200, "Lesson title cannot include HTML."),
  bodyPlain: plainText(20000, "Lesson body cannot include HTML."),
  estimatedMinutes: z.coerce.number().int().positive().max(100000).optional().nullable(),
  mediaAssetId: z.string().uuid().optional().nullable(),
});

export const questionInputSchema = z
  .object({
    courseId: z.string().uuid(),
    namespace: namespaceSchema,
    moduleId: z.string().uuid().optional().nullable(),
    lessonId: z.string().uuid().optional().nullable(),
    slug: slugSchema,
    prompt: plainText(4000, "Question prompt cannot include HTML."),
    questionType: z.enum(LEARNING_QUESTION_TYPES),
    choices: z.array(choiceSchema).max(8).default([]),
    answerKey: z.record(z.string(), z.unknown()),
    explanation: plainText(4000, "Explanation cannot include HTML.")
      .optional()
      .nullable(),
    objectiveCodes: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    sourceBasis: z.enum(LEARNING_SOURCE_BASIS),
  })
  .superRefine((value, ctx) => {
    if (value.sourceBasis !== "ORIGINAL") {
      ctx.addIssue({
        code: "custom",
        path: ["sourceBasis"],
        message: "Learning questions must be ORIGINAL. Licensed banks are not accepted.",
      });
    }
    if (value.questionType === "multiple_choice") {
      if (value.choices.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["choices"],
          message: "Multiple-choice questions need at least two choices.",
        });
      }
      const choiceId = value.answerKey.choiceId;
      if (typeof choiceId !== "string" || !value.choices.some((choice) => choice.id === choiceId)) {
        ctx.addIssue({
          code: "custom",
          path: ["answerKey"],
          message: "Multiple-choice answer_key.choiceId must match a choice id.",
        });
      }
    }
    if (value.questionType === "short_response") {
      if (value.choices.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["choices"],
          message: "Short-response questions cannot include choices.",
        });
      }
      if (typeof value.answerKey.text !== "string" || !value.answerKey.text.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["answerKey"],
          message: "Short-response answer_key.text is required.",
        });
      }
    }
  });

export const attemptInputSchema = z
  .object({
    questionId: z.string().uuid(),
    courseId: z.string().uuid(),
    choiceId: z.string().trim().min(1).max(32).optional(),
    text: z.string().trim().max(2000).optional(),
  })
  .superRefine((value, ctx) => {
    const hasChoice = Boolean(value.choiceId);
    const hasText = Boolean(value.text);
    if (hasChoice === hasText) {
      ctx.addIssue({
        code: "custom",
        message: "Submit either a choiceId or a short-response text, not both.",
      });
    }
    if (value.text && (containsUnsafeContent(value.text) || /<[^>]+>/.test(value.text))) {
      ctx.addIssue({
        code: "custom",
        path: ["text"],
        message: "Responses cannot include HTML.",
      });
    }
  });

export const reviewTransitionSchema = z.object({
  courseId: z.string().uuid(),
  toStatus: z.enum(["review", "approved", "published", "archived"]),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .refine(
      (value) => !value || (!containsUnsafeContent(value) && !/<[^>]+>/.test(value)),
      "Notes cannot include HTML.",
    )
    .transform((value) => (value ? sanitizePlainText(value) : null)),
});

export const catalogPageSchema = z.object({
  page: z.coerce.number().int().min(1).max(500).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(48)
    .default(LEARNING_CATALOG_PAGE_SIZE),
});

export const similarityCheckSchema = z.object({
  namespace: namespaceSchema,
  prompt: plainText(4000, "Prompt cannot include HTML."),
});

export type LessonInput = z.infer<typeof lessonInputSchema>;
export type QuestionInput = z.infer<typeof questionInputSchema>;
export type AttemptInput = z.infer<typeof attemptInputSchema>;
export type ReviewTransitionInput = z.infer<typeof reviewTransitionSchema>;
