import { headers } from "next/headers";
import type { NextPanelServerConfig } from "./types";
import type { QueryOptions, QueryResult } from "../types";

export function createQueryActions(config: NextPanelServerConfig) {
  function validateModel(model: string) {
    if (!config.resources.some((r) => r.model === model)) {
      throw new Error(`Invalid model: ${model}`);
    }
  }

  async function queryRecords(options: QueryOptions): Promise<QueryResult> {
    const session = await config.auth.api.getSession({
      headers: await headers(),
    });
    if (!session) throw new Error("Unauthorized");

    validateModel(options.model);

    const {
      model,
      page,
      perPage,
      sortKey,
      sortDir,
      filters,
      search,
      searchableFields,
      include,
    } = options;

    const where: Record<string, unknown> = {};

    // Apply filters
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== "") {
          where[key] = value;
        }
      }
    }

    // Apply search across searchable fields
    // Note: SQLite doesn't support mode: "insensitive", so we omit it.
    // SQLite's LIKE/contains is case-insensitive by default for ASCII.
    if (search && searchableFields?.length) {
      where.OR = searchableFields.map((field) => ({
        [field]: { contains: search },
      }));
    }

    const orderBy = sortKey ? { [sortKey]: sortDir || "asc" } : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaModel = (config.prisma as any)[model];

    if (!prismaModel) {
      throw new Error(
        `Prisma model "${model}" not found. Make sure the model exists in your schema.prisma and run "npx prisma generate".`
      );
    }

    const [data, total] = await Promise.all([
      prismaModel.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        include,
      }),
      prismaModel.count({ where }),
    ]);

    return {
      data: JSON.parse(JSON.stringify(data)),
      total,
      page,
      perPage,
    };
  }

  return { queryRecords };
}
