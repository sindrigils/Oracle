from __future__ import annotations

from datetime import date  # noqa: TC003
from typing import TYPE_CHECKING

from sqlalchemy import Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from models.household import Household
    from models.loan_member import LoanMember
    from models.loan_payment import LoanPayment
    from models.loan_snapshot import LoanSnapshot


class Loan(Base):
    __tablename__ = "loan"
    loan_members: Mapped[list[LoanMember]] = relationship(
        "LoanMember", back_populates="loan"
    )
    loan_payments: Mapped[list[LoanPayment]] = relationship(
        "LoanPayment", back_populates="loan"
    )
    loan_snapshots: Mapped[list[LoanSnapshot]] = relationship(
        "LoanSnapshot", back_populates="loan"
    )

    household_id: Mapped[int] = mapped_column(Integer, ForeignKey("household.id"))
    household: Mapped[Household] = relationship("Household", back_populates="loans")
    name: Mapped[str] = mapped_column(String)
    loan_type: Mapped[str] = mapped_column(String)
    currency: Mapped[str] = mapped_column(String)
    principal: Mapped[float] = mapped_column(Float)
    interest_rate: Mapped[float] = mapped_column(Float)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
