from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ExpenseBase(BaseModel):
    amount: float
    description: str
    category_id: int
    date: Optional[datetime] = None


class CreateExpenseRequest(BaseModel):
    amount: float
    description: str
    category_id: int
    date: Optional[datetime] = None


class CreateExpenseResponse(BaseModel):
    id: int
    amount: float
    description: str
    category_id: int
    date: datetime


class UpdateExpenseRequest(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    date: Optional[datetime] = None


class UpdateExpenseResponse(BaseModel):
    id: int
    amount: float
    description: str
    category_id: int
    date: datetime


class ExpenseResponse(BaseModel):
    id: int
    amount: float
    description: str
    category_id: int
    date: datetime

    class Config:
        from_attributes = True


class GetExpensesResponse(BaseModel):
    expenses: list[ExpenseResponse]


class DeleteExpenseResponse(BaseModel):
    success: bool
