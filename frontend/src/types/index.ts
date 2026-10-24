export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface SentenceHighlight {
  sentence: string;
  score: number;
  label: "ai" | "suspicious" | "human";
}

export interface AnalyzeResponse {
  document_id: string;
  ai_score: number;
  plagiarism_score: number;
  highlights: SentenceHighlight[];
  word_count: number;
}

export interface HumanizeResponse {
  document_id: string;
  original_text: string;
  humanized_text: string;
  tone: string;
  word_count: number;
}

export interface UsageResponse {
  used: number;
  remaining: number;
  max_daily: number;
  date: string;
}

export interface HistoryItem {
  id: string;
  content: string;
  word_count: number;
  created_at: string;
  analysis_type?: "detect" | "plagiarism" | "humanize";
  ai_score?: number;
  plagiarism_score?: number;
  humanized_text?: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
}
