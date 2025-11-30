from __future__ import annotations

from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from db.base import Base
from sqlalchemy import Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.household import Household
    from models.investment_transaction import InvestmentTransaction
    from models.investment_valuation_snapshot import InvestmentValuationSnapshot
    from models.member import Member


class ValuationMode(PyEnum):
    MARKET = "market"
    MANUAL = "manual"


class InvestmentAsset(Base):
    __tablename__ = "investment_asset"

    investment_transactions: Mapped[list["InvestmentTransaction"]] = relationship(
        "InvestmentTransaction", back_populates="asset"
    )
    valuation_snapshots: Mapped[list["InvestmentValuationSnapshot"]] = relationship(
        "InvestmentValuationSnapshot", back_populates="asset"
    )

    household_id: Mapped[int] = mapped_column(Integer, ForeignKey("household.id"))
    household: Mapped["Household"] = relationship(
        "Household", back_populates="investment_assets"
    )
    member_id: Mapped[int] = mapped_column(Integer, ForeignKey("member.id"))
    member: Mapped["Member"] = relationship(
        "Member", back_populates="investment_assets"
    )
    name: Mapped[str] = mapped_column(String)
    symbol: Mapped[str] = mapped_column(String)
    asset_type: Mapped[str] = mapped_column(String)
    currency: Mapped[str] = mapped_column(String)
    quantity: Mapped[int] = mapped_column(Integer)
    valuation_mode: Mapped[ValuationMode] = mapped_column(Enum(ValuationMode))
