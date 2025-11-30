from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from db.base import Base
from sqlalchemy import Date, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.loan import Loan


class LoanSnapshot(Base):
    __tablename__ = "loan_snapshot"

    loan_id: Mapped[int] = mapped_column(Integer, ForeignKey("loan.id"))
    loan: Mapped["Loan"] = relationship("Loan", back_populates="loan_snapshots")
    date: Mapped[date] = mapped_column(Date)
    outstanding_principal: Mapped[float] = mapped_column(Float)
