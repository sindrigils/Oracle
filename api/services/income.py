from datetime import datetime
from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from db.engine import get_db
from models.income import Income


class IncomeService:
    def __init__(self, db: Session):
        self.db = db

    def get_by_budget(self, monthly_budget_id: int) -> list[Income]:
        """Get all income entries for a monthly budget."""
        return (
            self.db.query(Income)
            .filter(Income.monthly_budget_id == monthly_budget_id)
            .all()
        )

    def get_by_id(self, income_id: int) -> Optional[Income]:
        """Get a single income entry by ID."""
        return self.db.query(Income).filter(Income.id == income_id).first()

    def create(
        self,
        monthly_budget_id: int,
        amount: float,
        source: str,
    ) -> Income:
        """Create a new income entry."""
        income = Income(
            monthly_budget_id=monthly_budget_id,
            amount=amount,
            source=source,
        )
        self.db.add(income)
        self.db.commit()
        self.db.refresh(income)
        return income

    def update(
        self,
        income_id: int,
        amount: Optional[float] = None,
        source: Optional[str] = None,
    ) -> Optional[Income]:
        """Update an existing income entry."""
        income = self.get_by_id(income_id)
        if not income:
            return None

        if amount is not None:
            income.amount = amount
        if source is not None:
            income.source = source

        income.updated_at = datetime.now()
        self.db.commit()
        self.db.refresh(income)
        return income

    def delete(self, income_id: int) -> bool:
        """Delete an income entry. Returns True if deleted, False if not found."""
        income = self.get_by_id(income_id)
        if not income:
            return False

        self.db.delete(income)
        self.db.commit()
        return True


def get_income_service(db: Session = Depends(get_db)) -> IncomeService:
    return IncomeService(db)
