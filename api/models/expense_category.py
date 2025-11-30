from db.base import Base
from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy.orm import relationship
import enum


class Color(enum.Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"
    YELLOW = "yellow"
    PURPLE = "purple"
    ORANGE = "orange"
    PINK = "pink"
    BROWN = "brown"
    GRAY = "gray"
    BLACK = "black"
    WHITE = "white"
    CUSTOM = "custom"


class ExpenseCategory(Base):
    __tablename__ = "expense_categories"

    expenses = relationship("Expense", back_populates="category")

    name = Column(String)
    is_custom = Column(Boolean, default=False)
    color = Column(Enum(Color))
    color_code = Column(String, nullable=True)
