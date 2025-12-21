from __future__ import annotations

import enum
from typing import TYPE_CHECKING

from sqlalchemy import Date, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from datetime import date

    from models.household import Household
    from models.investment_asset import InvestmentAsset
    from models.member import Member


class TransactionType(enum.Enum):
    BUY = "buy"
    SELL = "sell"
    DIVIDEND = "dividend"
    INTEREST = "interest"


class InvestmentTransaction(Base):
    __tablename__ = "investment_transaction"

    household_id: Mapped[int] = mapped_column(Integer, ForeignKey("household.id"))
    household: Mapped[Household] = relationship("Household", back_populates="investment_transactions")
    member_id: Mapped[int] = mapped_column(Integer, ForeignKey("member.id"))
    member: Mapped[Member] = relationship("Member", back_populates="investment_transactions")
    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("investment_asset.id"))
    asset: Mapped[InvestmentAsset] = relationship("InvestmentAsset", back_populates="investment_transactions")
    transaction_type: Mapped[TransactionType] = mapped_column(Enum(TransactionType))
    quantity: Mapped[int] = mapped_column(Integer)
    date: Mapped[date] = mapped_column(Date)
    price_per_unit: Mapped[float] = mapped_column(Float)
    fees: Mapped[float | None] = mapped_column(Float, nullable=True)
    note: Mapped[str | None] = mapped_column(String, nullable=True)
