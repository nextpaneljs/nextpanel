# Tables

NextPanel uses [TanStack Table](https://tanstack.com/table) under the hood, wrapped in a config-driven system. You define columns, filters, and actions as plain objects — the framework renders everything.

## How Tables Work

1. You define `columns`, `filters`, and `actions` in your resource config
2. The `ResourceListPage` server component fetches data using URL search params
3. `buildColumns()` converts your column definitions into TanStack Table column defs
4. The `DataTable` component renders the table with sorting, selection, and actions
5. Pagination and filtering are **server-side** via URL search params

## Column Types

### Text Column

Displays plain text. Supports dot notation for nested relations.

```typescript
{ key: "title", label: "Title", type: "text", sortable: true, searchable: true }
{ key: "author.name", label: "Author", type: "text" }  // Relation
```

### Badge Column

Displays a colored badge. Map values to badge variants.

```typescript
{
  key: "status",
  label: "Status",
  type: "badge",
  sortable: true,
  options: {
    draft: "secondary",       // gray badge
    published: "default",     // primary badge
    archived: "destructive",  // red badge
  },
}
```

Available variants: `"default"`, `"secondary"`, `"destructive"`, `"outline"`

### Boolean Column

Displays a check or X icon.

```typescript
{ key: "published", label: "Published", type: "boolean" }
```

### Date Column

Formats dates as "Mar 21, 2026".

```typescript
{ key: "createdAt", label: "Created", type: "date", sortable: true }
```

### Image Column

Displays a thumbnail image.

```typescript
{ key: "avatar", label: "Avatar", type: "image" }
```

## Column Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | `string` | required | Field name or dot-notation path (e.g., `"author.name"`) |
| `label` | `string` | required | Column header text |
| `type` | `string` | `"text"` | One of: `"text"`, `"badge"`, `"boolean"`, `"date"`, `"image"` |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `searchable` | `boolean` | `false` | Include in global search |
| `options` | `object` | — | For badge columns: `{ value: variant }` mapping |
| `hidden` | `boolean` | `false` | Hide the column |

## Filters

Filters appear in the toolbar above the table. They modify URL search params which trigger server-side filtering.

### Select Filter

```typescript
{
  key: "status",
  label: "Status",
  type: "select",
  options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ],
}
```

### Text Filter

```typescript
{ key: "email", label: "Email", type: "text" }
```

### Date Filter

```typescript
{ key: "createdAt", label: "Created After", type: "date" }
```

## Actions

Row actions appear in a dropdown menu on each row.

```typescript
actions: [
  { key: "delete", label: "Delete", variant: "destructive", bulk: true },
]
```

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Action identifier |
| `label` | `string` | Display text |
| `variant` | `string` | Button style: `"default"`, `"destructive"`, `"outline"`, `"secondary"` |
| `bulk` | `boolean` | Whether this action can be applied to multiple selected rows |

## Sorting and Pagination

Sorting and pagination are **server-side** — driven by URL search params:

```
/admin/posts?page=2&perPage=25&sort=createdAt&dir=desc&status=published&q=hello
```

### Default Sort

```typescript
defaultSort: { key: "createdAt", direction: "desc" }
```

### Page Size

```typescript
perPage: 25  // Default rows per page
```

Users can change the page size using the dropdown at the bottom of the table (10, 25, 50, 100).

## Global Search

Columns with `searchable: true` are included in global search. The search input appears in the toolbar when at least one column is searchable.

Search uses Prisma's `contains` with `mode: "insensitive"` for case-insensitive matching.

## Full Table Config Example

```typescript
table: {
  columns: [
    { key: "id", label: "ID", type: "text", sortable: true },
    { key: "title", label: "Title", type: "text", sortable: true, searchable: true },
    { key: "status", label: "Status", type: "badge", sortable: true,
      options: { draft: "secondary", published: "default" } },
    { key: "author.name", label: "Author", type: "text" },
    { key: "published", label: "Active", type: "boolean" },
    { key: "createdAt", label: "Created", type: "date", sortable: true },
  ],
  filters: [
    { key: "status", label: "Status", type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ] },
  ],
  actions: [
    { key: "delete", label: "Delete", variant: "destructive", bulk: true },
  ],
  defaultSort: { key: "createdAt", direction: "desc" },
  perPage: 25,
},
```
