import Link from "next/link";

import { Button } from "@/components/ui/button";

type CatalogPaginationProps = {
  page: number;
  pageCount: number;
  basePath: string;
};

export function CatalogPagination({
  page,
  pageCount,
  basePath,
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
        <Link
          href={page <= 1 ? basePath : `${basePath}?page=${previous}`}
          aria-disabled={page <= 1}
        >
          Previous
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <Button asChild variant="outline" size="sm" disabled={page >= pageCount}>
        <Link
          href={page >= pageCount ? basePath : `${basePath}?page=${next}`}
          aria-disabled={page >= pageCount}
        >
          Next
        </Link>
      </Button>
    </nav>
  );
}
