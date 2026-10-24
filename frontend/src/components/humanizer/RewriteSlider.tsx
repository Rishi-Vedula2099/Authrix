"use client";

import { Slider } from "@/components/ui/slider";

interface RewriteSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function RewriteSlider({ value, onChange }: RewriteSliderProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-muted-foreground">AI-like</span>
        <span className="text-primary font-bold">Human-like</span>
      </div>
      
      <div className="relative pt-2 pb-6 px-1">
        <Slider
          defaultValue={[50]}
          value={[value]}
          max={100}
          step={1}
          onValueChange={(vals) => onChange(typeof vals === 'number' ? vals : vals[0])}
          className="w-full"
        />
        
        {/* Mock visual guide for the slider thumb */}
        <div 
          className="absolute text-[10px] text-muted-foreground font-mono mt-2 transform -translate-x-1/2 transition-all duration-200"
          style={{ left: `${value}%` }}
        >
          {value}%
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground text-center italic">
        Adjusting this changes how much "imperfection" and natural variation is added to the text.
      </p>
    </div>
  );
}
