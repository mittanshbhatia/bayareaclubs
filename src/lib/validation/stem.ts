import { z } from "zod";

export const STEM_DISCIPLINES = [
  "computer_science",
  "ai_ml",
  "competitive_programming",
  "mathematics",
  "physics",
  "chemistry",
  "biology",
  "engineering",
  "robotics",
  "astronomy",
  "earth_science",
  "cybersecurity",
  "data_science",
  "other",
] as const;

export const STEM_DISCIPLINE_LABELS: Record<(typeof STEM_DISCIPLINES)[number], string> = {
  computer_science: "Computer Science",
  ai_ml: "AI & ML",
  competitive_programming: "Competitive Programming",
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  engineering: "Engineering",
  robotics: "Robotics",
  astronomy: "Astronomy",
  earth_science: "Earth Science",
  cybersecurity: "Cybersecurity",
  data_science: "Data Science",
  other: "Other",
};

export const COURSE_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const COURSE_DIFFICULTY_LABELS: Record<(typeof COURSE_DIFFICULTIES)[number], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const COURSE_FORMATS = [
  "self_paced",
  "video",
  "interactive",
  "reading",
  "project",
  "mixed",
] as const;
export const COURSE_FORMAT_LABELS: Record<(typeof COURSE_FORMATS)[number], string> = {
  self_paced: "Self-paced",
  video: "Video",
  interactive: "Interactive",
  reading: "Reading",
  project: "Project",
  mixed: "Mixed",
};

export const GRADE_BANDS = ["under_13", "age_13_17", "adult"] as const;
export const GRADE_BAND_LABELS: Record<(typeof GRADE_BANDS)[number], string> = {
  under_13: "Elementary / middle",
  age_13_17: "High school",
  adult: "College / adult",
};

export const EFFORT_BUCKETS = ["under_60", "60_300", "over_300"] as const;
export const EFFORT_BUCKET_LABELS: Record<(typeof EFFORT_BUCKETS)[number], string> = {
  under_60: "Under 1 hour",
  "60_300": "1–5 hours",
  over_300: "5+ hours",
};

export const COURSE_STATUSES = [
  "draft",
  "review",
  "published",
  "archived",
] as const;

export const RESOURCE_TYPES = [
  "article",
  "video",
  "document",
  "exercise",
  "external_link",
  "project",
  "dataset",
] as const;

const httpsUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith("https://"), "URL must use https://");

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case slug");

export const catalogFilterSchema = z.object({
  q: z.string().trim().max(120).optional(),
  discipline: z.enum(STEM_DISCIPLINES).optional(),
  difficulty: z.enum(COURSE_DIFFICULTIES).optional(),
  format: z.enum(COURSE_FORMATS).optional(),
  gradeBand: z.enum(GRADE_BANDS).optional(),
  effort: z.enum(EFFORT_BUCKETS).optional(),
});

export const subscribeCourseSchema = z.object({
  courseId: z.string().uuid(),
});

export const markResourceProgressSchema = z.object({
  courseId: z.string().uuid(),
  resourceId: z.string().uuid(),
  completed: z.boolean(),
});

export const recommendCourseSchema = z.object({
  clubId: z.string().uuid(),
  courseId: z.string().uuid(),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export const removeRecommendationSchema = z.object({
  clubId: z.string().uuid(),
  recommendationId: z.string().uuid(),
});

export const collectionFormSchema = z.object({
  clubId: z.string().uuid(),
  collectionId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  courseIds: z.array(z.string().uuid()).max(40).default([]),
});

export const archiveCollectionSchema = z.object({
  clubId: z.string().uuid(),
  collectionId: z.string().uuid(),
});

export const adminCourseSchema = z.object({
  courseId: z.string().uuid().optional(),
  slug: slugSchema,
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(8000),
  discipline: z.enum(STEM_DISCIPLINES),
  gradeBands: z.array(z.enum(GRADE_BANDS)).min(1).max(3),
  difficulty: z.enum(COURSE_DIFFICULTIES),
  format: z.enum(COURSE_FORMATS),
  estimatedMinutes: z.coerce.number().int().positive().max(100000).optional().nullable(),
  providerName: z.string().trim().min(1).max(160),
  sourceUrl: httpsUrl,
  licenseName: z.string().trim().min(1).max(120),
  licenseUrl: httpsUrl.optional().nullable().or(z.literal("")),
  lastVerifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isFree: z.literal(true),
  modules: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().trim().min(1).max(200),
        description: z.string().trim().max(2000).optional().or(z.literal("")),
        estimatedMinutes: z.coerce.number().int().positive().max(100000).optional().nullable(),
        resources: z
          .array(
            z.object({
              id: z.string().uuid().optional(),
              title: z.string().trim().min(1).max(200),
              description: z.string().trim().max(2000).optional().or(z.literal("")),
              resourceType: z.enum(RESOURCE_TYPES),
              externalUrl: httpsUrl.optional().nullable().or(z.literal("")),
              estimatedMinutes: z.coerce
                .number()
                .int()
                .positive()
                .max(100000)
                .optional()
                .nullable(),
            }),
          )
          .min(1)
          .max(40),
      }),
    )
    .min(1)
    .max(40),
});

export const adminCourseStatusSchema = z.object({
  courseId: z.string().uuid(),
  status: z.enum(COURSE_STATUSES),
});

export type CatalogFilters = z.infer<typeof catalogFilterSchema>;
export type AdminCourseInput = z.infer<typeof adminCourseSchema>;

export function formatEffortMinutes(minutes: number | null | undefined) {
  if (!minutes) return "Effort varies";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round((minutes / 60) * 10) / 10;
  return hours === 1 ? "1 hour" : `${hours} hours`;
}
