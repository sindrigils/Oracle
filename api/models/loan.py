from db.base import Base
from sqlalchemy import Column, Integer, ForeignKey, String, Float, Date
from sqlalchemy.orm import relationship


class Loan(Base):
    __tablename__ = "loan"
    loan_members = relationship("LoanMember", back_populates="loan")
    loan_payments = relationship("LoanPayment", back_populates="loan")
    loan_snapshots = relationship("LoanSnapshot", back_populates="loan")

    household_id = Column(Integer, ForeignKey("household.id"))
    household = relationship("Household", back_populates="loans")
    name = Column(String)
    loan_type = Column(String)
    currency = Column(String)
    principal = Column(Float)
    interest_rate = Column(Float)
    start_date = Column(Date)
    end_date = Column(Date)
