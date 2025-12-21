from fastapi import APIRouter, Depends, HTTPException

from schemas.expense import (
    DeleteExpenseResponse,
    UpdateExpenseRequest,
    UpdateExpenseResponse,
)
from services.expense import ExpenseService, get_expense_service

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.patch("/{expense_id}", response_model=UpdateExpenseResponse)
async def update_expense(
    expense_id: int,
    request: UpdateExpenseRequest,
    expense_service: ExpenseService = Depends(get_expense_service),
):
    """Update an existing expense."""
    expense = expense_service.update(
        expense_id=expense_id,
        amount=request.amount,
        description=request.description,
        category_id=request.category_id,
        date=request.date,
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    return UpdateExpenseResponse(
        id=expense.id,
        amount=expense.amount,
        description=expense.description,
        category_id=expense.category_id,
        date=expense.date,
    )


@router.delete("/{expense_id}", response_model=DeleteExpenseResponse)
async def delete_expense(
    expense_id: int,
    expense_service: ExpenseService = Depends(get_expense_service),
):
    """Delete an expense."""
    deleted = expense_service.delete(expense_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Expense not found")

    return DeleteExpenseResponse(success=True)
