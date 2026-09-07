import { describe, expect, it } from "vitest";

import {
  buildMyDayItems,
  buildQuickActions,
  clubWorkspaceHref,
  ideaNeedsAction,
  learningCatalogLinks,
  pickNextVisibleEvent,
  selectIdeaNeedingAction,
  selectNextApLearning,
  selectNextLearning,
  wouldPassSchoolDashboardAccess,
} from "@/features/dashboard/personal";

describe("personal dashboard club links", () => {
  it("sends officers to the existing club command center", () => {
    expect(
      clubWorkspaceHref("president", {
        id: "club-1",
        name: "Robotics",
        slug: "robotics",
      }),
    ).toBe("/clubs/robotics");
  });

  it("sends members to the existing attendance path", () => {
    expect(
      clubWorkspaceHref("member", {
        id: "club-1",
        name: "Robotics",
        slug: "robotics",
      }),
    ).toBe("/dashboard/clubs/club-1/attendance");
  });

  it("does not invent a href without a club id", () => {
    expect(clubWorkspaceHref("member", { name: "Ghost" })).toBeNull();
  });
});

describe("personal dashboard authorization gates", () => {
  it("allows school dashboard only for staff-equivalent roles or platform admin", () => {
    expect(
      wouldPassSchoolDashboardAccess({
        isPlatformAdmin: false,
        schoolRole: "student",
      }),
    ).toBe(false);
    expect(
      wouldPassSchoolDashboardAccess({
        isPlatformAdmin: false,
        schoolRole: "school_admin",
      }),
    ).toBe(true);
    expect(
      wouldPassSchoolDashboardAccess({
        isPlatformAdmin: false,
        schoolRole: "staff",
      }),
    ).toBe(true);
    expect(
      wouldPassSchoolDashboardAccess({
        isPlatformAdmin: true,
        schoolRole: "student",
      }),
    ).toBe(true);
  });

  it("never emits unauthorized admin, review, or school actions", () => {
    const studentActions = buildQuickActions({
      isPlatformAdmin: false,
      isCommitteeReviewer: false,
      schools: [{ id: "school-1", name: "Lincoln", role: "student" }],
    });
    expect(studentActions.map((action) => action.id)).toEqual(["start-idea"]);
    expect(studentActions.some((action) => action.href.startsWith("/admin"))).toBe(
      false,
    );
    expect(
      studentActions.some((action) => action.href.includes("/dashboard/schools/")),
    ).toBe(false);
  });

  it("adds review queue for committee reviewers and admin only for platform admins", () => {
    const reviewer = buildQuickActions({
      isPlatformAdmin: false,
      isCommitteeReviewer: true,
      schools: [],
    });
    expect(reviewer.map((action) => action.id)).toEqual([
      "start-idea",
      "review-queue",
    ]);
    expect(reviewer.find((action) => action.id === "admin")).toBeUndefined();

    const admin = buildQuickActions({
      isPlatformAdmin: true,
      isCommitteeReviewer: true,
      schools: [{ id: "school-1", name: "Lincoln", role: "school_advisor" }],
    });
    expect(admin.map((action) => action.id)).toEqual([
      "start-idea",
      "review-queue",
      "admin",
      "school-school-1",
    ]);
    expect(admin.find((action) => action.id === "school-school-1")?.href).toBe(
      "/dashboard/schools/school-1",
    );

    const platformOnly = buildQuickActions({
      isPlatformAdmin: true,
      isCommitteeReviewer: false,
      schools: [],
    });
    expect(platformOnly.map((action) => action.id)).toEqual([
      "start-idea",
      "review-queue",
      "admin",
    ]);
  });
});

describe("personal dashboard my day", () => {
  it("treats draft and changes-requested ideas as needing action", () => {
    expect(ideaNeedsAction("draft")).toBe(true);
    expect(ideaNeedsAction("changes_requested")).toBe(true);
    expect(ideaNeedsAction("approved")).toBe(false);
    expect(
      selectIdeaNeedingAction([
        { id: "a", title: "Draft", status: "draft" },
        { id: "b", title: "Fix", status: "changes_requested" },
        { id: "c", title: "Done", status: "approved" },
      ])?.id,
    ).toBe("b");
  });

  it("prefers an RSVP'd upcoming event over a later visible club event", () => {
    const later = Date.now() + 48 * 60 * 60 * 1000;
    const sooner = Date.now() + 2 * 60 * 60 * 1000;
    const next = pickNextVisibleEvent([
      {
        id: "club-open",
        startsAt: new Date(sooner).toISOString(),
        rsvpStatus: null,
      },
      {
        id: "rsvp",
        startsAt: new Date(later).toISOString(),
        rsvpStatus: "going",
      },
    ]);
    expect(next?.id).toBe("rsvp");
  });

  it("returns an empty my-day list when nothing is next", () => {
    expect(
      buildMyDayItems({ nextEvent: null, idea: null, learning: null }),
    ).toEqual([]);
  });

  it("composes real next items without inventing hrefs", () => {
    const items = buildMyDayItems({
      nextEvent: {
        id: "evt-1",
        title: "Build Night",
        startsAt: "2026-09-08T01:00:00.000Z",
        clubName: "Robotics",
        href: null,
        rsvpStatus: "going",
      },
      idea: { id: "idea-1", title: "Chess Club", status: "changes_requested" },
      learning: {
        subscriptionId: "sub-1",
        title: "Intro Python",
        href: "/resources/intro-python",
        status: "active",
        completedCount: 2,
        nextLessonTitle: "Lists",
        kind: "stem",
      },
    });
    expect(items).toHaveLength(3);
    expect(items[0]?.href).toBeNull();
    expect(items[1]?.href).toBe("/start-a-club/idea-1");
    expect(items[2]?.href).toBe("/resources/intro-python");
  });

  it("selects the next STEM lesson when a published outline remains", () => {
    const next = selectNextLearning([
      {
        subscription: { id: "sub-done", status: "completed" },
        course: { title: "Finished", slug: "finished" },
        nextResource: null,
        completedCount: 4,
      },
      {
        subscription: { id: "sub-next", status: "active" },
        course: { title: "Python", slug: "python" },
        nextResource: { title: "Loops" },
        completedCount: 1,
      },
    ]);
    expect(next).toMatchObject({
      subscriptionId: "sub-next",
      href: "/resources/python",
      nextLessonTitle: "Loops",
      kind: "stem",
    });
  });

  it("selects a real AP progress row only when a namespace exists", () => {
    expect(
      selectNextApLearning([{ title: "Missing", namespace: "", attemptCount: 2 }]),
    ).toBeNull();
    expect(
      selectNextApLearning([
        { title: "AP CSP", namespace: "ap-csp", attemptCount: 3 },
      ]),
    ).toMatchObject({
      href: "/dashboard/learn/ap/ap-csp",
      kind: "ap",
    });
  });
});

describe("personal dashboard learning links", () => {
  it("omits the AP catalog when that route does not exist", () => {
    expect(learningCatalogLinks({ apLearnRouteExists: false })).toEqual([
      { href: "/resources", label: "STEM catalog" },
    ]);
  });

  it("adds the AP catalog only when the route exists", () => {
    expect(
      learningCatalogLinks({ apLearnRouteExists: true }).map((link) => link.href),
    ).toEqual(["/courses", "/resources"]);
  });
});
