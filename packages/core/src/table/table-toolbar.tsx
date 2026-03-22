"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import type { FilterDefinition } from "../types";

interface TableToolbarProps {
  filters: FilterDefinition[];
  searchable: boolean;
}

export function TableToolbar({ filters, searchable }: TableToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasActiveFilters =
    searchParams.get("q") ||
    filters.some((f) => searchParams.get(f.key));

  return (
    <div className="flex items-center gap-2 py-4">
      {searchable && (
        <Input
          placeholder="Search..."
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => updateParam("q", e.target.value)}
          className="max-w-xs"
        />
      )}
      {filters.map((filter) => {
        if (filter.type === "select" && filter.options) {
          return (
            <Select
              key={filter.key}
              value={searchParams.get(filter.key) ?? ""}
              onValueChange={(value) =>
                updateParam(filter.key, !value || value === "__all__" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (filter.type === "text") {
          return (
            <Input
              key={filter.key}
              placeholder={filter.label}
              defaultValue={searchParams.get(filter.key) ?? ""}
              onChange={(e) => updateParam(filter.key, e.target.value)}
              className="max-w-[180px]"
            />
          );
        }
        if (filter.type === "date") {
          return (
            <Input
              key={filter.key}
              type="date"
              placeholder={filter.label}
              defaultValue={searchParams.get(filter.key) ?? ""}
              onChange={(e) => updateParam(filter.key, e.target.value)}
              className="max-w-[180px]"
            />
          );
        }
        return null;
      })}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters} size="sm">
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
