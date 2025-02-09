import { cn } from "@/lib/utils";
import React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card p-4 shadow", className)}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
