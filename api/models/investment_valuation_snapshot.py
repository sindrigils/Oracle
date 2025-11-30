from db.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Float, Date, String
from sqlalchemy.orm import relationship


class InvestmentValuationSnapshot(Base):
    __tablename__ = "investment_valuation_snapshot"

    asset_id = Column(Integer, ForeignKey("investment_asset.id"))
    asset = relationship("InvestmentAsset", back_populates="valuation_snapshots")
    valuation = Column(Float)
    source = Column(String)
    date = Column(Date)
