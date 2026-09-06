import { Building2, GraduationCap, Sparkles, UsersRound } from "lucide-react";

import { PageContainer, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/marketing/reveal";

const nodes = [
  {
    title: "Schools",
    copy: "Each school keeps its own administrative boundary.",
    icon: Building2,
  },
  {
    title: "Clubs",
    copy: "Clubs inherit approvals, charters, and officer roles.",
    icon: UsersRound,
  },
  {
    title: "Events",
    copy: "Activities and RSVPs stay scoped to the club that hosts them.",
    icon: Sparkles,
  },
  {
    title: "Learning",
    copy: "STEM resources surface inside dashboards students already use.",
    icon: GraduationCap,
  },
] as const;

export function NetworkSection() {
  return (
    <section className="scroll-mt-20 border-b border-border py-16 sm:py-24">
      <PageContainer>
        <Reveal>
          <SectionHeader
            title="Built for a network of schools—not a vanity counter."
            description="BayAreaClubs connects schools, clubs, events, and learning with tenant isolation. We do not invent enrollment statistics for marketing."
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nodes.map((node, index) => (
            <Reveal key={node.title} delay={index * 0.05}>
              <article className="h-full rounded-xl border border-border bg-surface p-5 shadow-xs">
                <node.icon aria-hidden className="mb-4 size-5 text-primary" />
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {node.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {node.copy}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface-muted/50 p-6 sm:p-8">
            <p className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
              Conceptual map
            </p>
            <p className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Schools authorize clubs. Clubs run events. Students learn—with
              privacy defaults intact.
            </p>
            <div
              className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold text-foreground"
              aria-hidden
            >
              <span className="rounded-md bg-surface px-3 py-2 shadow-xs">
                School
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-md bg-surface px-3 py-2 shadow-xs">
                Club
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-md bg-surface px-3 py-2 shadow-xs">
                Event
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-md bg-primary px-3 py-2 text-primary-foreground shadow-xs">
                Learning
              </span>
            </div>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
