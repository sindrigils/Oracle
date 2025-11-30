from __future__ import annotations

import enum
from typing import TYPE_CHECKING

from db.base import Base
from sqlalchemy import Boolean, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.expense import Expense


class Color(enum.Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"
    YELLOW = "yellow"
    PURPLE = "purple"
    ORANGE = "orange"
    PINK = "pink"
    BROWN = "brown"
    GRAY = "gray"
    BLACK = "black"
    WHITE = "white"
    CUSTOM = "custom"


class ExpenseCategory(Base):
    __tablename__ = "expense_categories"

    expenses: Mapped[list["Expense"]] = relationship(
        "Expense", back_populates="category"
    )

    name: Mapped[str] = mapped_column(String)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False)
    color: Mapped[Color] = mapped_column(Enum(Color))
    color_code: Mapped[str | None] = mapped_column(String, nullable=True)
