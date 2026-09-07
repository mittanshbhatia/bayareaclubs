import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database.generated";

type PublicationStatus = Database["public"]["Enums"]["publication_status"] | "approved";

type LearningLessonRow = {
  id: string;
  course_id: string;
  module_id: string;
  namespace: string;
  slug: string;
  position: number;
  title: string;
  body_plain: string;
  estimated_minutes: number | null;
  status: PublicationStatus;
  media_asset_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type LearningQuestionRow = {
  id: string;
  course_id: string;
  namespace: string;
  module_id: string | null;
  lesson_id: string | null;
  slug: string;
  prompt: string;
  choices: Json;
  answer_key: Json;
  explanation: string | null;
  question_type: "multiple_choice" | "short_response";
  objective_codes: string[];
  difficulty: Database["public"]["Enums"]["course_difficulty"];
  source_basis: "ORIGINAL" | "LICENSED_EXTERNAL";
  status: PublicationStatus;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type LearningAttemptRow = {
  id: string;
  user_id: string;
  question_id: string;
  course_id: string;
  response: Json;
  is_correct: boolean;
  created_at: string;
};

type LearningReviewEventRow = {
  id: string;
  course_id: string;
  actor_id: string;
  from_status: PublicationStatus;
  to_status: PublicationStatus;
  notes: string | null;
  created_at: string;
};

type SchoolCourseFeatureRow = {
  id: string;
  school_id: string;
  course_id: string;
  is_enabled: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type StemCourseLearningRow = Database["public"]["Tables"]["stem_courses"]["Row"] & {
  course_kind: "stem" | "ap";
  course_namespace: string | null;
  source_basis: "ORIGINAL" | "LICENSED_EXTERNAL";
  framework_code: string | null;
  framework_year: number | null;
  approved_at: string | null;
  approved_by: string | null;
};

type StemModuleLearningRow = Database["public"]["Tables"]["stem_course_modules"]["Row"] & {
  slug: string | null;
};

type PublishedApCourseRow = {
  id: string;
  slug: string;
  course_namespace: string;
  title: string;
  description: string;
  discipline: Database["public"]["Enums"]["stem_discipline"];
  grade_bands: Database["public"]["Enums"]["age_band"][];
  difficulty: Database["public"]["Enums"]["course_difficulty"];
  format: Database["public"]["Enums"]["course_format"] | null;
  estimated_minutes: number | null;
  thumbnail_asset_id: string | null;
  framework_code: string | null;
  framework_year: number | null;
  source_basis: "ORIGINAL" | "LICENSED_EXTERNAL";
  published_at: string;
};

type StudentQuestionRow = Omit<LearningQuestionRow, "answer_key" | "explanation" | "created_by" | "created_at" | "updated_at">;

type AttemptAggregateRow = {
  course_id: string;
  question_id: string;
  attempt_count: number;
  correct_count: number;
  participant_count: number;
};

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type LearningDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables" | "Views" | "Functions" | "Enums"> & {
    Tables: Database["public"]["Tables"] & {
      learning_lessons: TableDef<LearningLessonRow>;
      learning_questions: TableDef<LearningQuestionRow>;
      learning_question_versions: TableDef<{
        id: string;
        question_id: string;
        version: number;
        prompt: string;
        choices: Json;
        answer_key: Json;
        explanation: string | null;
        question_type: string;
        source_basis: string;
        status: PublicationStatus;
        created_by: string | null;
        created_at: string;
      }>;
      learning_attempts: TableDef<LearningAttemptRow>;
      learning_review_events: TableDef<LearningReviewEventRow>;
      school_course_features: TableDef<SchoolCourseFeatureRow>;
      stem_courses: TableDef<
        StemCourseLearningRow,
        Database["public"]["Tables"]["stem_courses"]["Insert"] &
          Partial<StemCourseLearningRow>,
        Database["public"]["Tables"]["stem_courses"]["Update"] &
          Partial<StemCourseLearningRow>
      >;
      stem_course_modules: TableDef<
        StemModuleLearningRow,
        Database["public"]["Tables"]["stem_course_modules"]["Insert"] & {
          slug?: string | null;
        },
        Database["public"]["Tables"]["stem_course_modules"]["Update"] & {
          slug?: string | null;
        }
      >;
    };
    Views: Database["public"]["Views"] & {
      published_ap_courses: TableDef<PublishedApCourseRow>;
      learning_questions_student: TableDef<StudentQuestionRow>;
      learning_attempt_aggregates: TableDef<AttemptAggregateRow>;
    };
    Functions: Database["public"]["Functions"] & {
      record_learning_attempt: {
        Args: { target_question_id: string; response: Json };
        Returns: { attempt_id: string; is_correct: boolean; explanation: string | null }[];
      };
      can_view_learning_aggregates: {
        Args: { target_course_id: string };
        Returns: boolean;
      };
    };
    Enums: Omit<Database["public"]["Enums"], "publication_status"> & {
      publication_status: PublicationStatus;
    };
  };
};

export type LearningCourse = StemCourseLearningRow;
export type LearningModule = StemModuleLearningRow;
export type LearningLesson = LearningLessonRow;
export type LearningQuestion = LearningQuestionRow;
export type StudentQuestion = StudentQuestionRow;
export type LearningAttempt = LearningAttemptRow;
export type LearningReviewEvent = LearningReviewEventRow;
export type PublishedApCourse = PublishedApCourseRow;
export type LearningAttemptAggregate = AttemptAggregateRow;

export async function createLearnClient(): Promise<SupabaseClient<LearningDatabase>> {
  const client = await createClient();
  return client as unknown as SupabaseClient<LearningDatabase>;
}
