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

interface NumberFieldProps {
  definition: FieldDefinition;
  form: UseFormReturn<Record<string, unknown>>;
}

export function NumberField({ definition, form }: NumberFieldProps) {
  return (
    <FormField
      control={form.control}
      name={definition.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={definition.placeholder}
              {...field}
              value={(field.value as number) ?? ""}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
