from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from models.household import Household
    from models.investment_asset import InvestmentAsset
    from models.investment_transaction import InvestmentTransaction
    from models.loan_member import LoanMember


class Member(Base):
    __tablename__ = "member"

    investment_assets: Mapped[list[InvestmentAsset]] = relationship("InvestmentAsset", back_populates="member")
    investment_transactions: Mapped[list[InvestmentTransaction]] = relationship(
        "InvestmentTransaction", back_populates="member"
    )
    loan_members: Mapped[list[LoanMember]] = relationship("LoanMember", back_populates="member")

    name: Mapped[str] = mapped_column(String)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    household_id: Mapped[int] = mapped_column(Integer, ForeignKey("household.id"))
    household: Mapped[Household] = relationship("Household", back_populates="members")
