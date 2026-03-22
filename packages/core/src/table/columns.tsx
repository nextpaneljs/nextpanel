"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { ColumnDefinition } from "../types";
import { TextCell, BadgeCell, BooleanCell, DateCell, ImageCell } from "./column-types";

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

interface BuildColumnsOptions {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function buildColumns<T extends Record<string, unknown>>(
  definitions: ColumnDefinition[],
  options?: BuildColumnsOptions
): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = [];

  // Checkbox column
  columns.push({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  });

  // Data columns
  for (const def of definitions) {
    if (def.hidden) continue;

    columns.push({
      accessorKey: def.key,
      header: def.sortable
        ? ({ column }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {def.label}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        : () => def.label,
      cell: ({ row }) => {
        const value = getNestedValue(
          row.original as Record<string, unknown>,
          def.key
        );
        switch (def.type) {
          case "badge":
            return <BadgeCell value={value} options={def.options} />;
          case "boolean":
            return <BooleanCell value={value} />;
          case "date":
            return <DateCell value={value} format={def.format} />;
          case "image":
            return <ImageCell value={value} />;
          default:
            return <TextCell value={value} />;
        }
      },
      enableSorting: def.sortable ?? false,
    });
  }

  // Actions column
  if (options?.onEdit || options?.onDelete) {
    columns.push({
      id: "actions",
      cell: ({ row }) => {
        const id = String(
          (row.original as Record<string, unknown>).id ?? ""
        );
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {options.onEdit && (
                <DropdownMenuItem onClick={() => options.onEdit!(id)}>
                  Edit
                </DropdownMenuItem>
              )}
              {options.onDelete && (
                <DropdownMenuItem
                  onClick={() => options.onDelete!(id)}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return columns;
}
