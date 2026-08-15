import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full rounded-lg border border-rule bg-paper-raised px-3.5 py-3 text-base text-ink transition-colors outline-none placeholder:text-ink-faint focus-visible:border-pen focus-visible:ring-2 focus-visible:ring-pen/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
