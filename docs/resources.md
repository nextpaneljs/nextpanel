# Resources

Resources are the core concept of NextPanel. A resource represents a database model and defines how it appears in the admin panel — its table columns, form fields, navigation placement, and more.

## What is a Resource?

A resource is a plain TypeScript configuration object that tells the framework:

- **Which model** to query (Prisma model name)
- **How to display data** in a table (columns, sorting, filtering)
- **How to collect data** via forms (fields, validation, layout)
- **Where to show it** in the sidebar navigation

One resource config replaces dozens of files you'd normally write by hand.

## Creating a Resource

### Using the CLI (Recommended)

```bash
# Auto-generate from a Prisma model
node packages/cli/dist/index.js make:resource Post --from-model

# With options
node packages/cli/dist/index.js make:resource Post --from-model --icon FileText --group Content
```

This generates:
- `src/resources/post.resource.ts` — Resource configuration
- `src/app/admin/posts/page.tsx` — List page
- `src/app/admin/posts/create/page.tsx` — Create page
- `src/app/admin/posts/[id]/edit/page.tsx` — Edit page
- Updates `src/resources/index.ts` to register the resource

### Manual Creation

Create a file at `src/resources/post.resource.ts`:

```typescript
import { defineResource } from "@/nextpanel/types";

export const PostResource = defineResource({
  model: "post",           // Prisma model name (lowercase)
  slug: "posts",           // URL segment: /admin/posts
  label: "Post",           // Singular label
  pluralLabel: "Posts",    // Plural label
  icon: "FileText",        // Lucide icon name

  navigation: {
    group: "Content",      // Sidebar group heading
    sort: 10,              // Sort order within group
  },

  table: {
    columns: [
      { key: "title", label: "Title", type: "text", sortable: true, searchable: true },
      { key: "published", label: "Published", type: "boolean" },
      { key: "createdAt", label: "Created", type: "date", sortable: true },
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
      { key: "title", label: "Title", type: "text", required: true },
      { key: "content", label: "Content", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
});
```

Then register it in `src/resources/index.ts`:

```typescript
import { PostResource } from "./post.resource";

export const resources: ResourceConfig[] = [
  PostResource,
];
```

## Resource Config Reference

| Property | Type | Description |
|----------|------|-------------|
| `model` | `string` | Prisma model name (lowercase, e.g., `"post"`) |
| `slug` | `string` | URL segment (e.g., `"posts"` → `/admin/posts`) |
| `label` | `string` | Singular display name |
| `pluralLabel` | `string` | Plural display name |
| `icon` | `string` | [Lucide icon](https://lucide.dev/icons) name (e.g., `"FileText"`) |
| `navigation` | `object` | Sidebar navigation config |
| `navigation.group` | `string` | Group heading in sidebar |
| `navigation.sort` | `number` | Sort order (lower = higher) |
| `table` | `object` | Table configuration (see [Tables](tables.md)) |
| `form` | `object` | Form configuration (see [Forms](forms.md)) |
| `include` | `object` | Prisma `include` for eager loading relations |

## Eager Loading Relations

Use `include` to load related data:

```typescript
export const PostResource = defineResource({
  // ...
  include: {
    author: {
      select: { id: true, name: true },
    },
  },

  table: {
    columns: [
      // Access nested relation data with dot notation
      { key: "author.name", label: "Author", type: "text" },
    ],
    // ...
  },
});
```

## Auto-Registration

When you use the CLI's `make:resource` command, it automatically:

1. Creates the resource config file
2. Generates the route pages (list, create, edit)
3. Adds the import and registration to `src/resources/index.ts`
4. The sidebar navigation updates automatically — no manual wiring needed

## How It Works Under the Hood

1. **Route pages** are thin wrappers that pass the resource config to generic page components
2. **`ResourceListPage`** (server component) reads URL search params and calls `queryRecords()` to fetch data
3. **`ResourceCreatePage`** / **`ResourceEditPage`** render `AutoForm` which builds forms from the field config
4. **CRUD server actions** validate the session, whitelist the model name, and execute Prisma queries
5. **The sidebar** reads from the resource registry and auto-generates navigation items
