"use client";

import { useUsageStore } from "@/stores/usageStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function UsageRing() {
  const { usage, fetchUsage } = useUsageStore();
  const [animatedUsed, setAnimatedUsed] = useState(0);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const used = usage?.used || 0;
  const max = usage?.max_daily || 12;
  const percentage = (used / max) * 100;

  useEffect(() => {
    // Simple spring animation
    let start = 0;
    const duration = 1000;
    const timer = setInterval(() => {
      start += 0.5;
      if (start >= used) {
        setAnimatedUsed(used);
        clearInterval(timer);
      } else {
        setAnimatedUsed(Math.round(start));
      }
    }, duration / (used * 2 || 1));

    return () => clearInterval(timer);
  }, [used]);

  const radius = 24;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color logic
  const color = percentage >= 100 ? "var(--ai-content)" : percentage >= 75 ? "var(--ai-suspicious)" : "var(--ai-human)";

  return (
    <div className="flex items-center gap-3 bg-neutral-900/50 border border-white/5 pr-4 rounded-full pl-1 py-1">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke="rgba(255,255,255,0.1)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono">
          {animatedUsed}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">Scans Used</span>
        <span className="text-[10px] text-muted-foreground">{max - used} remaining today</span>
      </div>
    </div>
  );
}
