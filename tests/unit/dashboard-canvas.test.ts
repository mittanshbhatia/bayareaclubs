import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("dashboard canvas", () => {
  it("binds the dashboard shell to the courses learning background token", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    const shell = readFileSync(
      resolve(process.cwd(), "src/components/dashboard/shell.tsx"),
      "utf8",
    );

    expect(css).toContain("--learning-background: #f8fafc");
    expect(css).toContain("[data-dashboard-shell]");
    expect(css).toContain("--background: var(--learning-background)");
    expect(shell).toContain("data-dashboard-shell");
    expect(shell).toContain("bg-learning-background");
  });
});
