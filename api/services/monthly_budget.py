from datetime import datetime
from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from db.engine import get_db
from models.monthly_budget import MonthlyBudget


class MonthlyBudgetService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create(
        self,
        household_id: int,
        year: int,
        month: int,
    ) -> MonthlyBudget:
        monthly_budget = (
            self.db.query(MonthlyBudget)
            .filter(MonthlyBudget.household_id == household_id)
            .filter(MonthlyBudget.year == year)
            .filter(MonthlyBudget.month == month)
            .first()
        )
        if monthly_budget:
            return monthly_budget
        previous_monthly_budget = (
            self.db.query(MonthlyBudget)
            .filter(MonthlyBudget.household_id == household_id)
            .order_by(MonthlyBudget.created_at.desc())
            .first()
        )
        currency = (
            previous_monthly_budget.currency if previous_monthly_budget else "ISK"
        )
        planned_budget = (
            previous_monthly_budget.planned_budget if previous_monthly_budget else 0
        )
        monthly_budget = MonthlyBudget(
            household_id=household_id,
            year=year,
            month=month,
            planned_budget=(planned_budget),
            currency=currency,
            name=f"{year}-{month:02d}",
        )
        self.db.add(monthly_budget)
        self.db.commit()
        return monthly_budget

    def update(
        self,
        monthly_budget_id: int,
        planned_budget: Optional[float] = None,
        currency: Optional[str] = None,
    ) -> MonthlyBudget:
        monthly_budget = (
            self.db.query(MonthlyBudget)
            .filter(MonthlyBudget.id == monthly_budget_id)
            .first()
        )
        if not monthly_budget:
            raise ValueError("Monthly budget not found")
        if planned_budget:
            monthly_budget.planned_budget = planned_budget
        if currency:
            monthly_budget.currency = currency
        monthly_budget.updated_at = datetime.now()
        self.db.commit()
        return monthly_budget


def get_monthly_budget_service(db: Session = Depends(get_db)) -> MonthlyBudgetService:
    return MonthlyBudgetService(db)
