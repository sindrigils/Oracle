from __future__ import annotations

from typing import TYPE_CHECKING

from db.base import Base
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.expense import Expense
    from models.household import Household
    from models.income import Income


class MonthlyBudget(Base):
    __tablename__ = "monthly_budgets"

    expenses: Mapped[list["Expense"]] = relationship(
        "Expense", back_populates="monthly_budget"
    )
    incomes: Mapped[list["Income"]] = relationship(
        "Income", back_populates="monthly_budget"
    )

    household_id: Mapped[int] = mapped_column(Integer, ForeignKey("household.id"))
    household: Mapped["Household"] = relationship(
        "Household", back_populates="monthly_budgets"
    )
    year: Mapped[int] = mapped_column(Integer)
    month: Mapped[int] = mapped_column(Integer)
    name: Mapped[str] = mapped_column(String)
    currency: Mapped[str] = mapped_column(String)
    planned_budget: Mapped[float] = mapped_column(Float)
