from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship
from db.base import Base


class Session(Base):
    __tablename__ = "sessions"

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="sessions")
    token = Column(String, index=True, unique=True)
    expires_at = Column(DateTime)
    user_agent = Column(String)
    ip_address = Column(String)
