from db.base import Base
from sqlalchemy import Column, Integer, Float, ForeignKey, String
from sqlalchemy.orm import relationship


class Income(Base):
    __tablename__ = "income"

    amount = Column(Float)
    source = Column(String)
    monthly_budget_id = Column(Integer, ForeignKey("monthly_budgets.id"))
    monthly_budget = relationship("MonthlyBudget", back_populates="incomes")
