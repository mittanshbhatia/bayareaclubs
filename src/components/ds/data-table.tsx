"use client";

import * as React from "react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  mobileLabel?: string;
  hideOnMobile?: boolean;
};

type DataTableProps<T extends { id: string }> = {
  columns: DataTableColumn<T>[];
  data: T[];
  caption?: string;
  className?: string;
  emptyMessage?: string;
};

const features = tableFeatures({});

export function DataTable<T extends { id: string }>({
  columns,
  data,
  caption,
  className,
  emptyMessage = "No rows to display.",
}: DataTableProps<T>) {
  const helper = React.useMemo(
    () => createColumnHelper<typeof features, T>(),
    [],
  );

  const tableColumns = React.useMemo(
    () =>
      helper.columns(
        columns.map((column) =>
          helper.display({
            id: column.id,
            header: column.header,
            cell: ({ row }) => column.accessor(row.original),
          }),
        ),
      ),
    [columns, helper],
  );

  const table = useTable({
    features,
    columns: tableColumns,
    data,
  });

  return (
    <div data-slot="data-table" className={cn("space-y-3", className)}>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <Table>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="bg-surface-muted/60 hover:bg-surface-muted/60">
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-foreground">
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile summaries */}
      <ul className="space-y-3 md:hidden" aria-label={caption ?? "Table data"}>
        {data.length === 0 ? (
          <li className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </li>
        ) : (
          data.map((row) => (
            <li
              key={row.id}
              className="rounded-lg border border-border bg-surface p-4 shadow-xs"
            >
              <dl className="space-y-2">
                {columns
                  .filter((column) => !column.hideOnMobile)
                  .map((column) => (
                    <div
                      key={column.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <dt className="text-xs font-medium text-muted-foreground">
                        {column.mobileLabel ?? column.header}
                      </dt>
                      <dd className="text-right text-sm text-foreground">
                        {column.accessor(row)}
                      </dd>
                    </div>
                  ))}
              </dl>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
