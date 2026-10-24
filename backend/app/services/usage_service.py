from datetime import date
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.db.crud import get_or_create_usage, increment_usage as db_increment_usage


async def check_daily_limit(db: AsyncSession, user_id: UUID) -> dict:
    """
    Check if the user has reached their daily request limit.
    Returns usage stats dict.
    """
    usage = await get_or_create_usage(db, user_id)
    remaining = max(0, settings.MAX_REQUESTS_PER_DAY - usage.request_count)

    return {
        "used": usage.request_count,
        "remaining": remaining,
        "max_daily": settings.MAX_REQUESTS_PER_DAY,
        "date": str(date.today()),
        "allowed": remaining > 0,
    }


async def enforce_daily_limit(db: AsyncSession, user_id: UUID):
    """
    Enforce the daily request limit. Raises HTTPException if limit exceeded.
    """
    stats = await check_daily_limit(db, user_id)
    if not stats["allowed"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Daily request limit reached. "
                   f"You've used {stats['used']}/{stats['max_daily']} requests today. "
                   f"Try again tomorrow.",
        )


async def record_usage(db: AsyncSession, user_id: UUID) -> dict:
    """Record a usage event and return updated stats."""
    usage = await db_increment_usage(db, user_id)
    remaining = max(0, settings.MAX_REQUESTS_PER_DAY - usage.request_count)
    return {
        "used": usage.request_count,
        "remaining": remaining,
        "max_daily": settings.MAX_REQUESTS_PER_DAY,
        "date": str(date.today()),
    }


async def get_usage_stats(db: AsyncSession, user_id: UUID) -> dict:
    """Get current usage statistics for a user."""
    return await check_daily_limit(db, user_id)
