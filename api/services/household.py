from db.engine import get_db
from fastapi import Depends
from models.household import Household
from sqlalchemy.orm import Session


class HouseholdService:
    def __init__(self, db: Session):
        self.db = db

    def create_household(self, name: str, owner_id: int) -> Household:
        household = Household(name=name, owner_id=owner_id)
        self.db.add(household)
        self.db.commit()
        return household


def get_household_service(db: Session = Depends(get_db)) -> HouseholdService:
    return HouseholdService(db)
