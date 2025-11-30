from db.base import Base
from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship


class Member(Base):
    __tablename__ = "member"

    investment_assets = relationship("InvestmentAsset", back_populates="member")
    investment_transactions = relationship(
        "InvestmentTransaction", back_populates="member"
    )
    loan_members = relationship("LoanMember", back_populates="member")

    name = Column(String)
    image_url = Column(String)
    household_id = Column(Integer, ForeignKey("household.id"))
    household = relationship("Household", back_populates="members")
