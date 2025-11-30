from models.session import Session as SessionModel
import secrets
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from core.config import settings
from db.engine import get_db
from fastapi import Depends


class SessionService:
    def __init__(self, db: Session):
        self.db = db

    def create_session(
        self,
        user_id: int,
        user_agent: str = "",
        ip_address: str = "",
    ) -> str:
        token = self.create_token()
        expires_at = datetime.now() + timedelta(
            seconds=settings.session_token_expiration_time
        )
        session = SessionModel(
            user_id=user_id,
            user_agent=user_agent,
            ip_address=ip_address,
            token=token,
            expires_at=expires_at,
        )
        self.db.add(session)
        self.db.commit()
        return token

    def create_token(self) -> str:
        return secrets.token_urlsafe(32)

    def get_valid_session(self, token: str) -> SessionModel | None:
        """Get a session by token if it exists and is not expired."""
        session = (
            self.db.query(SessionModel).filter(SessionModel.token == token).first()
        )
        if not session or session.expires_at < datetime.now():
            return None
        return session

    def refresh_session(self, session: SessionModel) -> None:
        """Extend the session expiration time."""
        session.expires_at = datetime.now() + timedelta(
            seconds=settings.session_token_expiration_time
        )
        self.db.commit()

    def should_refresh_session(self, session: SessionModel) -> bool:
        """Check if session is within the refresh threshold of expiring."""
        threshold = datetime.now() + timedelta(
            seconds=settings.session_refresh_threshold
        )
        return session.expires_at < threshold

    def delete_session(self, token: str) -> None:
        session = (
            self.db.query(SessionModel).filter(SessionModel.token == token).first()
        )
        if session:
            self.db.delete(session)
            self.db.commit()


def get_session_service(db: Session = Depends(get_db)) -> SessionService:
    return SessionService(db)
