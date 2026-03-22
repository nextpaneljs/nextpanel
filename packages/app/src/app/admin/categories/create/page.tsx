import { ResourceCreatePage } from "@nextpaneljs/core/pages";
import { CategoryResource } from "@/resources/category.resource";
import { createRecord, updateRecord, getRelationOptions } from "@/nextpanel/actions";

const resource = CategoryResource;
const actions = { createRecord, updateRecord, getRelationOptions };

export default function CategoriesCreatePage() {
  return <ResourceCreatePage resource={resource} actions={actions} />;
}
