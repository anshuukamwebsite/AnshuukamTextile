"use client";

import { cn } from "@/lib/utils";

export function StitchingLoader({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Sewing Machine Needle Animation */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-foreground/80 animate-needle-move origin-top">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-foreground/80" />
                    {/* Eye of the needle */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-3 border-2 border-foreground/80 rounded-full" />
                </div>

                {/* Fabric/Thread being stitched */}
                <div className="absolute bottom-4 left-0 w-full h-0.5 bg-border overflow-hidden">
                    <div className="w-full h-full bg-accent animate-stitch-line" />
                </div>
            </div>
            <p className="text-sm font-mono text-muted-foreground animate-pulse">STITCHING...</p>
        </div>
    );
}
