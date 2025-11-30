from db.base import Base
from sqlalchemy import Column, Integer, Float, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship


class Expense(Base):
    __tablename__ = "expenses"

    amount = Column(Float)
    description = Column(String)
    date = Column(DateTime)
    category_id = Column(Integer, ForeignKey("expense_categories.id"))
    category = relationship("ExpenseCategory", back_populates="expenses")
    monthly_budget_id = Column(Integer, ForeignKey("monthly_budgets.id"))
    monthly_budget = relationship("MonthlyBudget", back_populates="expenses")
