"""
Plagiarism checking service with provider abstraction layer.
Uses strategy pattern for easy provider swapping.
"""

import logging
import random
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Optional

logger = logging.getLogger(__name__)


@dataclass
class PlagiarismMatch:
    """Represents a single plagiarism match."""
    matched_text: str
    source_url: Optional[str] = None
    similarity: float = 0.0


@dataclass
class PlagiarismResult:
    """Result from plagiarism analysis."""
    similarity_score: float  # 0-100
    matches: List[PlagiarismMatch] = field(default_factory=list)
    provider: str = "unknown"


class PlagiarismProvider(ABC):
    """Abstract base class for plagiarism checking providers."""

    @abstractmethod
    async def check(self, text: str) -> PlagiarismResult:
        """Check text for plagiarism. Returns PlagiarismResult."""
        pass


class MockPlagiarismProvider(PlagiarismProvider):
    """
    Mock provider for development and testing.
    Returns simulated plagiarism results.
    """

    async def check(self, text: str) -> PlagiarismResult:
        # Simulate a realistic plagiarism check
        score = random.uniform(5, 35)

        matches = []
        sentences = text.split(".")
        for sentence in sentences[:3]:
            sentence = sentence.strip()
            if sentence and len(sentence) > 20:
                matches.append(
                    PlagiarismMatch(
                        matched_text=sentence,
                        source_url=f"https://example.com/source/{hash(sentence) % 10000}",
                        similarity=random.uniform(20, 80),
                    )
                )

        return PlagiarismResult(
            similarity_score=round(score, 1),
            matches=matches,
            provider="mock",
        )


# Add future providers here:
# class CopyleaksProvider(PlagiarismProvider):
#     async def check(self, text: str) -> PlagiarismResult:
#         ...


class PlagiarismService:
    """
    Main plagiarism service that delegates to a configured provider.
    Uses strategy pattern for easy provider swapping.
    """

    def __init__(self, provider: Optional[PlagiarismProvider] = None):
        self.provider = provider or MockPlagiarismProvider()

    async def check(self, text: str) -> PlagiarismResult:
        try:
            return await self.provider.check(text)
        except Exception as e:
            logger.error(f"Plagiarism check failed: {e}")
            return PlagiarismResult(
                similarity_score=0.0,
                matches=[],
                provider="error",
            )


# Global service instance
plagiarism_service = PlagiarismService()
