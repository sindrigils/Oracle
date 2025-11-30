from sqlalchemy import Column, String
from db.base import Base
from sqlalchemy.orm import relationship
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


class User(Base):
    __tablename__ = "users"

    sessions = relationship("Session", back_populates="user")
    households = relationship("Household", back_populates="owner")

    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    def check_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.password)

    def set_password(self, plain_password: str) -> None:
        self.password = pwd_context.hash(plain_password)
