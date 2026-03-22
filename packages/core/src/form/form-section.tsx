interface FormSectionProps {
  label: string;
  columns: number;
  children: React.ReactNode;
}

export function FormSection({ label, columns, children }: FormSectionProps) {
  return (
    <fieldset className="space-y-4 rounded-lg border p-4">
      <legend className="px-2 text-sm font-medium">{label}</legend>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {children}
      </div>
    </fieldset>
  );
}
