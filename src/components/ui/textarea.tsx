import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-fg placeholder:text-muted/70 transition-[border-color,box-shadow] duration-150 ease-out",
        "focus-visible:border-primary focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}
