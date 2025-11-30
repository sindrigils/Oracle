from db.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Float, Date, String, Enum
from sqlalchemy.orm import relationship
import enum


class TransactionType(enum.Enum):
    BUY = "buy"
    SELL = "sell"
    DIVIDEND = "dividend"
    INTEREST = "interest"


class InvestmentTransaction(Base):
    __tablename__ = "investment_transaction"

    household_id = Column(Integer, ForeignKey("household.id"))
    household = relationship("Household", back_populates="investment_transactions")
    member_id = Column(Integer, ForeignKey("member.id"))
    member = relationship("Member", back_populates="investment_transactions")
    asset_id = Column(Integer, ForeignKey("investment_asset.id"))
    asset = relationship("InvestmentAsset", back_populates="investment_transactions")
    transaction_type = Column(Enum(TransactionType))
    quantity = Column(Integer)
    date = Column(Date)
    price_per_unit = Column(Float)
    fees = Column(Float, nullable=True)
    note = Column(String, nullable=True)
