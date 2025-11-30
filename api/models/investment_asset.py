from db.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Float, Date, String, Enum
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum


class ValuationMode(PyEnum):
    MARKET = "market"
    MANUAL = "manual"


class InvestmentAsset(Base):
    __tablename__ = "investment_asset"

    investment_transactions = relationship(
        "InvestmentTransaction", back_populates="asset"
    )
    valuation_snapshots = relationship(
        "InvestmentValuationSnapshot", back_populates="asset"
    )

    household_id = Column(Integer, ForeignKey("household.id"))
    household = relationship("Household", back_populates="investment_assets")
    member_id = Column(Integer, ForeignKey("member.id"))
    member = relationship("Member", back_populates="investment_assets")
    name = Column(String)
    symbol = Column(String)
    asset_type = Column(String)
    currency = Column(String)
    quantity = Column(Integer)
    valuation_mode = Column(Enum(ValuationMode))
