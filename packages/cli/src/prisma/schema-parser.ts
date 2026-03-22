import fs from "fs";
import path from "path";

export interface ParsedField {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  isId: boolean;
  isUnique: boolean;
  hasDefault: boolean;
  isUpdatedAt: boolean;
  isRelation: boolean;
  relationModel?: string;
}

export interface ParsedModel {
  name: string;
  fields: ParsedField[];
}

/**
 * Simple Prisma schema parser that extracts model information
 * without depending on @prisma/internals (which has compatibility issues).
 */
export function parseSchema(schemaPath: string): ParsedModel[] {
  const content = fs.readFileSync(schemaPath, "utf-8");
  const models: ParsedModel[] = [];
  const lines = content.split("\n");

  let currentModel: ParsedModel | null = null;
  let braceCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Match model declaration
    const modelMatch = trimmed.match(/^model\s+(\w+)\s*\{/);
    if (modelMatch) {
      currentModel = { name: modelMatch[1], fields: [] };
      braceCount = 1;
      continue;
    }

    if (currentModel) {
      if (trimmed === "}") {
        braceCount--;
        if (braceCount === 0) {
          models.push(currentModel);
          currentModel = null;
        }
        continue;
      }

      // Skip comments and empty lines
      if (trimmed.startsWith("//") || trimmed.startsWith("///") || trimmed === "") {
        continue;
      }

      // Parse field line: name Type modifiers @attributes
      const fieldMatch = trimmed.match(
        /^(\w+)\s+([\w\[\]?]+)\s*(.*)?$/
      );
      if (fieldMatch) {
        const [, name, rawType, rest = ""] = fieldMatch;
        const isList = rawType.endsWith("[]");
        const isOptional = rawType.endsWith("?");
        const baseType = rawType.replace("[]", "").replace("?", "");

        // Check if it's a relation (type starts with uppercase and isn't a known Prisma scalar)
        const scalarTypes = [
          "String",
          "Int",
          "Float",
          "Boolean",
          "DateTime",
          "BigInt",
          "Decimal",
          "Bytes",
          "Json",
        ];
        const isRelation = !scalarTypes.includes(baseType) && /^[A-Z]/.test(baseType);

        const field: ParsedField = {
          name,
          type: baseType,
          isRequired: !isOptional && !isList,
          isList,
          isId: rest.includes("@id"),
          isUnique: rest.includes("@unique"),
          hasDefault: rest.includes("@default"),
          isUpdatedAt: rest.includes("@updatedAt"),
          isRelation,
          relationModel: isRelation ? baseType : undefined,
        };

        currentModel.fields.push(field);
      }
    }
  }

  return models;
}

export function findModel(
  schemaPath: string,
  modelName: string
): ParsedModel | undefined {
  const models = parseSchema(schemaPath);
  return models.find(
    (m) => m.name.toLowerCase() === modelName.toLowerCase()
  );
}

export function getSchemaPath(): string {
  const candidates = [
    path.join(process.cwd(), "prisma", "schema.prisma"),
    path.join(process.cwd(), "..", "app", "prisma", "schema.prisma"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "Could not find prisma/schema.prisma. Make sure you're in the project directory."
  );
}
