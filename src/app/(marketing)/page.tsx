import Link from "next/link";
import { ArrowRight, ShieldCheck, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

const capabilities = [
  "Move club ideas through a transparent approval workflow.",
  "Manage charters, members, attendance, events, and renewals.",
  "Protect student and private club information by default.",
] as const;

export default function HomePage() {
  return (
    <main>
      <header className="bg-surface border-b">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="font-semibold tracking-tight"
            aria-label="BayAreaClubs home"
          >
            BayAreaClubs
          </Link>
          <Link
            href="/api/health"
            className="text-muted-foreground hover:text-foreground text-sm font-medium underline-offset-4 hover:underline"
          >
            System health
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl content-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <div className="border-primary text-primary mb-6 inline-flex items-center gap-2 border-l-2 pl-3 text-sm font-medium">
            <UsersRound aria-hidden="true" className="size-4" />
            Built for school communities
          </div>
          <h1 className="max-w-3xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
            Give every great club a path from idea to impact.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
            BayAreaClubs brings club approvals, operations, events, and growth
            into one accountable platform for students and authorized adults.
          </p>
          <Button asChild className="mt-8">
            <Link href="/api/health">
              Check platform health
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>

        <aside
          className="border-y py-8 lg:border-x lg:px-8"
          aria-labelledby="platform-foundations"
        >
          <div className="mb-7 flex items-center gap-3">
            <ShieldCheck aria-hidden="true" className="text-primary size-5" />
            <h2 id="platform-foundations" className="font-semibold">
              Platform foundations
            </h2>
          </div>
          <ul className="space-y-6">
            {capabilities.map((capability, index) => (
              <li key={capability} className="flex gap-4">
                <span className="text-muted-foreground font-mono text-xs">
                  0{index + 1}
                </span>
                <span className="text-sm leading-6">{capability}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
