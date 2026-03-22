export function DateCell({
  value,
  format: _format,
}: {
  value: unknown;
  format?: string;
}) {
  if (!value) return <span className="text-muted-foreground">-</span>;

  const date = new Date(value as string | number | Date);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return <span>{formatted}</span>;
}
