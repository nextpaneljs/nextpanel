"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Textarea } from "../../ui/textarea";
import type { FieldDefinition } from "../../types";
import type { UseFormReturn } from "react-hook-form";

interface TextareaFieldProps {
  definition: FieldDefinition;
  form: UseFormReturn<Record<string, unknown>>;
}

export function TextareaField({ definition, form }: TextareaFieldProps) {
  return (
    <FormField
      control={form.control}
      name={definition.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={definition.placeholder}
              rows={5}
              {...field}
              value={(field.value as string) ?? ""}
            />
          </FormControl>
          {definition.description && (
            <FormDescription>{definition.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
