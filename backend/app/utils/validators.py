import re
from fastapi import HTTPException, status
from app.core.config import settings


def validate_word_count(text: str, max_words: int = None) -> int:
    """
    Validate that text does not exceed the word limit.
    Returns the word count if valid, raises HTTPException if exceeded.
    """
    max_words = max_words or settings.MAX_WORDS_PER_REQUEST
    words = text.split()
    word_count = len(words)

    if word_count > max_words:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Text exceeds maximum word limit. "
                   f"Got {word_count} words, maximum is {max_words}.",
        )

    if word_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text cannot be empty.",
        )

    return word_count


def sanitize_text(text: str) -> str:
    """
    Sanitize input text to prevent prompt injection and clean up content.
    """
    # Remove null bytes
    text = text.replace("\x00", "")

    # Remove excessive whitespace but preserve paragraph structure
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Strip leading/trailing whitespace
    text = text.strip()

    # Remove potential prompt injection patterns
    injection_patterns = [
        r"ignore\s+(previous|above|all)\s+(instructions|prompts)",
        r"you\s+are\s+now\s+a",
        r"system\s*:\s*",
        r"<\|.*?\|>",
        r"\[INST\]",
        r"\[/INST\]",
    ]

    for pattern in injection_patterns:
        text = re.sub(pattern, "", text, flags=re.IGNORECASE)

    return text
