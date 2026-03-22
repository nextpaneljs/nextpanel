# CLI

The NextPanel CLI generates resources, models, and pages from the command line — following the Next.js ecosystem convention of `npx <package> <command>`.

## Setup

The CLI is in `packages/cli`. Build it before first use:

```bash
cd packages/cli
npm run build
```

Run commands from the `packages/app` directory:

```bash
cd packages/app
npx nextpanel add resource Post
```

> During local development, use `node ../cli/dist/index.js` instead of `npx nextpanel`.
> Once published to npm, users will use `npx nextpanel`

## Commands

### `npx nextpanel add resource <Name>`

Generates a complete resource with CRUD pages.

```bash
npx nextpanel add resource Post
```

**What it creates:**

| File | Purpose |
|------|---------|
| `src/resources/post.resource.ts` | Resource configuration (columns, fields, etc.) |
| `src/app/admin/posts/page.tsx` | List page |
| `src/app/admin/posts/create/page.tsx` | Create page |
| `src/app/admin/posts/[id]/edit/page.tsx` | Edit page |
| Updates `src/resources/index.ts` | Registers the resource |

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--from-model` | Auto-generate columns and fields from Prisma schema | — |
| `--icon <name>` | Lucide icon name for sidebar | `"File"` |
| `--group <name>` | Navigation group in sidebar | `"Resources"` |

**Examples:**

```bash
# Basic resource with default columns
npx nextpanel add resource Category

# From Prisma model with custom icon and group
npx nextpanel add resource Post --from-model --icon FileText --group Content

# Blog comments resource
npx nextpanel add resource Comment --from-model --icon MessageSquare --group Content
```

### `npx nextpanel add model <Name>`

Interactively adds a new model to `prisma/schema.prisma`.

```bash
npx nextpanel add model Product
```

The CLI will prompt you for each field:
- Field name
- Field type (String, Int, Float, Boolean, DateTime, etc.)
- Required?
- Unique?
- Has default value?

**Options:**

| Flag | Description |
|------|-------------|
| `--no-timestamps` | Skip `createdAt`/`updatedAt` fields |

**Example session:**

```
$ npx nextpanel add model Product

Creating model: Product

? Field name: name
? Field type: String
? Required? Yes
? Unique? No
? Has default value? No
? Add another field? Yes

? Field name: price
? Field type: Float
? Required? Yes
? Unique? No
? Has default value? No
? Add another field? Yes

? Field name: inStock
? Field type: Boolean
? Required? Yes
? Unique? No
? Has default value? Yes
? Default value: true
? Add another field? No

Model "Product" added to prisma/schema.prisma
Run "npx prisma db push" to apply changes to your database.
```

This appends to your schema:

```prisma
model Product {
  id        String   @id @default(cuid())
  name      String
  price     Float
  inStock   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Typical Workflow

```bash
# 1. Create a model
npx nextpanel add model Product

# 2. Push to database
npx prisma db push

# 3. Generate the resource from the model
npx nextpanel add resource Product --from-model --icon Package --group Shop

# 4. Customize the generated resource config as needed
# Edit src/resources/product.resource.ts

# 5. Start the dev server and visit /admin/products
npm run dev
```

## How `--from-model` Works

When you use `--from-model`, the CLI:

1. Reads `prisma/schema.prisma`
2. Finds the model matching your resource name
3. Maps Prisma field types to table columns and form fields:

| Prisma Type | Table Column | Form Field |
|-------------|-------------|------------|
| `String` | text (sortable, searchable) | text |
| `Int`, `Float`, `Decimal` | text (sortable) | number |
| `Boolean` | boolean | checkbox |
| `DateTime` | date (sortable) | date |
| `Json` | text | textarea |
| Relation | skipped | skipped (FK field kept as text) |

4. Auto-excludes internal fields from forms: `id`, `createdAt`, `updatedAt`, `password`, tokens
5. Sets the default sort to `createdAt` (or `id` if no `createdAt` field)

## Icons

The `--icon` flag accepts any [Lucide icon](https://lucide.dev/icons) name in PascalCase:

```bash
--icon FileText      # Documents
--icon Users         # People
--icon Package       # Products
--icon Tag           # Categories
--icon MessageSquare # Comments
--icon Settings      # Configuration
--icon ShoppingCart  # Orders
--icon Image         # Media
```
