from fastapi import Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from starlette.status import HTTP_400_BAD_REQUEST
from models.user import User
from typing import Optional
from db.engine import get_db
from pydantic import EmailStr


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def authenticate(self, identifier: str, password: str) -> Optional[User]:
        user = (
            self.db.query(User)
            .filter(or_(User.username == identifier, User.email == identifier))
            .first()
        )
        if not user or not user.check_password(password):
            return None
        return user

    def create_user(
        self,
        username: str,
        email: EmailStr,
        password: str,
    ) -> User:
        existing_user = (
            self.db.query(User)
            .filter(or_(User.username == username, User.email == email))
            .first()
        )

        if existing_user:
            if existing_user.username == username:
                raise HTTPException(
                    status_code=HTTP_400_BAD_REQUEST, detail="Username already taken"
                )
            else:
                raise HTTPException(
                    status_code=HTTP_400_BAD_REQUEST, detail="Email already taken"
                )
        user = User(username=username, email=email)
        user.set_password(password)
        self.db.add(user)
        self.db.commit()
        return user


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)
