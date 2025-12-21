from __future__ import annotations

from datetime import datetime  # noqa: TC003
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from models.expense_category import ExpenseCategory
    from models.monthly_budget import MonthlyBudget


class Expense(Base):
    __tablename__ = "expenses"

    amount: Mapped[float] = mapped_column(Float)
    description: Mapped[str] = mapped_column(String)
    date: Mapped[datetime] = mapped_column(DateTime)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("expense_categories.id"))
    category: Mapped[ExpenseCategory] = relationship("ExpenseCategory", back_populates="expenses")
    monthly_budget_id: Mapped[int] = mapped_column(Integer, ForeignKey("monthly_budgets.id"))
    monthly_budget: Mapped[MonthlyBudget] = relationship("MonthlyBudget", back_populates="expenses")
