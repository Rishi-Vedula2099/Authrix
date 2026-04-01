from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db
from app.db.models import User
from app.db.crud import get_user_documents, get_document_with_results
from app.schemas.result import UsageResponse, HistoryItem, HistoryResponse
from app.services.usage_service import get_usage_stats
from uuid import UUID

router = APIRouter(tags=["Usage & History"])


@router.get("/usage", response_model=UsageResponse)
async def get_usage(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's daily usage statistics."""
    stats = await get_usage_stats(db, current_user.id)
    return UsageResponse(
        used=stats["used"],
        remaining=stats["remaining"],
        max_daily=stats["max_daily"],
        date=stats["date"],
    )


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's scan history with results."""
    documents = await get_user_documents(db, current_user.id, skip=skip, limit=limit)

    items = []
    for doc in documents:
        # Fetch results for this document
        doc_with_results = await get_document_with_results(db, doc.id, current_user.id)
        results = getattr(doc_with_results, '_fetched_results', []) if doc_with_results else []

        for result in results:
            items.append(HistoryItem(
                id=doc.id,
                content=doc.content[:200] + ("..." if len(doc.content) > 200 else ""),
                word_count=doc.word_count,
                created_at=doc.created_at,
                analysis_type=result.analysis_type.value if result.analysis_type else None,
                ai_score=result.ai_score,
                plagiarism_score=result.plagiarism_score,
                humanized_text=result.humanized_text,
            ))

        if not results:
            items.append(HistoryItem(
                id=doc.id,
                content=doc.content[:200] + ("..." if len(doc.content) > 200 else ""),
                word_count=doc.word_count,
                created_at=doc.created_at,
            ))

    return HistoryResponse(items=items, total=len(items))
