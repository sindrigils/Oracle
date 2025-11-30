from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from db.base import Base
from sqlalchemy import Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.investment_asset import InvestmentAsset


class InvestmentValuationSnapshot(Base):
    __tablename__ = "investment_valuation_snapshot"

    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("investment_asset.id"))
    asset: Mapped["InvestmentAsset"] = relationship(
        "InvestmentAsset", back_populates="valuation_snapshots"
    )
    valuation: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String)
    date: Mapped[date] = mapped_column(Date)
