from datetime import datetime
from typing import Optional

from db.engine import get_db
from fastapi import Depends
from models.expense import Expense
from sqlalchemy.orm import Session


class ExpenseService:
    def __init__(self, db: Session):
        self.db = db

    def get_by_budget(self, monthly_budget_id: int) -> list[Expense]:
        """Get all expenses for a monthly budget."""
        return (
            self.db.query(Expense)
            .filter(Expense.monthly_budget_id == monthly_budget_id)
            .order_by(Expense.date.desc())
            .all()
        )

    def get_by_id(self, expense_id: int) -> Optional[Expense]:
        """Get a single expense by ID."""
        return self.db.query(Expense).filter(Expense.id == expense_id).first()

    def create(
        self,
        monthly_budget_id: int,
        amount: float,
        description: str,
        category_id: int,
        date: Optional[datetime] = None,
    ) -> Expense:
        """Create a new expense."""
        expense = Expense(
            monthly_budget_id=monthly_budget_id,
            amount=amount,
            description=description,
            category_id=category_id,
            date=date or datetime.now(),
        )
        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def update(
        self,
        expense_id: int,
        amount: Optional[float] = None,
        description: Optional[str] = None,
        category_id: Optional[int] = None,
        date: Optional[datetime] = None,
    ) -> Optional[Expense]:
        """Update an existing expense."""
        expense = self.get_by_id(expense_id)
        if not expense:
            return None

        if amount is not None:
            expense.amount = amount
        if description is not None:
            expense.description = description
        if category_id is not None:
            expense.category_id = category_id
        if date is not None:
            expense.date = date

        expense.updated_at = datetime.now()
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def delete(self, expense_id: int) -> bool:
        """Delete an expense. Returns True if deleted, False if not found."""
        expense = self.get_by_id(expense_id)
        if not expense:
            return False

        self.db.delete(expense)
        self.db.commit()
        return True


def get_expense_service(db: Session = Depends(get_db)) -> ExpenseService:
    return ExpenseService(db)
