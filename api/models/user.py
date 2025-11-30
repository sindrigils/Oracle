from __future__ import annotations

from typing import TYPE_CHECKING

from db.base import Base
from passlib.context import CryptContext
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.household import Household
    from models.session import Session

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


class User(Base):
    __tablename__ = "users"

    sessions: Mapped[list["Session"]] = relationship("Session", back_populates="user")
    households: Mapped[list["Household"]] = relationship(
        "Household", back_populates="owner"
    )

    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password: Mapped[str] = mapped_column(String)

    def check_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.password)

    def set_password(self, plain_password: str) -> None:
        self.password = pwd_context.hash(plain_password)
