# Forms

NextPanel builds forms automatically from your resource config. Define fields, validation rules, and layout — the framework handles rendering, validation, and submission.

## How Forms Work

1. You define `fields` and optional `layout` in your resource config
2. `AutoForm` builds a **Zod schema** from your field definitions for validation
3. **React Hook Form** handles form state with the Zod resolver
4. Each field type maps to a shadcn/ui component
5. On submit, a **server action** creates or updates the record via Prisma

## Field Types

### Text Field

Standard text input.

```typescript
{
  key: "title",
  label: "Title",
  type: "text",
  required: true,
  placeholder: "Enter title",
  description: "The post title shown to users",
  validation: { minLength: 3, maxLength: 255 },
}
```

### Textarea Field

Multi-line text input.

```typescript
{ key: "content", label: "Content", type: "textarea" }
```

### Rich Text Field

Uses the textarea component (same as `textarea` — extend with a rich text editor as needed).

```typescript
{ key: "body", label: "Body", type: "richtext", colSpan: 2 }
```

### Number Field

Numeric input with optional min/max validation.

```typescript
{
  key: "price",
  label: "Price",
  type: "number",
  required: true,
  validation: { min: 0, max: 99999 },
}
```

### Select Field

Dropdown select with predefined options.

```typescript
{
  key: "status",
  label: "Status",
  type: "select",
  required: true,
  options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
  ],
  defaultValue: "draft",
}
```

### Checkbox Field

Boolean toggle.

```typescript
{ key: "published", label: "Published", type: "checkbox", description: "Make this post visible" }
```

### Date Field

Date/time picker using native `datetime-local` input.

```typescript
{ key: "publishedAt", label: "Publish Date", type: "date" }
```

### Relation Field

Dropdown that loads options from a related model. Fetches data via a server action.

```typescript
{
  key: "authorId",
  label: "Author",
  type: "relation",
  required: true,
  relation: {
    model: "user",         // Prisma model to query
    displayField: "name",  // Field to show in dropdown
    valueField: "id",      // Field to use as value
  },
}
```

## Field Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | `string` | required | Database column name |
| `label` | `string` | required | Display label |
| `type` | `string` | `"text"` | Field type (see above) |
| `required` | `boolean` | `false` | Whether the field is required |
| `placeholder` | `string` | — | Input placeholder text |
| `description` | `string` | — | Help text below the field |
| `defaultValue` | `unknown` | — | Default value for create forms |
| `options` | `array` | — | Options for select fields: `[{ label, value }]` |
| `relation` | `object` | — | Config for relation fields: `{ model, displayField, valueField }` |
| `colSpan` | `number` | `1` | Number of grid columns to span (in sectioned layouts) |
| `hiddenOn` | `array` | — | Hide on specific modes: `["create"]` or `["edit"]` |
| `visibleOn` | `array` | — | Show only on specific modes: `["create"]` or `["edit"]` |
| `validation` | `object` | — | Validation rules (see below) |

## Validation

Validation rules map directly to Zod validators:

```typescript
validation: {
  minLength: 3,    // String minimum length
  maxLength: 255,  // String maximum length
  min: 0,          // Number minimum value
  max: 100,        // Number maximum value
  pattern: "^[a-z0-9-]+$",  // Regex pattern
}
```

The framework auto-builds a Zod schema from your field definitions. Required fields use `z.string()` (or appropriate type), optional fields use `.optional()`.

## Form Layout

By default, fields render in a single column. Use `layout` to organize fields into sections with a grid:

```typescript
form: {
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", required: true },
    { key: "content", label: "Content", type: "richtext", colSpan: 2 },
    { key: "status", label: "Status", type: "select", options: [...] },
    { key: "authorId", label: "Author", type: "relation", relation: {...} },
  ],
  layout: [
    {
      type: "section",
      label: "Details",
      columns: 2,                          // 2-column grid
      fields: ["title", "slug", "content"] // content spans 2 cols via colSpan
    },
    {
      type: "section",
      label: "Publishing",
      columns: 1,                          // Single column
      fields: ["status", "authorId"]
    },
  ],
},
```

Each section renders as a bordered fieldset with a title. Fields within a section follow the grid defined by `columns`.

## Conditional Visibility

Show or hide fields based on whether the user is creating or editing:

```typescript
// Only show on create form
{ key: "password", label: "Password", type: "text", visibleOn: ["create"] }

// Hide on edit form
{ key: "slug", label: "Slug", type: "text", hiddenOn: ["edit"] }
```

## Full Form Config Example

```typescript
form: {
  fields: [
    { key: "title", label: "Title", type: "text", required: true,
      validation: { minLength: 3, maxLength: 255 }, placeholder: "Post title" },
    { key: "slug", label: "Slug", type: "text", required: true,
      description: "URL-friendly identifier", hiddenOn: ["edit"] },
    { key: "content", label: "Content", type: "richtext", colSpan: 2 },
    { key: "status", label: "Status", type: "select", required: true,
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      defaultValue: "draft" },
    { key: "authorId", label: "Author", type: "relation", required: true,
      relation: { model: "user", displayField: "name", valueField: "id" } },
    { key: "published", label: "Published", type: "checkbox" },
  ],
  layout: [
    { type: "section", label: "Details", columns: 2, fields: ["title", "slug", "content"] },
    { type: "section", label: "Publishing", columns: 1, fields: ["status", "authorId", "published"] },
  ],
},
```
