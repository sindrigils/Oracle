from db.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Float, Date
from sqlalchemy.orm import relationship


class LoanSnapshot(Base):
    __tablename__ = "loan_snapshot"

    loan_id = Column(Integer, ForeignKey("loan.id"))
    loan = relationship("Loan", back_populates="loan_snapshots")
    date = Column(Date)
    outstanding_principal = Column(Float)
