/* eslint-disable @next/next/no-img-element */
export function ImageCell({ value }: { value: unknown }) {
  if (!value) return <span className="text-muted-foreground">-</span>;

  return (
    <img
      src={String(value)}
      alt=""
      className="h-10 w-10 rounded-md object-cover"
    />
  );
}
