import { defineResource } from "@nextpaneljs/core";

export const PostResource = defineResource({
  model: "post",
  slug: "posts",
  label: "Post",
  pluralLabel: "Posts",
  icon: "FileText",
  navigation: {
    group: "Content",
    sort: 10,
  },

  include: {
    author: { select: { id: true, name: true } },
  },

  table: {
    columns: [
      {
        key: "title",
        label: "Title",
        type: "text",
        sortable: true,
        searchable: true,
      },
      {
        key: "slug",
        label: "Slug",
        type: "text",
        sortable: true,
        searchable: true,
      },
      {
        key: "published",
        label: "Published",
        type: "boolean",
        sortable: false,
        searchable: false,
      },
      {
        key: "author.name",
        label: "Author",
        type: "text",
        sortable: false,
        searchable: false,
      },
      {
        key: "createdAt",
        label: "Created At",
        type: "date",
        sortable: true,
        searchable: false,
      },
    ],
    filters: [],
    actions: [
      { key: "delete", label: "Delete", variant: "destructive", bulk: true },
    ],
    defaultSort: { key: "createdAt", direction: "desc" },
    perPage: 25,
  },

  form: {
    fields: [
      {
        key: "title",
        label: "Title",
        type: "text",
        required: true,
      },
      {
        key: "slug",
        label: "Slug",
        type: "text",
        required: true,
      },
      {
        key: "content",
        label: "Content",
        type: "text",
        required: false,
      },
      {
        key: "published",
        label: "Published",
        type: "checkbox",
        required: false,
      },
      {
        key: "authorId",
        label: "Author",
        type: "relation",
        required: true,
        relation: {
          model: "user",
          displayField: "name",
          valueField: "id",
        },
      },
    ],
  },
});
