import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-argus-teal disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: { default: "bg-argus-teal text-slate-950 hover:bg-teal-200", outline: "border border-white/25 bg-transparent text-white hover:bg-white/10", ghost: "text-white hover:bg-white/10" },
    size: { default: "h-11 px-5", sm: "h-9 px-3", lg: "h-12 px-6", icon: "h-10 w-10" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";
