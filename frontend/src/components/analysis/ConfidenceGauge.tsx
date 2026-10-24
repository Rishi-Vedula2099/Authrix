"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfidenceGaugeProps {
  score: number; // 0 to 100
}

export function ConfidenceGauge({ score }: ConfidenceGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to target
    const duration = 1500; // 1.5s
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.min(score, Math.round((currentStep / steps) * score)));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Map score to color
  const getColor = (s: number) => {
    if (s >= 70) return "var(--ai-content)"; // Red
    if (s >= 40) return "var(--ai-suspicious)"; // Yellow
    return "var(--ai-human)"; // Green
  };

  const getLabel = (s: number) => {
    if (s >= 70) return "AI Generated";
    if (s >= 40) return "Suspicious";
    return "Human Written";
  };

  const color = getColor(animatedScore);
  const label = getLabel(animatedScore);

  // SVG parameters
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Arc represents 180 degrees (half circle)
  const strokeDashoffset = circumference - (animatedScore / 100) * (circumference / 2);

  // Calculate rotation for needle
  const rotation = (animatedScore / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="absolute top-0 rotate-180 transform-origin-center"
        >
          {/* Background Arc */}
          <circle
            stroke="rgba(255,255,255,0.1)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference / 2} ${circumference}`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
          {/* Foreground Arc */}
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference / 2} ${circumference}`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 w-2 h-16 origin-bottom rounded-full"
          style={{ backgroundColor: color }}
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Needle base */}
        <div className="absolute bottom-[-10px] w-6 h-6 rounded-full bg-neutral-800 border-4 border-neutral-900 z-10" />

        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center">
          <span className="text-3xl font-bold tracking-tighter" style={{ color }}>{animatedScore}%</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-1">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">AI Probability</span>
        <span className="text-lg font-semibold" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}
