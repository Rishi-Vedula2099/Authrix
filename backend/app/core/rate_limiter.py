import time
from collections import defaultdict
from typing import Callable

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Sliding-window rate limiter middleware.
    Limits requests per minute per IP address.
    """

    def __init__(self, app, max_requests: int = None):
        super().__init__(app)
        self.max_requests = max_requests or settings.RATE_LIMIT_PER_MINUTE
        self.window_size = 60  # seconds
        # Dict mapping IP -> list of request timestamps
        self.request_log: dict[str, list[float]] = defaultdict(list)

    def _clean_old_requests(self, ip: str, now: float):
        """Remove timestamps older than the sliding window."""
        cutoff = now - self.window_size
        self.request_log[ip] = [
            ts for ts in self.request_log[ip] if ts > cutoff
        ]

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip rate limiting for docs and health endpoints
        if request.url.path in ("/docs", "/openapi.json", "/redoc", "/health"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        self._clean_old_requests(client_ip, now)

        if len(self.request_log[client_ip]) >= self.max_requests:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Too many requests. Please try again later.",
                    "retry_after": self.window_size,
                },
            )

        self.request_log[client_ip].append(now)
        response = await call_next(request)
        return response
