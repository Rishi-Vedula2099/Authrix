"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useEditorStore } from "@/stores/editorStore";
import { useResultStore } from "@/stores/resultStore";
import { useUsageStore } from "@/stores/usageStore";

import { Sidebar } from "@/components/layout/Sidebar";
import { TextEditor } from "@/components/editor/TextEditor";
import { ResultsPanel } from "@/components/analysis/ResultsPanel";
import { UsageRing } from "@/components/analysis/UsageRing";
import { SplitScreenView } from "@/components/editor/SplitScreenView";
import { ToneSelector, ToneType } from "@/components/humanizer/ToneSelector";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wand2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { content, wordCount } = useEditorStore();
  const { isAnalyzing, isHumanizing, analyzeText, humanizeText, analyzeResult, humanizeResult } = useResultStore();
  const { usage, fetchUsage } = useUsageStore();
  
  const [tone, setTone] = useState<ToneType>("professional");
  const [activeTab, setActiveTab] = useState("detect");

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsage();
    }
  }, [isAuthenticated, fetchUsage, analyzeResult, humanizeResult]);

  // Handle keyboard shortcut (Ctrl+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (activeTab === "detect") handleAnalyze();
        else handleHumanize();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, activeTab]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!content.trim()) return toast.error("Please enter some text to analyze");
    if (wordCount > (usage?.max_daily || 600)) return toast.error("Word limit exceeded");
    
    await analyzeText(content);
    // Usage is re-fetched via useEffect dependency on analyzeResult
  };

  const handleHumanize = async () => {
    if (!content.trim()) return toast.error("Please enter some text to humanize");
    if (wordCount > (usage?.max_daily || 600)) return toast.error("Word limit exceeded");
    
    // Auto-analyze first if not done
    if (!analyzeResult) {
       await analyzeText(content);
    }
    await humanizeText(content, tone);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Analyze and humanize your content.</p>
            </div>
            <UsageRing />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
            <div className="flex justify-between items-center">
              <TabsList className="bg-neutral-900/80 border border-white/10 p-1">
                <TabsTrigger value="detect" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ShieldAlert className="w-4 h-4 mr-2" /> AI Detection
                </TabsTrigger>
                <TabsTrigger value="humanize" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Wand2 className="w-4 h-4 mr-2" /> Humanizer
                </TabsTrigger>
              </TabsList>
            </div>

            {/* AI DETECTION TAB */}
            <TabsContent value="detect" className="space-y-8 m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                <div className="flex flex-col gap-4 h-full">
                  <TextEditor />
                  <Button 
                    size="lg" 
                    className="w-full font-semibold shadow-lg hover:shadow-primary/25 transition-all" 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze Content"}
                  </Button>
                </div>
                
                <div className="h-full bg-neutral-900/30 rounded-xl border border-white/5 overflow-hidden">
                   {/* We pass nothing to split screen here, we just want ResultsPanel below */}
                   {/* Actually let's show heatmap here for direct feedback */}
                   {isAnalyzing ? (
                     <div className="p-6"><LoadingSkeleton type="text" count={1} /></div>
                   ) : analyzeResult ? (
                     <div className="p-0 h-full">
                       <SplitScreenView />
                     </div>
                   ) : (
                     <div className="flex h-full items-center justify-center text-muted-foreground italic px-8 text-center bg-neutral-900/30">
                       Analysis visualization will appear here
                     </div>
                   )}
                </div>
              </div>

              {/* Detailed Results */}
              <div className="pt-4 border-t border-white/5">
                <ResultsPanel />
              </div>
            </TabsContent>

            {/* HUMANIZER TAB */}
            <TabsContent value="humanize" className="space-y-8 m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
                <div className="flex flex-col gap-6">
                  <TextEditor />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Tone</h3>
                    <ToneSelector value={tone} onChange={setTone} />
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full font-semibold shadow-lg hover:shadow-primary/25 transition-all mt-auto" 
                    onClick={handleHumanize}
                    disabled={isHumanizing || isAnalyzing}
                  >
                    {isHumanizing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Humanize Content"}
                  </Button>
                </div>
                
                <div className="h-full">
                  <SplitScreenView />
                </div>
              </div>
            </TabsContent>

          </Tabs>

        </div>
      </main>
    </div>
  );
}
