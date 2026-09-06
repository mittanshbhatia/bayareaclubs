import Link from "next/link";

import { PageContainer } from "@/components/ds/page-container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <PageContainer className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-foreground">
            BayAreaClubs
          </p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            A secure platform for school and college clubs across the Bay Area.
            Student and private club information stays non-public by default.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Start a Club
          </Link>
          <Link
            href="/sign-in"
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
          <Link
            href="/resources"
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            Resources
          </Link>
        </nav>
      </PageContainer>
    </footer>
  );
}
