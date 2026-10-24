"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { HistoryResponse, HistoryItem } from "@/types";
import { Sidebar } from "@/components/layout/Sidebar";
import { format } from "date-fns";
import { FileText, ShieldAlert, Wand2, Calendar } from "lucide-react";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchHistory = async () => {
        try {
          const res = await api.get<HistoryResponse>("/usage/history?limit=50");
          setHistory(res.data.items);
        } catch (error) {
          console.error("Failed to fetch history:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      // Need to use the right endpoint: app/api/routes/usage.py -> router.get("/history")
      // wait, the router prefix wasn't /usage/history. The router in main.py included usage_router.
      // usage_router has @router.get("/usage") and @router.get("/history"). So it's just /history
      api.get<HistoryResponse>("/history?limit=50")
        .then(res => setHistory(res.data.items))
        .catch(err => console.error("Failed to fetch history", err))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null; // Let the auth guard handle redirect

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Scan History</h1>
            <p className="text-muted-foreground">Review your past analysis and humanized content.</p>
          </div>

          {isLoading ? (
            <LoadingSkeleton type="history" count={5} />
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 glass-card rounded-2xl border-white/5 border-dashed gap-4 text-muted-foreground">
              <History className="w-12 h-12 opacity-50" />
              <p>No scans found. Start by analyzing some text!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="glass-card rounded-xl p-6 border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.analysis_type === 'detect' ? 'bg-red-500/10 text-red-400' :
                        item.analysis_type === 'humanize' ? 'bg-primary/10 text-primary' :
                        'bg-neutral-800 text-neutral-400'
                      }`}>
                        {item.analysis_type === 'detect' ? <ShieldAlert className="w-5 h-5" /> :
                         item.analysis_type === 'humanize' ? <Wand2 className="w-5 h-5" /> :
                         <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {item.analysis_type === 'detect' ? 'AI Detection' :
                           item.analysis_type === 'humanize' ? 'Humanization' :
                           'Document Analysis'}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                          <span className="mx-1">•</span>
                          {item.word_count} words
                        </div>
                      </div>
                    </div>
                    
                    {/* Score Badges */}
                    {item.analysis_type === 'detect' && item.ai_score !== undefined && (
                      <Badge variant="outline" className={`font-mono ${
                        item.ai_score >= 70 ? 'text-red-400 border-red-500/30' :
                        item.ai_score >= 40 ? 'text-yellow-400 border-yellow-500/30' :
                        'text-green-400 border-green-500/30'
                      }`}>
                        {Math.round(item.ai_score)}% AI
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed bg-neutral-900/50 p-3 rounded border border-white/5 font-serif">
                    "{item.content}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Dummy History icon if lucide import fails
function History(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
