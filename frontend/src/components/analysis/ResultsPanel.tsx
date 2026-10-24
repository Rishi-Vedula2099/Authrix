"use client";

import { useResultStore } from "@/stores/resultStore";
import { ConfidenceGauge } from "./ConfidenceGauge";
import { Progress } from "@/components/ui/progress";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResultsPanel() {
  const { analyzeResult, isAnalyzing } = useResultStore();

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground animate-pulse">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        <p>Analyzing document...</p>
      </div>
    );
  }

  if (!analyzeResult) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground italic border border-dashed border-white/10 rounded-xl">
        Enter some text and click Analyze to see results here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* AI Confidence */}
      <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center border-white/10 transition-transform hover:scale-[1.02]">
        <ConfidenceGauge score={analyzeResult.ai_score} />
      </div>

      {/* Plagiarism Score */}
      <div className="glass-card rounded-xl p-6 flex flex-col justify-center gap-4 border-white/10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Originality</h3>
          <span className="text-xl font-bold font-mono text-primary">
            {100 - analyzeResult.plagiarism_score}%
          </span>
        </div>
        
        <div className="space-y-1.5">
          <Progress value={100 - analyzeResult.plagiarism_score} className="h-2 bg-neutral-800" />
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          {analyzeResult.plagiarism_score > 20 
            ? "We found significant matches with external sources." 
            : "This document appears to be mostly original."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-white/10">
        <div>
          <h3 className="font-semibold text-lg mb-4">Document Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm text-muted-foreground">Word Count</span>
              <span className="font-medium text-foreground">{analyzeResult.word_count}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm text-muted-foreground">Sentences</span>
              <span className="font-medium text-foreground">{analyzeResult.highlights.length}</span>
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-4 text-xs font-medium border-white/10 hover:bg-white/5">
          <Copy className="w-3.5 h-3.5 mr-2" /> Copy Full Report
        </Button>
      </div>
    </div>
  );
}
