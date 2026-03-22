import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import type { ResourceConfig, QueryOptions, QueryResult } from "../types";
import { ResourceListClient } from "./resource-list-client";

interface ResourceListPageProps {
  resource: ResourceConfig;
  searchParams: Record<string, string | string[] | undefined>;
  queryRecords: (options: QueryOptions) => Promise<QueryResult>;
  deleteRecord: (model: string, slug: string, id: string) => Promise<void>;
}

export async function ResourceListPage({
  resource,
  searchParams,
  queryRecords,
  deleteRecord,
}: ResourceListPageProps) {
  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || resource.table.perPage;
  const sortKey =
    (searchParams.sort as string) || resource.table.defaultSort.key;
  const sortDir =
    ((searchParams.dir as string) as "asc" | "desc") ||
    resource.table.defaultSort.direction;
  const search = searchParams.q as string | undefined;

  // Build filters from search params
  const filters: Record<string, string> = {};
  for (const filter of resource.table.filters) {
    const value = searchParams[filter.key];
    if (value && typeof value === "string") {
      filters[filter.key] = value;
    }
  }

  // Get searchable fields
  const searchableFields = resource.table.columns
    .filter((c) => c.searchable)
    .map((c) => c.key);

  const result = await queryRecords({
    model: resource.model,
    page,
    perPage,
    sortKey,
    sortDir,
    filters,
    search,
    searchableFields,
    include: resource.include,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{resource.pluralLabel}</h1>
        <Button nativeButton={false} render={<Link href={`/admin/${resource.slug}/create`} />}>
          <Plus className="mr-2 h-4 w-4" />
          Create {resource.label}
        </Button>
      </div>

      <ResourceListClient
        resource={resource}
        data={result.data}
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        deleteRecord={deleteRecord}
      />
    </div>
  );
}
