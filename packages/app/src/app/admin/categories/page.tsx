import { ResourceListPage } from "@nextpaneljs/core/pages";
import { CategoryResource } from "@/resources/category.resource";
import { queryRecords, deleteRecord } from "@/nextpanel/actions";

const resource = CategoryResource;

export default async function CategoriesListPage({
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
