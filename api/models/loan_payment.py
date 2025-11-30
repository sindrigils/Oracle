from db.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Float, Date
from sqlalchemy.orm import relationship


class LoanPayment(Base):
    __tablename__ = "loan_payment"

    loan_id = Column(Integer, ForeignKey("loan.id"))
    loan = relationship("Loan", back_populates="loan_payments")
    amount = Column(Float)
    interest_amount = Column(Float)
    principal_amount = Column(Float)
    remaining_balance = Column(Float)
    date = Column(Date)
