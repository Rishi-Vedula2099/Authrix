from pydantic import BaseModel, Field
from enum import Enum


class ToneOption(str, Enum):
    CASUAL = "casual"
    PROFESSIONAL = "professional"
    ACADEMIC = "academic"


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000)


class HumanizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000)
    tone: ToneOption = ToneOption.PROFESSIONAL
