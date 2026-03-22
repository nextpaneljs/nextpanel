"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ResourceConfig } from "../types";
import { DataTable } from "../table/data-table";
import { buildColumns } from "../table/columns";
import { TableToolbar } from "../table/table-toolbar";
import { TablePagination } from "../table/table-pagination";

interface ResourceListClientProps {
  resource: ResourceConfig;
  data: Record<string, unknown>[];
  page: number;
  perPage: number;
  total: number;
  deleteRecord: (model: string, slug: string, id: string) => Promise<void>;
}

export function ResourceListClient({
  resource,
  data,
  page,
  perPage,
  total,
  deleteRecord,
}: ResourceListClientProps) {
  const router = useRouter();
  const hasSearchable = resource.table.columns.some((c) => c.searchable);

  const columns = buildColumns<Record<string, unknown>>(
    resource.table.columns,
    {
      onEdit: (id) => {
        router.push(`/admin/${resource.slug}/${id}/edit`);
      },
      onDelete: async (id) => {
        if (!confirm(`Are you sure you want to delete this ${resource.label}?`)) {
          return;
        }
        try {
          await deleteRecord(resource.model, resource.slug, id);
          toast.success(`${resource.label} deleted successfully`);
          router.refresh();
        } catch {
          toast.error("Failed to delete");
        }
      },
    }
  );

  return (
    <>
      <TableToolbar filters={resource.table.filters} searchable={hasSearchable} />
      <DataTable columns={columns} data={data} />
      <TablePagination page={page} perPage={perPage} total={total} />
    </>
  );
}
