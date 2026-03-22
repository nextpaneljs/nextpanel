"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { buildZodSchema } from "./validation";
import { FormSection } from "./form-section";
import {
  TextField,
  TextareaField,
  NumberField,
  SelectField,
  CheckboxField,
  DateField,
  RelationField,
} from "./field-types";
import type { ResourceConfig, FieldDefinition, NextPanelActions } from "../types";

interface AutoFormProps {
  resource: ResourceConfig;
  mode: "create" | "edit";
  defaultValues?: Record<string, unknown>;
  recordId?: string;
  actions: Pick<NextPanelActions, "createRecord" | "updateRecord" | "getRelationOptions">;
}

function FieldRenderer({
  definition,
  form,
  getRelationOptions,
}: {
  definition: FieldDefinition;
  form: ReturnType<typeof useForm<Record<string, unknown>>>;
  getRelationOptions: NextPanelActions["getRelationOptions"];
}) {
  switch (definition.type) {
    case "textarea":
    case "richtext":
      return <TextareaField definition={definition} form={form} />;
    case "number":
      return <NumberField definition={definition} form={form} />;
    case "select":
      return <SelectField definition={definition} form={form} />;
    case "checkbox":
      return <CheckboxField definition={definition} form={form} />;
    case "date":
      return <DateField definition={definition} form={form} />;
    case "relation":
      return <RelationField definition={definition} form={form} getRelationOptions={getRelationOptions} />;
    default:
      return <TextField definition={definition} form={form} />;
  }
}

export function AutoForm({
  resource,
  mode,
  defaultValues,
  recordId,
  actions,
}: AutoFormProps) {
  const router = useRouter();
  const schema = buildZodSchema(resource.form.fields, mode);

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? getDefaults(resource.form.fields, mode),
  });

  const visibleFields = resource.form.fields.filter((f) => {
    if (f.hiddenOn?.includes(mode)) return false;
    if (f.visibleOn && !f.visibleOn.includes(mode)) return false;
    return true;
  });

  async function onSubmit(data: Record<string, unknown>) {
    try {
      if (mode === "create") {
        await actions.createRecord(resource.model, resource.slug, data);
      } else {
        await actions.updateRecord(resource.model, resource.slug, recordId!, data);
      }
      toast.success(
        mode === "create"
          ? `${resource.label} created successfully`
          : `${resource.label} updated successfully`
      );
      router.push(`/admin/${resource.slug}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {resource.form.layout ? (
          resource.form.layout.map((section) => (
            <FormSection
              key={section.label}
              label={section.label}
              columns={section.columns}
            >
              {section.fields.map((fieldKey) => {
                const fieldDef = visibleFields.find(
                  (f) => f.key === fieldKey
                );
                if (!fieldDef) return null;
                return (
                  <div
                    key={fieldKey}
                    style={{
                      gridColumn: fieldDef.colSpan
                        ? `span ${fieldDef.colSpan}`
                        : undefined,
                    }}
                  >
                    <FieldRenderer definition={fieldDef} form={form} getRelationOptions={actions.getRelationOptions} />
                  </div>
                );
              })}
            </FormSection>
          ))
        ) : (
          <div className="space-y-4">
            {visibleFields.map((fieldDef) => (
              <FieldRenderer
                key={fieldDef.key}
                definition={fieldDef}
                form={form}
                getRelationOptions={actions.getRelationOptions}
              />
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving..."
              : mode === "create"
                ? `Create ${resource.label}`
                : `Update ${resource.label}`}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/${resource.slug}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

function getDefaults(
  fields: FieldDefinition[],
  mode: "create" | "edit"
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.hiddenOn?.includes(mode)) continue;
    if (field.visibleOn && !field.visibleOn.includes(mode)) continue;
    if (field.defaultValue !== undefined) {
      defaults[field.key] = field.defaultValue;
    }
  }
  return defaults;
}
