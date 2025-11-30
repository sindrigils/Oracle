from db.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship


class LoanMember(Base):
    __tablename__ = "loan_member"

    loan_id = Column(Integer, ForeignKey("loan.id"))
    loan = relationship("Loan", back_populates="loan_members")
    member_id = Column(Integer, ForeignKey("member.id"))
    member = relationship("Member", back_populates="loan_members")
    share_percent = Column(Float)
