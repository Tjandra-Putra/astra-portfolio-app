import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-600 hover:bg-secondary/80 hover:text-black transition duration-300",
        diamond: "border-transparent bg-[#63e6be] text-[#183153] hover:bg-[#63e6be]/80",
        sky: "border-transparent bg-[#74c0fc] text-[#183153] hover:bg-[#74c0fc]/80",
        ocean: "border-transparent bg-[#3e6392] text-[#ffffff] hover:bg-[#3e6392]/80",
        cheese: "border-transparent bg-cheese text-[#183153] hover:bg-cheese/80",
        tomato: "border-transparent bg-[#ff8787] text-[#183153] hover:bg-[#ff8787]/80",
        navy: "border-transparent bg-[#1d3554] text-white hover:bg-[#1d3554]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
