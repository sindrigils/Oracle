from fastapi import APIRouter, Depends, HTTPException

from schemas.income import (
    DeleteIncomeResponse,
    UpdateIncomeRequest,
    UpdateIncomeResponse,
)
from services.income import IncomeService, get_income_service

router = APIRouter(prefix="/income", tags=["Income"])


@router.patch("/{income_id}", response_model=UpdateIncomeResponse)
async def update_income(
    income_id: int,
    request: UpdateIncomeRequest,
    income_service: IncomeService = Depends(get_income_service),
):
    """Update an existing income entry."""
    income = income_service.update(
        income_id=income_id,
        amount=request.amount,
        source=request.source,
    )
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")

    return UpdateIncomeResponse(
        id=income.id,
        amount=income.amount,
        source=income.source,
    )


@router.delete("/{income_id}", response_model=DeleteIncomeResponse)
async def delete_income(
    income_id: int,
    income_service: IncomeService = Depends(get_income_service),
):
    """Delete an income entry."""
    deleted = income_service.delete(income_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Income not found")

    return DeleteIncomeResponse(success=True)
