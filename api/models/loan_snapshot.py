from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Date, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from datetime import date

    from models.loan import Loan


class LoanSnapshot(Base):
    __tablename__ = "loan_snapshot"

    loan_id: Mapped[int] = mapped_column(Integer, ForeignKey("loan.id"))
    loan: Mapped[Loan] = relationship("Loan", back_populates="loan_snapshots")
    date: Mapped[date] = mapped_column(Date)
    outstanding_principal: Mapped[float] = mapped_column(Float)
