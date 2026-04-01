from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class SentenceHighlight(BaseModel):
    sentence: str
    score: float
    label: str  # "ai", "suspicious", "human"


class AnalyzeResponse(BaseModel):
    document_id: UUID
    ai_score: float
    plagiarism_score: float
    highlights: List[SentenceHighlight]
    word_count: int


class HumanizeResponse(BaseModel):
    document_id: UUID
    original_text: str
    humanized_text: str
    tone: str
    word_count: int


class UsageResponse(BaseModel):
    used: int
    remaining: int
    max_daily: int
    date: str


class HistoryItem(BaseModel):
    id: UUID
    content: str
    word_count: int
    created_at: datetime
    analysis_type: Optional[str] = None
    ai_score: Optional[float] = None
    plagiarism_score: Optional[float] = None
    humanized_text: Optional[str] = None

    class Config:
        from_attributes = True


class HistoryResponse(BaseModel):
    items: List[HistoryItem]
    total: int
