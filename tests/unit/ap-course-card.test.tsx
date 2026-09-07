import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApCourseCard } from "@/features/learn/components/ap-course-card";
import {
  CourseSubjectOverlay,
  SUBJECT_OVERLAY_NAMESPACES,
} from "@/features/learn/components/course-card-art";
import { AP_COURSE_REGISTRY } from "@/features/learn/courses/registry";

describe("AP course card anatomy", () => {
  it("renders media, mortarboard title, description, inventory, and progress", () => {
    render(
      <ApCourseCard
        title="AP Calculus AB"
        description="Limits, derivatives, and integrals aligned to public CED objective codes."
        namespace="ap-calc-ab"
        status="shipping"
        href="/dashboard/learn/ap/ap-calc-ab"
        unitCount={8}
        moduleCount={16}
        progressPercent={0}
      />,
    );

    const card = screen.getByRole("link", { name: /AP Calculus AB/i });
    expect(card).toHaveAttribute("href", "/dashboard/learn/ap/ap-calc-ab");
    expect(screen.getByText("AP Calculus AB")).toBeInTheDocument();
    expect(
      screen.getByText(/Limits, derivatives, and integrals/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/8 UNITS/i)).toBeInTheDocument();
    expect(screen.getByText(/16 MODULES/i)).toBeInTheDocument();
    expect(screen.getByText("0% Progress")).toBeInTheDocument();
    expect(card.className).toMatch(/course-card-radius/);
    expect(card.className).toMatch(/course-card-shadow/);
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.queryByText(/BETA|PREVIEW|STABLE/i)).not.toBeInTheDocument();
  });

  it("labels planned titles coming soon without a click target", () => {
    render(
      <ApCourseCard
        title="AP Physics C: Mechanics"
        description="Calculus-based Newtonian mechanics."
        namespace="ap-physics-c-mech"
        status="planned"
      />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/Planned — not published/)).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.queryByText(/BETA|PREVIEW|STABLE/i)).not.toBeInTheDocument();
  });

  it("never shows beta, preview, or stable chips", () => {
    render(
      <ApCourseCard
        title="AP Calculus AB"
        description="Limits and integrals."
        namespace="ap-calc-ab"
        status="shipping"
        href="/dashboard/learn/ap/ap-calc-ab"
      />,
    );

    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.queryByText(/^beta$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^preview$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^stable$/i)).not.toBeInTheDocument();
  });

  it("draws a unique subject overlay for every registry namespace", () => {
    const marks = new Set<string>();
    for (const entry of AP_COURSE_REGISTRY) {
      expect(SUBJECT_OVERLAY_NAMESPACES).toContain(entry.namespace);
      const { container, unmount } = render(
        <CourseSubjectOverlay namespace={entry.namespace} />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("data-course-overlay", entry.namespace);
      const markup = svg?.innerHTML ?? "";
      expect(markup.length).toBeGreaterThan(40);
      expect(marks.has(markup)).toBe(false);
      marks.add(markup);
      unmount();
    }
  });
});
