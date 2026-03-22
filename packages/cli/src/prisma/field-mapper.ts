import type { ParsedField, ParsedModel } from "./schema-parser";

interface MappedColumn {
  key: string;
  label: string;
  type: "text" | "badge" | "boolean" | "date" | "image";
  sortable: boolean;
  searchable: boolean;
}

interface MappedFormField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "relation";
  required: boolean;
  relation?: {
    model: string;
    displayField: string;
    valueField: string;
  };
}

interface MappedInclude {
  [key: string]: { select: Record<string, boolean> };
}

const EXCLUDED_TABLE_FIELDS = ["password", "accessToken", "refreshToken", "idToken"];
const EXCLUDED_FORM_FIELDS = [
  "id",
  "createdAt",
  "updatedAt",
  "password",
  "accessToken",
  "refreshToken",
  "idToken",
];

function fieldToLabel(name: string): string {
  if (name === "id") return "ID";
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/\s*Id$/, "")
    .trim();
}

/**
 * Detect if a field is a foreign key by checking if a relation field references it.
 * e.g., authorId is a FK if there's a relation field "author" with @relation(fields: [authorId])
 */
function findRelationForFK(fkField: ParsedField, allFields: ParsedField[]): ParsedField | null {
  // Check if field name ends with "Id" and there's a relation with matching name
  if (!fkField.name.endsWith("Id")) return null;
  const relationName = fkField.name.slice(0, -2); // "authorId" -> "author"
  return allFields.find((f) => f.isRelation && f.name === relationName) || null;
}

export function mapFieldToColumn(field: ParsedField, allFields: ParsedField[]): MappedColumn | null {
  if (field.isRelation) return null;
  if (field.isList) return null;
  if (EXCLUDED_TABLE_FIELDS.includes(field.name)) return null;

  // Skip FK fields — we'll show the relation display field instead
  const relation = findRelationForFK(field, allFields);
  if (relation) return null;

  const column: MappedColumn = {
    key: field.name,
    label: fieldToLabel(field.name),
    type: "text",
    sortable: false,
    searchable: false,
  };

  switch (field.type) {
    case "Boolean":
      column.type = "boolean";
      break;
    case "DateTime":
      column.type = "date";
      column.sortable = true;
      break;
    case "String":
      column.type = "text";
      column.sortable = true;
      column.searchable = !field.isId;
      break;
    case "Int":
    case "Float":
    case "Decimal":
    case "BigInt":
      column.type = "text";
      column.sortable = true;
      break;
    default:
      column.type = "text";
  }

  if (field.isId) {
    column.sortable = true;
    column.searchable = false;
  }

  return column;
}

export function mapFieldToFormField(field: ParsedField, allFields: ParsedField[]): MappedFormField | null {
  if (EXCLUDED_FORM_FIELDS.includes(field.name)) return null;
  if (field.isList) return null;

  // Skip relation objects, but keep foreign key fields
  if (field.isRelation) return null;

  const formField: MappedFormField = {
    key: field.name,
    label: fieldToLabel(field.name),
    type: "text",
    required: field.isRequired && !field.hasDefault,
  };

  // Check if this is a foreign key — map to relation field
  const relation = findRelationForFK(field, allFields);
  if (relation && relation.relationModel) {
    formField.type = "relation";
    formField.label = fieldToLabel(relation.name);
    formField.relation = {
      model: relation.relationModel.charAt(0).toLowerCase() + relation.relationModel.slice(1),
      displayField: "name",
      valueField: "id",
    };
    return formField;
  }

  switch (field.type) {
    case "Boolean":
      formField.type = "checkbox";
      break;
    case "DateTime":
      formField.type = "date";
      break;
    case "Int":
    case "Float":
    case "Decimal":
    case "BigInt":
      formField.type = "number";
      break;
    case "Json":
      formField.type = "textarea";
      break;
    default:
      formField.type = "text";
  }

  return formField;
}

export function mapFieldsToColumns(fields: ParsedField[]): MappedColumn[] {
  // Map regular fields
  const columns = fields
    .map((f) => mapFieldToColumn(f, fields))
    .filter((c): c is MappedColumn => c !== null);

  // Add relation display columns for FK fields
  for (const field of fields) {
    if (field.isRelation && !field.isList) {
      columns.push({
        key: `${field.name}.name`,
        label: fieldToLabel(field.name),
        type: "text",
        sortable: false,
        searchable: false,
      });
    }
  }

  return columns;
}

export function mapFieldsToFormFields(fields: ParsedField[]): MappedFormField[] {
  return fields
    .map((f) => mapFieldToFormField(f, fields))
    .filter((f): f is MappedFormField => f !== null);
}

/**
 * Build Prisma include object for eager loading relations.
 */
export function buildInclude(fields: ParsedField[]): MappedInclude | undefined {
  const include: MappedInclude = {};
  let hasRelations = false;

  for (const field of fields) {
    if (field.isRelation && !field.isList) {
      include[field.name] = { select: { id: true, name: true } };
      hasRelations = true;
    }
  }

  return hasRelations ? include : undefined;
}
