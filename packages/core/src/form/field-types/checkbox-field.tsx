"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Checkbox } from "../../ui/checkbox";
import type { FieldDefinition } from "../../types";
import type { UseFormReturn } from "react-hook-form";

interface CheckboxFieldProps {
  definition: FieldDefinition;
  form: UseFormReturn<Record<string, unknown>>;
}

export function CheckboxField({ definition, form }: CheckboxFieldProps) {
  return (
    <FormField
      control={form.control}
      name={definition.key}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{definition.label}</FormLabel>
            {definition.description && (
              <FormDescription>{definition.description}</FormDescription>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
