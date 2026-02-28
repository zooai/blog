import React from "react";
import { cn } from "@/lib/utils";

interface PromoContentProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export function PromoContent({
  variant = "desktop",
  className,
}: PromoContentProps) {
  if (variant === "mobile") {
    return (
      <div className={cn("border-t border-border bg-muted/20 p-3", className)}>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground/90 truncate">
              Zoo Labs Foundation
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Open AI research for everyone
            </p>
          </div>
          <a
            href="https://zoo.ngo"
            className="text-xs text-primary hover:text-primary/80 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Learn more
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("border border-border rounded-lg p-4 bg-card", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold tracking-tighter">
            Zoo Labs Foundation
          </h3>
          <p className="text-sm text-muted-foreground">
            501(c)(3) non-profit advancing open AI research, decentralized
            science, and community-governed intelligence. Tax-deductible
            donations fund open model development.
          </p>
          <a
            href="https://zoo.ngo"
            className="text-sm text-primary hover:text-primary/80 font-medium mt-2"
          >
            Visit zoo.ngo
          </a>
        </div>
      </div>
    </div>
  );
}
