from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from db.engine import get_db
from models.member import Member


class MemberService:
    def __init__(self, db: Session):
        self.db = db

    def create_member(
        self,
        name: str,
        household_id: int,
        image_url: Optional[str] = None,
    ) -> Member:
        member = Member(name=name, image_url=image_url, household_id=household_id)
        self.db.add(member)
        self.db.commit()
        return member

    def delete_member(self, member_id: int) -> None:
        member = self.db.query(Member).filter(Member.id == member_id).first()
        if member:
            self.db.delete(member)
            self.db.commit()

    def get_member(self, member_id: int) -> Optional[Member]:
        return self.db.query(Member).filter(Member.id == member_id).first()

    def get_members(self, household_id: int) -> list[Member]:
        return self.db.query(Member).filter(Member.household_id == household_id).all()


def get_member_service(db: Session = Depends(get_db)) -> MemberService:
    return MemberService(db)
