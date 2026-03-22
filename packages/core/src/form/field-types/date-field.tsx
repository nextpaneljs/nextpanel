"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import type { FieldDefinition } from "../../types";
import type { UseFormReturn } from "react-hook-form";

interface DateFieldProps {
  definition: FieldDefinition;
  form: UseFormReturn<Record<string, unknown>>;
}

export function DateField({ definition, form }: DateFieldProps) {
  return (
    <FormField
      control={form.control}
      name={definition.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.label}</FormLabel>
          <FormControl>
            <Input
              type="datetime-local"
              {...field}
              value={
                field.value
                  ? new Date(field.value as string)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
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
