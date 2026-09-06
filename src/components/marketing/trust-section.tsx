import {
  EyeOff,
  FileLock2,
  ImageOff,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import { MotionReveal, SceneLabel } from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const controls = [
  { label: "Private rosters", icon: EyeOff },
  { label: "Protected attendance", icon: FileLock2 },
  { label: "Controlled event visibility", icon: ShieldCheck },
  { label: "Media consent", icon: ImageOff },
  { label: "School governance", icon: UserRoundCheck },
] as const;

export function TrustSection() {
  return (
    <section
      id="trust"
      className={cn(
        styles.scene,
        styles.trustBand,
        "scroll-mt-20 py-24 sm:py-32 lg:py-40",
      )}
    >
      <PageContainer size="xl">
        <MotionReveal>
          <SceneLabel>09 · Trust by design</SceneLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <h2 className={cn(styles.sectionDisplay, "text-balance")}>
              Built for student communities.
            </h2>
            <p className="max-w-xl text-base leading-7 text-[var(--home-muted)] sm:text-lg">
              Designed with school controls and student privacy in mind.
              Institutional configuration and legal review remain required.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <ul className="mt-14 grid border-y border-[#252b4c]/12 sm:grid-cols-5">
            {controls.map((control) => (
              <li
                key={control.label}
                className="flex items-center gap-3 border-b border-[#252b4c]/10 py-5 sm:flex-col sm:items-start sm:border-r sm:border-b-0 sm:px-5 sm:last:border-r-0"
              >
                <control.icon
                  className="size-5 text-[var(--home-indigo)]"
                  aria-hidden
                />
                <span className="text-sm font-semibold">{control.label}</span>
              </li>
            ))}
          </ul>
        </MotionReveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-14">
          <MotionReveal delay={0.05}>
            <article
              id="safety-details"
              className="scroll-mt-24 border-t border-[#252b4c]/15 pt-5"
            >
              <p className="font-mono text-[0.62rem] font-bold tracking-[0.14em] text-[var(--home-indigo)] uppercase">
                Safety
              </p>
              <h3 className="font-display mt-3 text-xl font-semibold">
                Access follows real assignments.
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--home-muted)]">
                School, club, guardian, and platform authority comes from
                persisted memberships—not from navigation visibility.
              </p>
            </article>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <article
              id="data-practices"
              className="scroll-mt-24 border-t border-[#252b4c]/15 pt-5"
            >
              <p className="font-mono text-[0.62rem] font-bold tracking-[0.14em] text-[var(--home-indigo)] uppercase">
                Data practices
              </p>
              <h3 className="font-display mt-3 text-xl font-semibold">
                Student information stays scoped.
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--home-muted)]">
                Emails, private rosters, attendance, and private media are not
                made publicly browseable.
              </p>
            </article>
          </MotionReveal>
          <MotionReveal delay={0.15}>
            <article
              id="security-details"
              className="scroll-mt-24 border-t border-[#252b4c]/15 pt-5"
            >
              <p className="font-mono text-[0.62rem] font-bold tracking-[0.14em] text-[var(--home-indigo)] uppercase">
                Security
              </p>
              <h3 className="font-display mt-3 text-xl font-semibold">
                Protection exists below the interface.
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--home-muted)]">
                Server authorization and PostgreSQL row-level security enforce
                tenant boundaries even when a route is known.
              </p>
            </article>
          </MotionReveal>
        </div>

        <nav
          aria-label="Trust topics"
          className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-[var(--home-indigo)]"
        >
          <a href="#safety-details">Safety</a>
          <a href="#data-practices">Data Practices</a>
          <a href="#security-details">Security</a>
        </nav>
      </PageContainer>
    </section>
  );
}
