import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50 transition-[transform,background-color,color,border-color,opacity,box-shadow] duration-200 ease-out hover:-translate-y-0.5 active:not-disabled:translate-y-0 active:not-disabled:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-cream hover:bg-primary-dark shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-cream)_12%,transparent)]",
        outline:
          "border border-border-strong bg-transparent text-fg hover:border-cream hover:bg-cream/5",
        ghost: "bg-transparent text-fg hover:bg-cream/8",
        cream: "bg-cream text-ink hover:bg-blush",
      },
      size: {
        sm: "h-10 px-4 text-sm rounded-[10px]",
        md: "h-12 px-5 text-sm rounded-md",
        lg: "h-14 px-7 text-base rounded-lg",
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
