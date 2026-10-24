import re
from typing import List


def count_words(text: str) -> int:
    """Count the number of words in a text."""
    return len(text.split())


def split_into_sentences(text: str) -> List[str]:
    """Split text into sentences using regex."""
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if s.strip()]


def truncate_text(text: str, max_length: int = 200) -> str:
    """Truncate text to max_length characters with ellipsis."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."


def format_error_response(detail: str, code: str = None) -> dict:
    """Create a structured error response."""
    response = {"detail": detail}
    if code:
        response["code"] = code
    return response
