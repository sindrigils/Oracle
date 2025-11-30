from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from core.config import settings
from db.engine import SessionLocal
from services.session import SessionService


class SessionRefreshMiddleware(BaseHTTPMiddleware):
    """Middleware that refreshes sessions close to expiration."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # Only process if there's a session cookie
        token = request.cookies.get(settings.session_cookie_name)
        if not token:
            return response

        # Check if session needs refresh
        db = SessionLocal()
        try:
            session_service = SessionService(db)
            session = session_service.get_valid_session(token)

            if session and session_service.should_refresh_session(session):
                session_service.refresh_session(session)
                # Update the cookie with extended expiration
                response.set_cookie(
                    key=settings.session_cookie_name,
                    value=token,
                    max_age=settings.session_token_expiration_time,
                    httponly=True,
                    secure=settings.cookie_secure,
                    samesite=settings.cookie_samesite,
                    domain=settings.cookie_domain,
                )
        finally:
            db.close()

        return response
