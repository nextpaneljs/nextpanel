import { Badge } from "../../ui/badge";

interface BadgeCellProps {
  value: unknown;
  options?: Record<string, string>;
}

export function BadgeCell({ value, options }: BadgeCellProps) {
  const text = value != null ? String(value) : "";
  const variant = (options?.[text] ?? "default") as
    | "default"
    | "secondary"
    | "destructive"
    | "outline";

  return <Badge variant={variant}>{text}</Badge>;
}
