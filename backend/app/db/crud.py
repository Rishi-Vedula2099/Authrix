import uuid
from datetime import date, datetime
from typing import Optional, List
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User, Usage, Document, Result, AnalysisType


# ─── User CRUD ───────────────────────────────────────────────────────────────

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, email: str, hashed_password: str) -> User:
    user = User(email=email, hashed_password=hashed_password)
    db.add(user)
    await db.flush()
    return user


# ─── Usage CRUD ──────────────────────────────────────────────────────────────

async def get_today_usage(db: AsyncSession, user_id: uuid.UUID) -> Optional[Usage]:
    result = await db.execute(
        select(Usage).where(
            and_(Usage.user_id == user_id, Usage.date == date.today())
        )
    )
    return result.scalar_one_or_none()


async def get_or_create_usage(db: AsyncSession, user_id: uuid.UUID) -> Usage:
    usage = await get_today_usage(db, user_id)
    if usage is None:
        usage = Usage(user_id=user_id, date=date.today(), request_count=0)
        db.add(usage)
        await db.flush()
    return usage


async def increment_usage(db: AsyncSession, user_id: uuid.UUID) -> Usage:
    usage = await get_or_create_usage(db, user_id)
    usage.request_count += 1
    await db.flush()
    return usage


# ─── Document CRUD ───────────────────────────────────────────────────────────

async def create_document(
    db: AsyncSession,
    user_id: uuid.UUID,
    content: str,
    word_count: int,
) -> Document:
    doc = Document(
        user_id=user_id,
        content=content,
        word_count=word_count,
    )
    db.add(doc)
    await db.flush()
    return doc


# ─── Result CRUD ─────────────────────────────────────────────────────────────

async def create_result(
    db: AsyncSession,
    document_id: uuid.UUID,
    analysis_type: AnalysisType,
    ai_score: Optional[float] = None,
    plagiarism_score: Optional[float] = None,
    humanized_text: Optional[str] = None,
    highlights: Optional[list] = None,
) -> Result:
    result = Result(
        document_id=document_id,
        analysis_type=analysis_type,
        ai_score=ai_score,
        plagiarism_score=plagiarism_score,
        humanized_text=humanized_text,
        highlights=highlights,
    )
    db.add(result)
    await db.flush()
    return result


# ─── History ─────────────────────────────────────────────────────────────────

async def get_user_documents(
    db: AsyncSession,
    user_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20,
) -> List[Document]:
    result = await db.execute(
        select(Document)
        .where(Document.user_id == user_id)
        .order_by(Document.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def get_document_with_results(
    db: AsyncSession,
    document_id: uuid.UUID,
    user_id: uuid.UUID,
) -> Optional[Document]:
    result = await db.execute(
        select(Document).where(
            and_(Document.id == document_id, Document.user_id == user_id)
        )
    )
    doc = result.scalar_one_or_none()
    if doc:
        results_query = await db.execute(
            select(Result).where(Result.document_id == document_id)
        )
        doc._fetched_results = list(results_query.scalars().all())
    return doc
