import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // Pill shell with a clipped sheen overlay (decorative only, non-interactive).
    "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight whitespace-nowrap select-none",
    "after:pointer-events-none after:absolute after:inset-0 after:content-['']",
    "after:bg-[linear-gradient(105deg,transparent_42%,rgba(255,255,255,0.22)_50%,transparent_58%)]",
    "after:translate-x-[-135%] after:transition-[translate] after:duration-700 after:ease-out hover:after:translate-x-[135%]",
    // Tactile press without positional wobble — hover motion belongs to the
    // Magnetic wrapper; the surface treatment (shadow/glow/sheen) carries hover.
    "transition-[scale,background-color,color,border-color,box-shadow,opacity] duration-300 ease-out",
    "active:not-disabled:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-cream shadow-[inset_0_1px_0_color-mix(in_oklab,white_30%,transparent),0_12px_32px_-12px_color-mix(in_oklab,var(--color-primary)_65%,transparent)] hover:bg-primary-dark hover:shadow-[inset_0_1px_0_color-mix(in_oklab,white_30%,transparent),0_16px_40px_-10px_color-mix(in_oklab,var(--color-primary)_80%,transparent)]",
        outline:
          "border border-border-strong bg-cream/[0.03] text-fg shadow-[inset_0_1px_0_color-mix(in_oklab,white_8%,transparent)] hover:border-cream/70 hover:bg-cream/[0.08] hover:shadow-[inset_0_1px_0_color-mix(in_oklab,white_14%,transparent),0_12px_32px_-16px_color-mix(in_oklab,white_40%,transparent)]",
        ghost: "bg-transparent text-fg hover:bg-cream/8",
        cream:
          "bg-cream text-ink shadow-[inset_0_1px_0_color-mix(in_oklab,white_60%,transparent),0_12px_32px_-14px_color-mix(in_oklab,white_35%,transparent)] hover:bg-blush",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
