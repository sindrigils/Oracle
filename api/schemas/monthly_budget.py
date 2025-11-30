from typing import Optional

from pydantic import BaseModel


class GetOrCreateMonthlyBudgetResponse(BaseModel):
    id: int
    year: int
    month: int
    planned_budget: float
    currency: str


class UpdateMonthlyBudgetRequest(BaseModel):
    planned_budget: Optional[float] = None
    currency: Optional[str] = None


class UpdateMonthlyBudgetResponse(BaseModel):
    id: int
    planned_budget: float
    currency: str
