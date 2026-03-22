import { ResourceListPage } from "@nextpaneljs/core/pages";
import { PostResource } from "@/resources/post.resource";
import { queryRecords, deleteRecord } from "@/nextpanel/actions";

const resource = PostResource;

export default async function PostsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <ResourceListPage
      resource={resource}
      searchParams={await searchParams}
      queryRecords={queryRecords}
      deleteRecord={deleteRecord}
    />
  );
}
