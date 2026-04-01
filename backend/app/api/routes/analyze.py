from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db
from app.db.models import User, AnalysisType
from app.db.crud import create_document, create_result
from app.schemas.document import AnalyzeRequest
from app.schemas.result import AnalyzeResponse, SentenceHighlight
from app.services.ai_service import detect_ai_content
from app.services.plagiarism_service import plagiarism_service
from app.services.usage_service import enforce_daily_limit, record_usage
from app.utils.validators import validate_word_count, sanitize_text

router = APIRouter(tags=["Analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Analyze text for AI-generated content and plagiarism.
    - Validates word count (max 600)
    - Checks daily usage limit (max 12)
    - Returns AI score, sentence highlights, and plagiarism score
    """
    # Sanitize input
    clean_text = sanitize_text(request.text)

    # Validate word count
    word_count = validate_word_count(clean_text)

    # Enforce daily limit
    await enforce_daily_limit(db, current_user.id)

    # Run AI detection and plagiarism check concurrently
    import asyncio
    ai_result, plag_result = await asyncio.gather(
        detect_ai_content(clean_text),
        plagiarism_service.check(clean_text),
    )

    # Store document
    doc = await create_document(db, current_user.id, clean_text, word_count)

    # Store result
    await create_result(
        db,
        document_id=doc.id,
        analysis_type=AnalysisType.DETECT,
        ai_score=ai_result["ai_score"],
        plagiarism_score=plag_result.similarity_score,
        highlights=ai_result["highlights"],
    )

    # Record usage
    await record_usage(db, current_user.id)

    # Build response
    highlights = [
        SentenceHighlight(
            sentence=h["sentence"],
            score=h["score"],
            label=h["label"],
        )
        for h in ai_result["highlights"]
    ]

    return AnalyzeResponse(
        document_id=doc.id,
        ai_score=ai_result["ai_score"],
        plagiarism_score=plag_result.similarity_score,
        highlights=highlights,
        word_count=word_count,
    )
