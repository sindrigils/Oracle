from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Date, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from datetime import date

    from models.loan import Loan


class LoanPayment(Base):
    __tablename__ = "loan_payment"

    loan_id: Mapped[int] = mapped_column(Integer, ForeignKey("loan.id"))
    loan: Mapped[Loan] = relationship("Loan", back_populates="loan_payments")
    amount: Mapped[float] = mapped_column(Float)
    interest_amount: Mapped[float] = mapped_column(Float)
    principal_amount: Mapped[float] = mapped_column(Float)
    remaining_balance: Mapped[float] = mapped_column(Float)
    date: Mapped[date] = mapped_column(Date)
