import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.rate_limiter import RateLimiterMiddleware
from app.db.session import init_db

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler — runs on startup and shutdown."""
    logger.info("🚀 Starting Authrix API...")
    # Create tables on startup (dev only — use Alembic in production)
    await init_db()
    logger.info("✅ Database initialized")
    yield
    logger.info("👋 Shutting down Authrix API...")


app = FastAPI(
    title="Authrix API",
    description="AI Content Detector, Plagiarism Checker, and Humanizer",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── Middleware ───────────────────────────────────────────────────────────────

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiter
app.add_middleware(RateLimiterMiddleware)

# ─── Routes ──────────────────────────────────────────────────────────────────

from app.api.routes.auth import router as auth_router
from app.api.routes.analyze import router as analyze_router
from app.api.routes.humanize import router as humanize_router
from app.api.routes.usage import router as usage_router

app.include_router(auth_router)
app.include_router(analyze_router)
app.include_router(humanize_router)
app.include_router(usage_router)


# ─── Health Check ────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "authrix-api"}


# ─── Global Exception Handlers ──────────────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."},
    )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "The requested resource was not found."},
    )
