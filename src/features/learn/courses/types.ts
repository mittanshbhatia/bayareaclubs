export type CourseLoaderStatus = "planned" | "shipping";

export type CourseToolKind =
  | "practice"
  | "quiz"
  | "review"
  | "notes"
  | "readiness";

export type CourseTool = {
  kind: CourseToolKind;
  slug: string;
  title: string;
  description: string;
  questionSlugs?: readonly string[];
  lessonSlugs?: readonly string[];
};

export type CourseManifest = {
  namespace: string;
  title: string;
  description: string;
  frameworkCode?: string;
  frameworkYear?: number;
  discipline?:
    | "computer_science"
    | "mathematics"
    | "physics"
    | "chemistry"
    | "biology"
    | "earth_science"
    | "other";
  units: Array<{
    slug: string;
    title: string;
    description?: string;
    estimatedMinutes?: number;
    lessons: Array<{
      slug: string;
      title: string;
      estimatedMinutes?: number;
    }>;
  }>;
};

export type LoaderLesson = {
  slug: string;
  title: string;
  unitSlug: string;
  position: number;
  estimatedMinutes?: number;
  bodyPlain: string;
};

export type LoaderQuestion = {
  slug: string;
  lessonSlug: string | null;
  prompt: string;
  choices: ReadonlyArray<{ id: string; text: string }>;
  answerId: string;
  explanation: string;
  questionType?: "multiple_choice" | "short_response";
  objectiveCodes?: readonly string[];
  difficulty?: string;
};

export type CourseContentBundle = {
  manifest: CourseManifest;
  lessons?: readonly LoaderLesson[];
  questions?: readonly LoaderQuestion[];
  tools?: readonly CourseTool[];
};

export type CourseLoader = () => Promise<CourseContentBundle>;
