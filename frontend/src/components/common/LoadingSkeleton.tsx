"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type: "text" | "gauge" | "card" | "ring" | "history";
  count?: number;
}

export function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  const renderSkeletons = (content: React.ReactNode) => {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i}>{content}</div>
    ));
  };

  switch (type) {
    case "text":
      return (
        <div className="space-y-3">
          {renderSkeletons(
            <>
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-[90%] bg-white/5" />
              <Skeleton className="h-4 w-[95%] bg-white/5" />
              <Skeleton className="h-4 w-[80%] bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5 pt-4" />
              <Skeleton className="h-4 w-[85%] bg-white/5" />
            </>
          )}
        </div>
      );

    case "gauge":
      return (
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-[120px] w-[240px] rounded-t-full rounded-b-none bg-white/5" />
          <Skeleton className="h-6 w-32 bg-white/5 mt-4" />
        </div>
      );

    case "card":
      return (
        <div className={count > 1 ? `grid grid-cols-1 md:grid-cols-${Math.min(count, 3)} gap-4` : ""}>
          {renderSkeletons(
            <div className="glass-card rounded-xl p-6 border-white/10 space-y-4 h-full">
              <Skeleton className="h-6 w-32 bg-white/5" />
              <Skeleton className="h-20 w-full rounded-lg bg-white/5" />
              <div className="space-y-2 mt-auto pt-4 border-t border-white/5">
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-[80%] bg-white/5" />
              </div>
            </div>
          )}
        </div>
      );

    case "ring":
      return (
        <div className="flex items-center gap-3 bg-neutral-900/50 border border-white/5 pr-4 rounded-full pl-1 py-1 w-32">
          <Skeleton className="w-12 h-12 rounded-full bg-white/5" />
          <div className="flex flex-col space-y-1 w-16">
            <Skeleton className="h-3 w-full bg-white/5" />
            <Skeleton className="h-2 w-10 bg-white/5" />
          </div>
        </div>
      );

    case "history":
      return (
        <div className="space-y-4 w-full max-w-4xl mx-auto">
          {renderSkeletons(
            <div className="glass-card rounded-xl p-4 border-white/10 flex items-center justify-between">
              <div className="space-y-2 w-3/4">
                <Skeleton className="h-5 w-1/3 bg-white/5" />
                <Skeleton className="h-4 w-[90%] bg-white/5" />
              </div>
              <Skeleton className="h-10 w-24 bg-white/5 rounded-full" />
            </div>
          )}
        </div>
      );

    default:
      return <Skeleton className="h-10 w-full" />;
  }
}
