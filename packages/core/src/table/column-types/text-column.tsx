export function TextCell({ value }: { value: unknown }) {
  const text = value != null ? String(value) : "";
  return <span className="max-w-[300px] truncate">{text}</span>;
}
