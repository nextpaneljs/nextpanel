"use client";

import { useEffect, useState } from "react";
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

interface RelationFieldProps {
  definition: FieldDefinition;
  form: UseFormReturn<Record<string, unknown>>;
  getRelationOptions: (
    model: string,
    displayField: string,
    valueField: string
  ) => Promise<{ label: string; value: string }[]>;
}

export function RelationField({ definition, form, getRelationOptions }: RelationFieldProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );

  useEffect(() => {
    if (definition.relation) {
      getRelationOptions(
        definition.relation.model,
        definition.relation.displayField,
        definition.relation.valueField
      ).then(setOptions);
    }
  }, [definition.relation, getRelationOptions]);

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
                <SelectValue
                  placeholder={
                    definition.placeholder ?? `Select ${definition.label}`
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
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
