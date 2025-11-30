from db.base import Base
from sqlalchemy import Column, Integer, Float, ForeignKey, String
from sqlalchemy.orm import relationship


class MonthlyBudget(Base):
    __tablename__ = "monthly_budgets"

    expenses = relationship("Expense", back_populates="monthly_budget")
    incomes = relationship("Income", back_populates="monthly_budget")

    household_id = Column(Integer, ForeignKey("household.id"))
    household = relationship("Household", back_populates="monthly_budgets")
    year = Column(Integer)
    month = Column(Integer)
    name = Column(String)
    currency = Column(String)
    planned_budget = Column(Float)
