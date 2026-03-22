import { ResourceCreatePage } from "@nextpaneljs/core/pages";
import { PostResource } from "@/resources/post.resource";
import { createRecord, updateRecord, getRelationOptions } from "@/nextpanel/actions";

const resource = PostResource;
const actions = { createRecord, updateRecord, getRelationOptions };

export default function PostsCreatePage() {
  return <ResourceCreatePage resource={resource} actions={actions} />;
}
