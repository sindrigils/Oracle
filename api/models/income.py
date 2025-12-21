from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from models.monthly_budget import MonthlyBudget


class Income(Base):
    __tablename__ = "income"

    amount: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String)
    monthly_budget_id: Mapped[int] = mapped_column(Integer, ForeignKey("monthly_budgets.id"))
    monthly_budget: Mapped[MonthlyBudget] = relationship("MonthlyBudget", back_populates="incomes")
