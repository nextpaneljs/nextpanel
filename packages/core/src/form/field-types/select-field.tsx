"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { FieldDefinition } from "../../types";
import type { UseFormReturn } from "react-hook-form";

interface SelectFieldProps {
  definition: FieldDefinition;
  form: UseFormReturn<Record<string, unknown>>;
}

export function SelectField({ definition, form }: SelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={definition.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value as string}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={definition.placeholder ?? `Select ${definition.label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {definition.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {definition.description && (
            <FormDescription>{definition.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
