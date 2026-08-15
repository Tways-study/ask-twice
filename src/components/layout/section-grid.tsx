import { cn } from "@/lib/utils";

export function SectionGrid({
  note,
  children,
  className,
}: {
  note?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("lg:grid lg:grid-cols-12 lg:gap-x-6", className)}>
      {note && (
        <div className="mb-4 lg:col-span-2 lg:col-start-1 lg:mb-0">{note}</div>
      )}
      <div className="lg:col-span-9 lg:col-start-3">{children}</div>
    </div>
  );
}
