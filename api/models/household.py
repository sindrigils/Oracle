from db.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class Household(Base):
    __tablename__ = "household"

    members = relationship("Member", back_populates="household")
    investment_assets = relationship("InvestmentAsset", back_populates="household")
    investment_transactions = relationship(
        "InvestmentTransaction", back_populates="household"
    )
    monthly_budgets = relationship("MonthlyBudget", back_populates="household")
    loans = relationship("Loan", back_populates="household")

    name = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="households")
