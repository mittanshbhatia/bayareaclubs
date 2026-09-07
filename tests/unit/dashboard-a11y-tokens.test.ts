import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const LEARNING_CSS_VARIABLES = [
  "--learning-background",
  "--learning-surface",
  "--course-accent",
  "--progress-track",
  "--progress-fill",
  "--course-border",
  "--course-title",
  "--course-muted",
  "--course-success",
  "--course-units-bg",
  "--course-units-fg",
  "--course-modules-bg",
  "--course-modules-fg",
  "--catalog-nav-selected-bg",
  "--catalog-nav-selected-fg",
] as const;

const PURPLE_BUTTON_UTILITIES = [
  "--button-purple",
  "--btn-purple",
  "--learning-purple",
  ".btn-purple",
  ".button-purple",
] as const;

const PENINSULA_SOURCES = [
  "var(--primary)",
  "var(--accent)",
  "var(--success)",
  "var(--background)",
  "var(--surface)",
  "var(--border)",
  "var(--muted-foreground)",
] as const;

function readRepoFile(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

function hasCssVariable(source: string, token: string) {
  return new RegExp(`${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(
    source,
  );
}

describe("dashboard learning a11y tokens", () => {
  const globalsCss = readRepoFile("src/app/globals.css");
  const designTokens = readRepoFile("src/lib/design-tokens.ts");
  const tokenSources = `${globalsCss}\n${designTokens}`;

  it("uses the owner catalog canvas and blue/violet inventory tokens", () => {
    expect(globalsCss).toMatch(/--learning-background:\s*#f8fafc/i);
    expect(globalsCss).toMatch(/--course-units-bg:\s*#e0f2fe/i);
    expect(globalsCss).toMatch(/--course-units-fg:\s*#0284c7/i);
    expect(globalsCss).toMatch(/--course-modules-bg:\s*#f3e8ff/i);
    expect(globalsCss).toMatch(/--course-modules-fg:\s*#9333ea/i);
    expect(globalsCss).toMatch(/--course-title:\s*#111827/i);
    expect(globalsCss).toMatch(/--course-muted:\s*#4b5563/i);
    expect(globalsCss).toMatch(/--course-media-aspect:\s*3\s*\/\s*1/);
    expect(globalsCss).toMatch(/--catalog-nav-selected-fg:\s*var\(--info\)/);
  });

  it("defines the contract learning CSS variables", () => {
    for (const token of LEARNING_CSS_VARIABLES) {
      expect(
        hasCssVariable(tokenSources, token),
        `${token} must exist in globals.css or design-tokens.ts`,
      ).toBe(true);
    }
  });

  it("does not require a purple button utility", () => {
    expect(LEARNING_CSS_VARIABLES).not.toEqual(
      expect.arrayContaining([...PURPLE_BUTTON_UTILITIES]),
    );
    expect(
      PURPLE_BUTTON_UTILITIES.every((name) => !tokenSources.includes(name)),
    ).toBe(true);
  });

  it("derives learning colors from Peninsula tokens when values are present", () => {
    const declared = LEARNING_CSS_VARIABLES.filter((token) =>
      hasCssVariable(globalsCss, token),
    );
    if (declared.length === 0) {
      return;
    }

    const learningBlock = declared
      .map((token) => {
        const match = globalsCss.match(
          new RegExp(`${token.replace(/-/g, "\\-")}\\s*:\\s*([^;]+);`),
        );
        return match?.[1] ?? "";
      })
      .join(" ");

    if (learningBlock.trim().length === 0) {
      return;
    }

    expect(
      PENINSULA_SOURCES.some((source) => learningBlock.includes(source)),
    ).toBe(true);
  });
});
