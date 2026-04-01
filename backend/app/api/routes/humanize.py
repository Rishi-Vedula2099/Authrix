from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db
from app.db.models import User, AnalysisType
from app.db.crud import create_document, create_result
from app.schemas.document import HumanizeRequest
from app.schemas.result import HumanizeResponse
from app.services.ai_service import humanize_text
from app.services.usage_service import enforce_daily_limit, record_usage
from app.utils.validators import validate_word_count, sanitize_text

router = APIRouter(tags=["Humanizer"])


@router.post("/humanize", response_model=HumanizeResponse)
async def humanize(
    request: HumanizeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Rewrite AI-generated text to sound more human-like.
    - Validates word count (max 600)
    - Checks daily usage limit (max 12)
    - Returns humanized text in the selected tone
    """
    # Sanitize input
    clean_text = sanitize_text(request.text)

    # Validate word count
    word_count = validate_word_count(clean_text)

    # Enforce daily limit
    await enforce_daily_limit(db, current_user.id)

    # Humanize text
    humanized = await humanize_text(clean_text, request.tone.value)

    # Store document
    doc = await create_document(db, current_user.id, clean_text, word_count)

    # Store result
    await create_result(
        db,
        document_id=doc.id,
        analysis_type=AnalysisType.HUMANIZE,
        humanized_text=humanized,
    )

    # Record usage
    await record_usage(db, current_user.id)

    return HumanizeResponse(
        document_id=doc.id,
        original_text=clean_text,
        humanized_text=humanized,
        tone=request.tone.value,
        word_count=word_count,
    )
