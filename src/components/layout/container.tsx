import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1180px] px-[clamp(1.25rem,5vw,5rem)]",
        className
      )}
    >
      {children}
    </div>
  );
}
