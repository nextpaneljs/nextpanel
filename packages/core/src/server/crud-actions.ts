import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { NextPanelServerConfig } from "./types";

export function createCrudActions(config: NextPanelServerConfig) {
  function validateModel(model: string) {
    if (!config.resources.some((r) => r.model === model)) {
      throw new Error(`Invalid model: ${model}`);
    }
  }

  async function requireAuth() {
    const session = await config.auth.api.getSession({
      headers: await headers(),
    });
    if (!session) throw new Error("Unauthorized");
    return session;
  }

  async function createRecord(
    model: string,
    slug: string,
    data: Record<string, unknown>
  ) {
    await requireAuth();
    validateModel(model);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaModel = (config.prisma as any)[model];
    if (!prismaModel) {
      throw new Error(
        `Prisma model "${model}" not found. Make sure the model exists in your schema.prisma and run "npx prisma generate".`
      );
    }
    const record = await prismaModel.create({ data });
    revalidatePath(`/admin/${slug}`);
    return record;
  }

  async function updateRecord(
    model: string,
    slug: string,
    id: string,
    data: Record<string, unknown>
  ) {
    await requireAuth();
    validateModel(model);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaModel = (config.prisma as any)[model];
    if (!prismaModel) {
      throw new Error(
        `Prisma model "${model}" not found. Make sure the model exists in your schema.prisma and run "npx prisma generate".`
      );
    }
    await prismaModel.update({ where: { id }, data });
    revalidatePath(`/admin/${slug}`);
  }

  async function deleteRecord(
    model: string,
    slug: string,
    id: string
  ) {
    await requireAuth();
    validateModel(model);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaModelDel = (config.prisma as any)[model];
    if (!prismaModelDel) {
      throw new Error(
        `Prisma model "${model}" not found. Make sure the model exists in your schema.prisma and run "npx prisma generate".`
      );
    }
    await prismaModelDel.delete({ where: { id } });
    revalidatePath(`/admin/${slug}`);
  }

  async function getRelationOptions(
    model: string,
    displayField: string,
    valueField: string
  ): Promise<{ label: string; value: string }[]> {
    await requireAuth();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaRelModel = (config.prisma as any)[model];
    if (!prismaRelModel) {
      throw new Error(
        `Prisma model "${model}" not found. Make sure the model exists in your schema.prisma and run "npx prisma generate".`
      );
    }
    const records = await prismaRelModel.findMany({
      select: { [displayField]: true, [valueField]: true },
      take: 100,
    });

    return records.map(
      (r: Record<string, unknown>) => ({
        label: String(r[displayField]),
        value: String(r[valueField]),
      })
    );
  }

  return { createRecord, updateRecord, deleteRecord, getRelationOptions };
}
