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

interface TextFieldProps {
  definition: FieldDefinition;
  form: UseFormReturn<Record<string, unknown>>;
}

export function TextField({ definition, form }: TextFieldProps) {
  return (
    <FormField
      control={form.control}
      name={definition.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.label}</FormLabel>
          <FormControl>
            <Input
              placeholder={definition.placeholder}
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
