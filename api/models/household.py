from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from models.investment_asset import InvestmentAsset
    from models.investment_transaction import InvestmentTransaction
    from models.loan import Loan
    from models.member import Member
    from models.monthly_budget import MonthlyBudget
    from models.user import User


class Household(Base):
    __tablename__ = "household"

    members: Mapped[list[Member]] = relationship("Member", back_populates="household")
    investment_assets: Mapped[list[InvestmentAsset]] = relationship(
        "InvestmentAsset", back_populates="household"
    )
    investment_transactions: Mapped[list[InvestmentTransaction]] = relationship(
        "InvestmentTransaction", back_populates="household"
    )
    monthly_budgets: Mapped[list[MonthlyBudget]] = relationship(
        "MonthlyBudget", back_populates="household"
    )
    loans: Mapped[list[Loan]] = relationship("Loan", back_populates="household")

    name: Mapped[str] = mapped_column(String)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    owner: Mapped[User] = relationship("User", back_populates="households")
