from typing import Optional

from pydantic import BaseModel


class CreateIncomeRequest(BaseModel):
    amount: float
    source: str


class CreateIncomeResponse(BaseModel):
    id: int
    amount: float
    source: str


class UpdateIncomeRequest(BaseModel):
    amount: Optional[float] = None
    source: Optional[str] = None


class UpdateIncomeResponse(BaseModel):
    id: int
    amount: float
    source: str


class IncomeResponse(BaseModel):
    id: int
    amount: float
    source: str

    class Config:
        from_attributes = True


class GetIncomeResponse(BaseModel):
    income: list[IncomeResponse]


class DeleteIncomeResponse(BaseModel):
    success: bool
