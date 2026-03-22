import { notFound } from "next/navigation";
import { ResourceEditPage } from "@nextpaneljs/core/pages";
import { PostResource } from "@/resources/post.resource";
import { createRecord, updateRecord, getRelationOptions } from "@/nextpanel/actions";
import { prisma } from "@/lib/prisma";

const resource = PostResource;
const actions = { createRecord, updateRecord, getRelationOptions };

export default async function PostsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const record = await (prisma as any)[resource.model].findUnique({
    where: { id },
    include: resource.include,
  });

  if (!record) {
    notFound();
  }

  const defaultValues = JSON.parse(JSON.stringify(record));

  return (
    <ResourceEditPage
      resource={resource}
      defaultValues={defaultValues}
      recordId={id}
      actions={actions}
    />
  );
}
