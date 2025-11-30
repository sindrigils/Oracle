from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from db.base import Base
from sqlalchemy import Date, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.loan import Loan


class LoanPayment(Base):
    __tablename__ = "loan_payment"

    loan_id: Mapped[int] = mapped_column(Integer, ForeignKey("loan.id"))
    loan: Mapped["Loan"] = relationship("Loan", back_populates="loan_payments")
    amount: Mapped[float] = mapped_column(Float)
    interest_amount: Mapped[float] = mapped_column(Float)
    principal_amount: Mapped[float] = mapped_column(Float)
    remaining_balance: Mapped[float] = mapped_column(Float)
    date: Mapped[date] = mapped_column(Date)
