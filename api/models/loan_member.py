from __future__ import annotations

from typing import TYPE_CHECKING

from db.base import Base
from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.loan import Loan
    from models.member import Member


class LoanMember(Base):
    __tablename__ = "loan_member"

    loan_id: Mapped[int] = mapped_column(Integer, ForeignKey("loan.id"))
    loan: Mapped["Loan"] = relationship("Loan", back_populates="loan_members")
    member_id: Mapped[int] = mapped_column(Integer, ForeignKey("member.id"))
    member: Mapped["Member"] = relationship("Member", back_populates="loan_members")
    share_percent: Mapped[float] = mapped_column(Float)
