import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("design-system production guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("calls notFound when NODE_ENV is production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const notFound = vi.fn(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
    vi.doMock("next/navigation", () => ({ notFound }));

    const { default: DesignSystemLayout } = await import(
      "@/app/design-system/layout"
    );

    expect(() =>
      DesignSystemLayout({ children: null }),
    ).toThrowError("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledOnce();
  });

  it("renders children when not in production", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const notFound = vi.fn();
    vi.doMock("next/navigation", () => ({ notFound }));

    const { default: DesignSystemLayout } = await import(
      "@/app/design-system/layout"
    );

    render(
      <DesignSystemLayout>
        <span>showcase</span>
      </DesignSystemLayout>,
    );

    expect(notFound).not.toHaveBeenCalled();
    expect(screen.getByText("showcase")).toBeInTheDocument();
  });
});
