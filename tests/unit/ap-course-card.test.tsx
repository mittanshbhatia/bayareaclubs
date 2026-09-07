import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApCourseCard } from "@/features/learn/components/ap-course-card";

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
    expect(screen.getByText(/8 units/i)).toBeInTheDocument();
    expect(screen.getByText(/16 modules/i)).toBeInTheDocument();
    expect(screen.getByText("0% Progress")).toBeInTheDocument();
    expect(card.className).toMatch(/course-card-radius/);
    expect(card.className).toMatch(/course-card-shadow/);
    expect(screen.queryByText(/BETA|PREVIEW/i)).not.toBeInTheDocument();
  });

  it("does not invent a status chip or a click target for planned titles", () => {
    render(
      <ApCourseCard
        title="AP Physics C: Mechanics"
        description="Calculus-based Newtonian mechanics."
        namespace="ap-physics-c-mech"
        status="planned"
        statusChip={null}
      />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/Planned — not published/)).toBeInTheDocument();
    expect(screen.queryByText(/BETA|PREVIEW/i)).not.toBeInTheDocument();
  });
});
