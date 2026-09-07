import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  isLearningAiEnabled,
  requestLearningAssistance,
} from "@/features/learn/ai-stub";
import type { StudentQuestion } from "@/features/learn/database";
import {
  assertLearningTransition,
  isStudentVisibleStatus,
} from "@/features/learn/workflow";
import { LEARNING_PUBLICATION_STATUSES } from "@/lib/validation/learn";
import { COURSE_STATUSES } from "@/lib/validation/stem";

const LEARNER_VISIBLE_STATUSES = new Set(["published"]);

type StudentQuestionLeaksKey = "answer_key" extends keyof StudentQuestion
  ? true
  : false;

function srcFile(...parts: string[]) {
  return path.join(process.cwd(), "src", ...parts);
}

function walkTsFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkTsFiles(full));
      continue;
    }
    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

const PROVIDER_IMPORT =
  /from\s+["']openai["']|from\s+["']@openai\/|from\s+["']@anthropic-ai\/|from\s+["']anthropic["']|new\s+OpenAI\b|Anthropic\(/;

describe("learning hostile authorization (all DENY)", () => {
  describe("AM-06 unpublished AP / STEM content", () => {
    it("treats only published as learner-visible", () => {
      for (const status of LEARNING_PUBLICATION_STATUSES) {
        expect(isStudentVisibleStatus(status)).toBe(status === "published");
      }
      for (const hidden of ["draft", "review", "scheduled", "approved", "archived"]) {
        expect(LEARNER_VISIBLE_STATUSES.has(hidden)).toBe(false);
      }
      for (const status of COURSE_STATUSES) {
        if (status !== "published") {
          expect(LEARNER_VISIBLE_STATUSES.has(status)).toBe(false);
        }
      }
    });

    it("denies skip-to-publish and draft→approved shortcuts", () => {
      expect(assertLearningTransition("draft", "published").ok).toBe(false);
      expect(assertLearningTransition("draft", "approved").ok).toBe(false);
      expect(assertLearningTransition("review", "published").ok).toBe(false);
      expect(assertLearningTransition("approved", "published").ok).toBe(true);
    });

    it("public STEM catalog uses published_stem_courses", () => {
      const source = readFileSync(srcFile("features/stem/queries.ts"), "utf8");
      expect(source).toMatch(
        /export async function listPublishedCourses[\s\S]{0,200}from\("published_stem_courses"\)/,
      );
      expect(source).toMatch(
        /export async function getPublishedCourseBySlug[\s\S]{0,200}from\("published_stem_courses"\)/,
      );
    });

    it("non-admin AP course reads use published views and published lessons", () => {
      const source = readFileSync(srcFile("features/learn/queries.ts"), "utf8");
      expect(source).toContain("published_ap_courses");
      expect(source).toMatch(/lessonsQuery = lessonsQuery\.eq\("status", "published"\)/);
      expect(source).not.toMatch(
        /lessonsQuery = lessonsQuery\.in\("status",\s*\[[^\]]*"approved"/,
      );
    });
  });

  describe("AM-07 other student's attempts", () => {
    it("own-progress helper scopes attempts to the session user", () => {
      const source = readFileSync(srcFile("features/learn/queries.ts"), "utf8");
      expect(source).toMatch(
        /export async function getMyLearnProgress[\s\S]+eq\("user_id", user\.id\)/,
      );
    });

    it("listMyAttempts always includes a user_id filter (RLS DENYs a foreign id)", () => {
      const source = readFileSync(srcFile("features/learn/queries.ts"), "utf8");
      expect(source).toMatch(
        /export async function listMyAttempts[\s\S]+eq\("user_id", userId\)/,
      );
      expect(source).not.toMatch(
        /from\("learning_attempts"\)[\s\S]{0,200}neq\("user_id"/,
      );
    });
  });

  describe("AM-08 answer keys leaked", () => {
    it("student question type omits answer_key", () => {
      const leaks: StudentQuestionLeaksKey = false;
      expect(leaks).toBe(false);
    });

    it("student question reader uses learning_questions_student, not answer_key", () => {
      const source = readFileSync(srcFile("features/learn/queries.ts"), "utf8");
      expect(source).toContain("listStudentQuestions");
      expect(source).toContain("learning_questions_student");
      const studentFn = source.slice(
        source.indexOf("export async function listStudentQuestions"),
        source.indexOf("export async function listMyAttempts"),
      );
      expect(studentFn).not.toContain("answer_key");
      expect(studentFn).toContain('eq("status", "published")');
    });

    it("answer-key authoring files are not imported by client modules", () => {
      const clientFiles = walkTsFiles(srcFile("")).filter((file) =>
        readFileSync(file, "utf8").includes('"use client"'),
      );
      const offenders = clientFiles.filter((file) => {
        const source = readFileSync(file, "utf8");
        return (
          source.includes("answer_key") ||
          source.includes("ap-csa/questions") ||
          source.includes("ap-csp/questions")
        );
      });
      expect(offenders).toEqual([]);
    });
  });

  describe("AM-11 AI stub / provider clients", () => {
    it("does not import an OpenAI or Anthropic app client from src/", () => {
      const offenders = walkTsFiles(srcFile("")).filter((file) =>
        PROVIDER_IMPORT.test(readFileSync(file, "utf8")),
      );
      expect(offenders).toEqual([]);
    });

    it("does not document provider keys for the Next app", () => {
      const example = readFileSync(
        path.join(process.cwd(), ".env.example"),
        "utf8",
      );
      expect(example).not.toMatch(/OPENAI_API_KEY|ANTHROPIC_/);
    });

    it("AI stub is disabled and cannot publish, grade, or escalate", async () => {
      expect(isLearningAiEnabled()).toBe(false);
      const denied = await requestLearningAssistance({
        namespace: "ap-csa",
        prompt: "grade this other student",
      });
      expect(denied.ok).toBe(false);
      if (!denied.ok) {
        expect(denied.error.code).toBe("AI_UNAVAILABLE");
        expect(denied.error.message.toLowerCase()).toMatch(
          /cannot publish|change grades|change permissions|another student/,
        );
      }
      const source = readFileSync(srcFile("features/learn/ai-stub.ts"), "utf8");
      expect(source).not.toMatch(/from\(["']openai["']|from\(["']@anthropic/);
      expect(source).not.toMatch(/status:\s*["']published["']/);
      expect(source).not.toMatch(/learning_attempts|platform_role_assignments/);
    });
  });
});
