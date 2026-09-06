"use client";

import * as React from "react";
import { motion } from "motion/react";
import type { DateRangeValue } from "@/components/ds/date-range-picker";
import {
  ActivityTimeline,
  AvatarStack,
  ChartCard,
  ClubCard,
  CourseCard,
  DataCard,
  DataTable,
  DateRangePicker,
  DisplayHeading,
  EmptyState,
  ErrorState,
  EventCard,
  Eyebrow,
  FilterBar,
  InsightCallout,
  LoadingSkeleton,
  MediaCard,
  MetricCard,
  PageContainer,
  RoleBadge,
  SearchCommand,
  Section,
  SectionHeader,
  StatusBadge,
  WorkflowStepper,
} from "@/components/ds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { designSystemMeta } from "@/lib/design-tokens";
import { dsTransition, fadeInUp } from "@/lib/motion";

const VIEWPORTS = [375, 768, 1024, 1440, 1920] as const;

const samplePeople = [
  { id: "1", name: "Ava Chen" },
  { id: "2", name: "Jordan Lee" },
  { id: "3", name: "Sam Ortiz" },
  { id: "4", name: "Riley Ng" },
  { id: "5", name: "Morgan Park" },
];

const tableRows = [
  { id: "1", club: "Robotics", school: "Mission High", members: 42 },
  { id: "2", club: "Debate", school: "Palo Alto HS", members: 28 },
  { id: "3", club: "Green Tech", school: "Berkeley HS", members: 35 },
];

const chartData = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 28 },
];

function ShowcaseBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-28 space-y-4 border-b border-border py-10 last:border-b-0">
      <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DesignSystemShowcase() {
  const [dark, setDark] = React.useState(false);
  const [range, setRange] = React.useState<DateRangeValue | undefined>();
  const [viewport, setViewport] = React.useState<number | "fluid">("fluid");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [dark]);

  const previewWidth =
    viewport === "fluid" ? "100%" : `min(100%, ${viewport}px)`;

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-surface/95 backdrop-blur-sm">
        <PageContainer className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Eyebrow>
              {designSystemMeta.name} v{designSystemMeta.version}
            </Eyebrow>
            <p className="mt-1 text-sm text-muted-foreground">
              Codename {designSystemMeta.codename} · development only
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={dark ? "default" : "outline"}
              size="sm"
              onClick={() => setDark((value) => !value)}
            >
              {dark ? "Dark" : "Light"} mode
            </Button>
            {VIEWPORTS.map((width) => (
              <Button
                key={width}
                type="button"
                size="sm"
                variant={viewport === width ? "accent" : "outline"}
                onClick={() => setViewport(width)}
              >
                {width}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant={viewport === "fluid" ? "accent" : "outline"}
              onClick={() => setViewport("fluid")}
            >
              Fluid
            </Button>
          </div>
        </PageContainer>
      </header>

      <div className="mx-auto flex justify-center px-2 py-6 sm:px-4">
        <div
          className="w-full border border-dashed border-border-strong bg-background transition-[max-width] duration-[var(--duration-base)]"
          style={{ maxWidth: previewWidth }}
        >
          <PageContainer>
            <Section className="pb-4 pt-8">
              <motion.div
                {...fadeInUp}
                transition={dsTransition("slow", "emphasized")}
                className="space-y-4"
              >
                <Eyebrow>Peninsula</Eyebrow>
                <DisplayHeading>
                  Premium tooling for Bay Area clubs
                </DisplayHeading>
                <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Technical, energetic, and trustworthy — built for students and
                  advisors without looking childish or like a stock starter kit.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button type="button">Primary action</Button>
                  <Button type="button" variant="outline">
                    Secondary
                  </Button>
                  <Button type="button" variant="accent">
                    Accent
                  </Button>
                  <Button type="button" variant="ghost" disabled>
                    Disabled
                  </Button>
                </div>
              </motion.div>
            </Section>

            <ShowcaseBlock title="Layout · PageContainer / Section / SectionHeader">
              <SectionHeader
                title="Section header"
                description="One job per section: title, short supporting copy, optional actions."
                actions={<Button type="button" size="sm">Action</Button>}
              />
            </ShowcaseBlock>

            <ShowcaseBlock title="Typography · Eyebrow / DisplayHeading">
              <div className="space-y-3">
                <Eyebrow>Student-driven product</Eyebrow>
                <DisplayHeading as="h2">Display heading sample</DisplayHeading>
                <p className="font-sans text-base text-foreground">
                  Body uses Plus Jakarta Sans for high legibility.
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  Mono · metrics & timestamps
                </p>
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="Metrics · MetricCard / StatDelta">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <MetricCard
                  label="Active clubs"
                  value="128"
                  hint="Across authorized schools"
                  delta={{ value: "12%", tone: "up", label: "Up 12% week over week" }}
                />
                <MetricCard
                  label="Pending reviews"
                  value="17"
                  delta={{ value: "3%", tone: "down" }}
                />
                <MetricCard
                  label="Attendance rate"
                  value="91%"
                  delta={{ value: "0%", tone: "neutral" }}
                />
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="Data · DataCard / ChartCard">
              <div className="grid gap-4 lg:grid-cols-2">
                <DataCard
                  title="Membership snapshot"
                  description="Structured content shell"
                  footer={
                    <Button type="button" size="sm" variant="outline">
                      Export
                    </Button>
                  }
                >
                  <p className="text-sm text-muted-foreground">
                    Place filters, tables, or narrative content here.
                  </p>
                </DataCard>
                <ChartCard
                  title="Weekly check-ins"
                  description="Chart tokens chart-1…chart-6"
                  data={chartData}
                />
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="States · Empty / Error / Loading">
              <div className="grid gap-4 lg:grid-cols-3">
                <EmptyState
                  title="No clubs yet"
                  description="Create a club idea to get started."
                  actionLabel="New idea"
                  onAction={() => undefined}
                />
                <ErrorState
                  errorId="err_demo_4f2a"
                  onRetry={() => undefined}
                />
                <div className="space-y-3">
                  <LoadingSkeleton variant="metric" />
                  <LoadingSkeleton variant="list" />
                </div>
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="People · AvatarStack / StatusBadge / RoleBadge">
              <div className="flex flex-wrap items-center gap-4">
                <AvatarStack people={samplePeople} />
                <StatusBadge status="active" />
                <StatusBadge status="pending" />
                <StatusBadge status="rejected" />
                <RoleBadge role="president" />
                <RoleBadge role="school_admin" />
                <RoleBadge role="committee_reviewer" />
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="Filters · FilterBar / DateRangePicker / SearchCommand">
              <FilterBar
                leading={
                  <SearchCommand
                    items={[
                      {
                        id: "1",
                        label: "Robotics Club",
                        group: "Clubs",
                      },
                      {
                        id: "2",
                        label: "Spring Showcase",
                        group: "Events",
                      },
                      {
                        id: "3",
                        label: "Ava Chen",
                        group: "People",
                      },
                    ]}
                  />
                }
                trailing={
                  <>
                    <DateRangePicker value={range} onChange={setRange} />
                    <Input
                      className="max-w-xs"
                      placeholder="Filter by school"
                      aria-label="Filter by school"
                    />
                  </>
                }
              />
            </ShowcaseBlock>

            <ShowcaseBlock title="DataTable · desktop table + mobile summary">
              <DataTable
                caption="Sample clubs"
                columns={[
                  {
                    id: "club",
                    header: "Club",
                    accessor: (row) => row.club,
                  },
                  {
                    id: "school",
                    header: "School",
                    accessor: (row) => row.school,
                  },
                  {
                    id: "members",
                    header: "Members",
                    accessor: (row) => String(row.members),
                  },
                ]}
                data={tableRows}
              />
              <div className="mt-4">
                <DataTable
                  caption="Empty table"
                  columns={[
                    {
                      id: "club",
                      header: "Club",
                      accessor: (row) => row.club,
                    },
                  ]}
                  data={[] as typeof tableRows}
                />
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="Workflow · ActivityTimeline / WorkflowStepper">
              <div className="grid gap-8 lg:grid-cols-2">
                <ActivityTimeline
                  items={[
                    {
                      id: "1",
                      title: "Idea submitted",
                      description: "Student submitted Green Tech Club.",
                      timestamp: "2026-09-01 09:12",
                      actor: "Riley Ng",
                    },
                    {
                      id: "2",
                      title: "Assigned to reviewer",
                      timestamp: "2026-09-01 11:40",
                      actor: "System",
                    },
                    {
                      id: "3",
                      title: "Changes requested",
                      description: "Clarify advisor availability.",
                      timestamp: "2026-09-02 14:05",
                      actor: "Committee reviewer",
                    },
                  ]}
                />
                <WorkflowStepper
                  currentStepId="review"
                  steps={[
                    { id: "submit", label: "Submit", description: "Idea form" },
                    { id: "review", label: "Review", description: "Committee" },
                    { id: "approve", label: "Approve", description: "Decision" },
                    { id: "launch", label: "Launch", description: "Create club" },
                  ]}
                />
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="Domain cards · Media / Course / Event / Club">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MediaCard title="Field day highlight" meta="Private club media" />
                <CourseCard
                  title="Intro to Circuits"
                  provider="STEM Library"
                  duration="4 weeks"
                  level="Beginner"
                />
                <EventCard
                  title="Maker Night"
                  when="Fri · 5:30 PM"
                  where="Room 214"
                  status="approved"
                />
                <ClubCard
                  name="Peninsula Robotics"
                  school="Mission High"
                  members={42}
                  category="STEM"
                />
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="InsightCallout">
              <div className="space-y-3">
                <InsightCallout title="Privacy default" tone="info">
                  Student and private-club information stays non-public unless
                  explicitly authorized.
                </InsightCallout>
                <InsightCallout title="Tip" tone="tip">
                  Use MetricCard for KPIs and DataCard for structured content.
                </InsightCallout>
                <InsightCallout title="Attention" tone="warning">
                  Under-13 self-service registration remains disabled.
                </InsightCallout>
              </div>
            </ShowcaseBlock>

            <ShowcaseBlock title="Foundations · Button / Input / Separator">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm">
                    Small
                  </Button>
                  <Button type="button">Default</Button>
                  <Button type="button" size="lg">
                    Large
                  </Button>
                  <Button type="button" variant="destructive">
                    Destructive
                  </Button>
                </div>
                <Input placeholder="Token-styled input" aria-label="Demo input" />
                <Separator />
                <p className="text-sm text-muted-foreground">
                  Resize the preview with the viewport markers above to validate
                  375 · 768 · 1024 · 1440 · 1920.
                </p>
              </div>
            </ShowcaseBlock>
          </PageContainer>
        </div>
      </div>
    </div>
  );
}
