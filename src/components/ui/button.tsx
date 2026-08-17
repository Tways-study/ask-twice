import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Filled Pill Button / Ghost Pill Button, per the reference: 980px-radius
  // pills, regular-weight label (the reference's own spec, not the brief's
  // former semibold).
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border font-sans text-base font-normal whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-transparent bg-pen text-paper hover:bg-pen-deep",
        outline: "border-ink/80 bg-transparent text-ink hover:border-pen hover:text-pen",
        ghost: "border-transparent bg-transparent text-ink hover:bg-paper-sunken",
        link: "border-transparent bg-transparent p-0 text-pen underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
