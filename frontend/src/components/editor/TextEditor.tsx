"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useUsageStore } from "@/stores/usageStore";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export function TextEditor() {
  const { content, setContent, wordCount } = useEditorStore();
  const { usage } = useUsageStore();
  const maxWords = usage?.max_daily || 600; // Defaulting to 600 if settings not loaded yet

  const isOverLimit = wordCount > maxWords;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="relative group rounded-xl border border-white/10 bg-neutral-900/50 p-4 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Paste your text here to analyze for AI generated content or to humanize it..."
        className="min-h-[300px] w-full resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground placeholder:text-neutral-500"
      />
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-md",
            isOverLimit 
              ? "bg-destructive/10 text-destructive" 
              : "bg-primary/10 text-primary"
          )}
        >
          {wordCount} / {maxWords} words
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <kbd className="font-sans px-1.5 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-400">Ctrl</kbd> + <kbd className="font-sans px-1.5 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-400">Enter</kbd> to analyze
        </span>
      </div>
    </div>
  );
}
