import Link from "next/link";
import { Sparkles } from "lucide-react";

import { PageContainer } from "@/components/ds/page-container";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080b1a] text-white">
      <PageContainer
        size="xl"
        className="grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end"
      >
        <div>
          <Link
            href="/"
            className="font-display inline-flex items-center gap-2.5 text-lg font-semibold"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/8">
              <Sparkles
                aria-hidden
                className="size-4 text-[var(--home-cyan)]"
              />
            </span>
            BayAreaClubs
          </Link>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/42">
            A connected platform for school and college clubs. Student and
            private-club information stays non-public by default.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-3 text-sm"
        >
          <a href="#discover" className="text-white/52 hover:text-white">
            Discover
          </a>
          <a href="#trust" className="text-white/52 hover:text-white">
            Safety
          </a>
          <Link href="/resources" className="text-white/52 hover:text-white">
            Learn
          </Link>
          <Link href="/sign-in" className="text-white/52 hover:text-white">
            Sign In
          </Link>
          <Link href="/dashboard" className="text-white/52 hover:text-white">
            Dashboard
          </Link>
        </nav>
      </PageContainer>
      <div className="border-t border-white/8">
        <PageContainer
          size="xl"
          className="flex flex-col gap-2 py-5 text-[0.68rem] text-white/30 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© 2026 BayAreaClubs</p>
          <p>Institutional and legal review remains required.</p>
        </PageContainer>
      </div>
    </footer>
  );
}
