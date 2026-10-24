"use client";

import { useResultStore } from "@/stores/resultStore";
import { HeatmapView } from "./HeatmapView";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SplitScreenView() {
  const { analyzeResult, humanizeResult } = useResultStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (humanizeResult?.humanized_text) {
      navigator.clipboard.writeText(humanizeResult.humanized_text);
      setCopied(true);
      toast.success("Text copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left: Original with Heatmap */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Original Content
          </h3>
        </div>
        <HeatmapView />
      </div>

      {/* Right: Humanized Output */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Humanized Version
          </h3>
          {humanizeResult && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 border-white/10 hover:bg-neutral-800"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-6 shadow-sm overflow-auto h-full min-h-[300px]">
          {humanizeResult ? (
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-neutral-200 whitespace-pre-wrap">
                {humanizeResult.humanized_text}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground italic gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              Humanized text will appear here after conversion...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
