export type CourseLoaderStatus = "planned" | "shipping";

export type CourseManifest = {
  namespace: string;
  title: string;
  description: string;
  frameworkCode?: string;
  frameworkYear?: number;
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
};

export type CourseLoader = () => Promise<CourseContentBundle>;
