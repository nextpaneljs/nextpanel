import { z } from "zod";
import type { FieldDefinition } from "../types";

export function buildZodSchema(
  fields: FieldDefinition[],
  mode: "create" | "edit"
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    if (field.hiddenOn?.includes(mode)) continue;
    if (field.visibleOn && !field.visibleOn.includes(mode)) continue;

    let schema: z.ZodTypeAny;

    switch (field.type) {
      case "number":
        schema = z.coerce.number();
        if (field.validation?.min !== undefined) {
          schema = (schema as z.ZodNumber).min(field.validation.min);
        }
        if (field.validation?.max !== undefined) {
          schema = (schema as z.ZodNumber).max(field.validation.max);
        }
        break;
      case "checkbox":
        schema = z.boolean().default(false);
        break;
      case "date":
        schema = z.coerce.date();
        break;
      default:
        schema = z.string();
        if (field.validation?.minLength) {
          schema = (schema as z.ZodString).min(field.validation.minLength);
        }
        if (field.validation?.maxLength) {
          schema = (schema as z.ZodString).max(field.validation.maxLength);
        }
        if (field.validation?.pattern) {
          schema = (schema as z.ZodString).regex(
            new RegExp(field.validation.pattern)
          );
        }
        break;
    }

    if (!field.required) {
      schema = schema.optional();
    }

    shape[field.key] = schema;
  }

  return z.object(shape);
}
