import { defineResource } from "@nextpaneljs/core";

export const CategoryResource = defineResource({
  model: "category",
  slug: "categories",
  label: "Category",
  pluralLabel: "Categories",
  icon: "File",
  navigation: {
    group: "Resources",
    sort: 10,
  },

  table: {
    columns: [
      {
        key: "id",
        label: "ID",
        type: "text",
        sortable: true,
        searchable: false,
      },
      {
        key: "name",
        label: "Name",
        type: "text",
        sortable: true,
        searchable: true,
      },
      {
        key: "createdAt",
        label: "Created At",
        type: "date",
        sortable: true,
        searchable: false,
      },
      {
        key: "updatedAt",
        label: "Updated At",
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
        key: "name",
        label: "Name",
        type: "text",
        required: true,
      },
    ],
  },
});
