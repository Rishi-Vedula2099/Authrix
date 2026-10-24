"use client";

import { useResultStore } from "@/stores/resultStore";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Shadcn primitive

export function HeatmapView() {
  const { analyzeResult } = useResultStore();

  if (!analyzeResult || !analyzeResult.highlights.length) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground italic h-64 border border-white/10 rounded-xl bg-neutral-900/50">
        Results will appear here...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-6 shadow-sm overflow-hidden h-full">
      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse"></span>
        AI Detection Heatmap
      </h3>
      
      <div className="prose prose-invert prose-p:leading-relaxed max-w-none">
        <p className="text-lg">
          <TooltipProvider>
            <>
              {analyzeResult.highlights.map((highlight, index) => {
                const bgClass =
                  highlight.label === "ai"
                    ? "bg-red-500/20 text-red-200 border-b border-red-500/30 font-medium"
                    : highlight.label === "suspicious"
                    ? "bg-yellow-500/20 text-yellow-200 border-b border-yellow-500/30"
                    : "text-neutral-300"; // Human
                    
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger>
                      <span 
                        className={cn(
                          "transition-all duration-300 rounded px-0.5 mx-[1px]", 
                          bgClass,
                          highlight.label !== "human" && "hover:bg-opacity-40 cursor-help"
                        )}
                      >
                        {highlight.sentence}{" "}
                      </span>
                    </TooltipTrigger>
                    
                    {highlight.label !== "human" && (
                      <TooltipContent side="top" className="bg-neutral-800 border-white/10 shadow-xl">
                        <div className="text-sm font-medium">
                          AI Probability: <span className={highlight.label === "ai" ? "text-red-400" : "text-yellow-400"}>
                            {Math.round(highlight.score * 100)}%
                          </span>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </>
          </TooltipProvider>
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6 pt-4 border-t border-white/5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
          AI Generated
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          Suspicious
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-neutral-500/50"></span>
          Human Written
        </div>
      </div>
    </div>
  );
}
