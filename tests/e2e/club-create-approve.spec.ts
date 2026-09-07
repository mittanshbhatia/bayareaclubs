import { expect, test, type Page } from "@playwright/test";

import {
  e2eAccounts,
  signInAsAdmin,
  signInAsStudent,
  signOut,
} from "./helpers/auth";

test.describe.configure({ mode: "serial" });

const stamp = Date.now().toString(36);
const clubs = [
  {
    title: `Peninsula Robotics Collective ${stamp}`,
    kind: "new_idea" as const,
    category: "STEM",
    description:
      "A student-built robotics lab for weekly design, fabrication, and competition prep.",
    mission:
      "Grow engineering confidence through collaborative robot builds and outreach.",
    problem:
      "Students need a structured after-school place to practice robotics with mentors.",
    activities: ["Weekly build nights", "Competition scrimmages", "STEM outreach"],
    membership: "28",
    gradeMin: "9",
    gradeMax: "12",
    officer: "Alex Rivera",
    officerRole: "president",
    cadence: "Wednesdays 3:30-5:00 PM in the engineering lab",
    linkTitle: "Team handbook",
    linkUrl: "https://bayareaclubs.example/robotics-handbook",
  },
  {
    title: `Bay Service Alliance ${stamp}`,
    kind: "new_idea" as const,
    category: "Service",
    description:
      "A service club that organizes campus food drives, tutoring, and neighborhood cleanups.",
    mission:
      "Connect students with recurring service projects that stay accountable to our school.",
    problem:
      "Volunteer opportunities are scattered and hard for new students to join consistently.",
    activities: ["Monthly food drives", "Peer tutoring", "Park restoration days"],
    membership: "40",
    gradeMin: "9",
    gradeMax: "12",
    officer: "Jordan Chen",
    officerRole: "secretary",
    cadence: "Tuesdays 3:15-4:15 PM in Room 204",
    linkTitle: "Service calendar",
    linkUrl: "https://bayareaclubs.example/service-calendar",
  },
  {
    title: `Harbor Jazz Ensemble ${stamp}`,
    kind: "existing_club" as const,
    category: "Arts",
    description:
      "An existing jazz ensemble moving its roster, rehearsals, and performances onto BayAreaClubs.",
    mission:
      "Keep a working student jazz band rehearsing, performing, and mentoring younger players.",
    problem:
      "The ensemble needs a shared workspace for attendance, events, and officer handoff.",
    activities: ["Sectionals", "Combo rehearsals", "Campus concerts"],
    membership: "22",
    gradeMin: "9",
    gradeMax: "12",
    officer: "Sam Okonkwo",
    officerRole: "vice_president",
    cadence: "Thursdays 4:00-5:30 PM in the band room",
    linkTitle: "Rehearsal notes",
    linkUrl: "https://bayareaclubs.example/jazz-rehearsals",
  },
] as const;

async function fillWizard(page: Page, club: (typeof clubs)[number]) {
  await expect(page.getByRole("heading").first()).toBeVisible();

  await page.getByLabel(/club idea title|current club name/i).fill(club.title);
  await page.getByLabel("Category").selectOption(club.category);
  await page
    .getByLabel(/short description|tell us about your existing club/i)
    .fill(club.description);
  await page.getByRole("button", { name: "Continue" }).click();

  const school = page.getByLabel("School");
  await expect(school).toBeVisible();
  const optionCount = await school.locator("option").count();
  expect(optionCount).toBeGreaterThan(20);
  const schoolValue = await school
    .locator("option")
    .filter({ hasText: "BayAreaClubs Demo High School" })
    .first()
    .getAttribute("value");
  expect(schoolValue).toBeTruthy();
  await school.selectOption(schoolValue!);
  await expect(page.getByText("Draft saved")).toBeVisible({ timeout: 20_000 });
  await expect
    .poll(async () => page.url(), { timeout: 15_000 })
    .toMatch(/\/start-a-club\/[0-9a-f-]{36}/);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel(/mission|current mission/i).fill(club.mission);
  await page
    .getByLabel(/problem or opportunity|what support does your club need/i)
    .fill(club.problem);
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByLabel(/planned activities|current and planned activities/i)
    .fill(club.activities.join("\n"));
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByLabel(/expected membership|current or expected membership/i)
    .fill(club.membership);
  await page.getByLabel("Grade min").fill(club.gradeMin);
  await page.getByLabel("Grade max").fill(club.gradeMax);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Add officer" }).click();
  await page.getByPlaceholder("Officer name").fill(club.officer);
  await page.locator("select").first().selectOption(club.officerRole);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByLabel(/meeting plan|current meeting schedule/i)
    .fill(club.cadence);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Add supporting link" }).click();
  await page.getByPlaceholder("Title").fill(club.linkTitle);
  await page.getByPlaceholder("https://...").fill(club.linkUrl);
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: club.title }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: /submit new club idea|submit existing club/i,
    })
    .click();
  await expect(page.getByText(/application submitted/i)).toBeVisible({
    timeout: 20_000,
  });
}

async function approveIdea(page: Page, title: string) {
  await page.goto("/admin/ideas");
  await page.getByRole("link", { name: title }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  const reviewer = page.locator("#assign-reviewer");
  const adminValue = await reviewer
    .locator("option")
    .filter({ hasText: /platform/i })
    .first()
    .getAttribute("value");
  if (adminValue) {
    await reviewer.selectOption(adminValue);
  }
  await page.getByRole("button", { name: "Assign Reviewer" }).click();
  await expect(page.getByText("Updated")).toBeVisible();

  const start = page.getByRole("button", { name: "Start Review" });
  if (await start.isVisible()) {
    await start.click();
    await expect(page.getByText("Updated")).toBeVisible();
  }

  await page.getByRole("button", { name: "Approve" }).click();
  await expect(page.getByText("Updated")).toBeVisible();
}

async function convertApprovedClub(page: Page, title: string) {
  await page.goto("/start-a-club");
  await page.getByRole("link", { name: title }).click();
  await expect(page.getByRole("heading", { name: "Create club" })).toBeVisible();
  await page.getByLabel(/I confirm these details/i).check();
  await page.getByRole("button", { name: /create club and continue/i }).click();
  await page.waitForURL(/\/dashboard\/clubs\/[^/]+\/onboarding/, {
    timeout: 30_000,
  });
}

test("student creates three clubs and admin approves them", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Full create-and-approve workflow is covered on desktop.");
  test.setTimeout(360_000);

  await signInAsStudent(page);
  await expect(page).toHaveURL(/\/dashboard/);

  const homeCanvas = await page
    .locator("[data-dashboard-shell]")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  await page.goto("/courses");
  const coursesCanvas = await page
    .locator("[data-dashboard-shell]")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(homeCanvas).toBe(coursesCanvas);

  for (const club of clubs) {
    const path = club.kind === "existing_club" ? "?path=existing" : "";
    await page.goto(`/start-a-club/new${path}`);
    await fillWizard(page, club);
  }

  await signOut(page);
  await signInAsAdmin(page);
  await page.goto("/admin");
  await expect(page.getByRole("heading").first()).toBeVisible();

  const adminCanvas = await page
    .locator("[data-dashboard-shell]")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(adminCanvas).toBe(coursesCanvas);

  for (const club of clubs) {
    await approveIdea(page, club.title);
  }

  await signOut(page);
  await signInAsStudent(page);

  for (const club of clubs) {
    await convertApprovedClub(page, club.title);
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: club.title })).toBeVisible();
  }

  expect(e2eAccounts.studentEmail).toContain("@gmail.com");
  expect(e2eAccounts.adminEmail).toContain("platform-admin");
});
