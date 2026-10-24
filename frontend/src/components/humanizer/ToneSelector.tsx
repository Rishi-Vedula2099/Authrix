"use client";

import { cn } from "@/lib/utils";
import { Coffee, Briefcase, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export type ToneType = "casual" | "professional" | "academic";

interface ToneSelectorProps {
  value: ToneType;
  onChange: (value: ToneType) => void;
}

const TONES = [
  {
    id: "casual",
    label: "Casual",
    description: "Friendly and conversational.",
    icon: Coffee,
  },
  {
    id: "professional",
    label: "Professional",
    description: "Clear, polished, and objective.",
    icon: Briefcase,
  },
  {
    id: "academic",
    label: "Academic",
    description: "Scholarly and analytical.",
    icon: GraduationCap,
  },
] as const;

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TONES.map((tone) => {
        const Icon = tone.icon;
        const isSelected = value === tone.id;

        return (
          <button
            key={tone.id}
            onClick={() => onChange(tone.id as ToneType)}
            className={cn(
              "relative glass-card flex flex-col items-start gap-4 p-4 rounded-xl text-left border-2 transition-all duration-300",
              isSelected 
                ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                : "border-transparent hover:border-white/10 hover:bg-neutral-800"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="active-tone"
                className="absolute inset-x-0 -bottom-[2px] h-[2px] bg-primary rounded-full z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <div className={cn(
              "p-2 rounded-lg",
              isSelected ? "bg-primary/20 text-primary" : "bg-neutral-800 text-muted-foreground"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div>
              <h4 className={cn("font-semibold", isSelected ? "text-foreground" : "text-muted-foreground")}>
                {tone.label}
              </h4>
              <p className="text-xs text-neutral-500 mt-1">{tone.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
