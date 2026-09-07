import Link from "next/link";

import { Button } from "@/components/ui/button";

type CatalogPaginationProps = {
  page: number;
  pageCount: number;
  basePath: string;
  family?: string;
};

function hrefFor(basePath: string, page: number, family?: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (family && family !== "all") params.set("family", family);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function CatalogPagination({
  page,
  pageCount,
  basePath,
  family,
}: CatalogPaginationProps) {
  if (pageCount <= 1) return null;
  const previous = Math.max(1, page - 1);
  const next = Math.min(pageCount, page + 1);

  return (
    <nav
      aria-label="Catalog pages"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <Button asChild variant="outline" size="sm" disabled={page <= 1}>
        <Link href={hrefFor(basePath, previous, family)} aria-disabled={page <= 1}>
          Previous
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <Button asChild variant="outline" size="sm" disabled={page >= pageCount}>
        <Link href={hrefFor(basePath, next, family)} aria-disabled={page >= pageCount}>
          Next
        </Link>
      </Button>
    </nav>
  );
}
