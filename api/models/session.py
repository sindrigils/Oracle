from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from db.base import Base
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.user import User


class Session(Base):
    __tablename__ = "sessions"

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    user: Mapped["User"] = relationship("User", back_populates="sessions")
    token: Mapped[str] = mapped_column(String, index=True, unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    user_agent: Mapped[str] = mapped_column(String)
    ip_address: Mapped[str] = mapped_column(String)
