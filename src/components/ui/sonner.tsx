"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, OctagonXIcon } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-ok" />,
        error: <OctagonXIcon className="size-4 text-error" />,
      }}
      style={
        {
          "--normal-bg": "var(--paper-raised)",
          "--normal-text": "var(--ink)",
          "--normal-border": "var(--rule)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
