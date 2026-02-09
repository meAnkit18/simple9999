"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PlaceholderVisualProps {
    className?: string;
}

export function PlaceholderVisual({ className }: PlaceholderVisualProps) {
    return (
        <div
            className={cn(
                "w-full h-full min-h-[300px] rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 flex items-center justify-center",
                className
            )}
        >
            <div className="text-muted-foreground/50 text-sm font-medium">
                Image Placeholder
            </div>
        </div>
    );
}
