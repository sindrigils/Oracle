from fastapi import APIRouter, Depends

from schemas.expense import (
    CreateExpenseRequest,
    CreateExpenseResponse,
    ExpenseResponse,
    GetExpensesResponse,
)
from schemas.income import (
    CreateIncomeRequest,
    CreateIncomeResponse,
    GetIncomeResponse,
    IncomeResponse,
)
from schemas.monthly_budget import (
    GetOrCreateMonthlyBudgetResponse,
    UpdateMonthlyBudgetRequest,
    UpdateMonthlyBudgetResponse,
)
from services.expense import ExpenseService, get_expense_service
from services.income import IncomeService, get_income_service
from services.monthly_budget import MonthlyBudgetService, get_monthly_budget_service

router = APIRouter(prefix="/monthly_budgets", tags=["Monthly Budgets"])


# ============ Monthly Budget Endpoints ============


@router.post("", response_model=GetOrCreateMonthlyBudgetResponse)
async def get_or_create_monthly_budget(
    household_id: int,
    year: int,
    month: int,
    monthly_budget_service: MonthlyBudgetService = Depends(get_monthly_budget_service),
):
    """Get an existing monthly budget or create a new one for the given month/year."""
    monthly_budget = monthly_budget_service.get_or_create(household_id, year, month)
    return GetOrCreateMonthlyBudgetResponse(
        id=monthly_budget.id,
        year=monthly_budget.year,
        month=monthly_budget.month,
        planned_budget=monthly_budget.planned_budget,
        currency=monthly_budget.currency,
    )


@router.patch("/{monthly_budget_id}", response_model=UpdateMonthlyBudgetResponse)
async def update_monthly_budget(
    monthly_budget_id: int,
    request: UpdateMonthlyBudgetRequest,
    monthly_budget_service: MonthlyBudgetService = Depends(get_monthly_budget_service),
):
    """Update the planned budget and/or currency for a monthly budget."""
    monthly_budget = monthly_budget_service.update(
        monthly_budget_id,
        request.planned_budget,
        request.currency,
    )
    return UpdateMonthlyBudgetResponse(
        id=monthly_budget.id,
        planned_budget=monthly_budget.planned_budget,
        currency=monthly_budget.currency,
    )


# ============ Expense Endpoints ============


@router.get("/{monthly_budget_id}/expenses", response_model=GetExpensesResponse)
async def get_expenses(
    monthly_budget_id: int,
    expense_service: ExpenseService = Depends(get_expense_service),
):
    """Get all expenses for a monthly budget."""
    expenses = expense_service.get_by_budget(monthly_budget_id)
    return GetExpensesResponse(
        expenses=[
            ExpenseResponse(
                id=e.id,
                amount=e.amount,
                description=e.description,
                category_id=e.category_id,
                date=e.date,
            )
            for e in expenses
        ]
    )


@router.post("/{monthly_budget_id}/expenses", response_model=CreateExpenseResponse)
async def create_expense(
    monthly_budget_id: int,
    request: CreateExpenseRequest,
    expense_service: ExpenseService = Depends(get_expense_service),
):
    """Create a new expense for a monthly budget."""
    expense = expense_service.create(
        monthly_budget_id=monthly_budget_id,
        amount=request.amount,
        description=request.description,
        category_id=request.category_id,
        date=request.date,
    )
    return CreateExpenseResponse(
        id=expense.id,
        amount=expense.amount,
        description=expense.description,
        category_id=expense.category_id,
        date=expense.date,
    )


# ============ Income Endpoints ============


@router.get("/{monthly_budget_id}/income", response_model=GetIncomeResponse)
async def get_income(
    monthly_budget_id: int,
    income_service: IncomeService = Depends(get_income_service),
):
    """Get all income entries for a monthly budget."""
    income_list = income_service.get_by_budget(monthly_budget_id)
    return GetIncomeResponse(
        income=[
            IncomeResponse(
                id=i.id,
                amount=i.amount,
                source=i.source,
            )
            for i in income_list
        ]
    )


@router.post("/{monthly_budget_id}/income", response_model=CreateIncomeResponse)
async def create_income(
    monthly_budget_id: int,
    request: CreateIncomeRequest,
    income_service: IncomeService = Depends(get_income_service),
):
    """Create a new income entry for a monthly budget."""
    income = income_service.create(
        monthly_budget_id=monthly_budget_id,
        amount=request.amount,
        source=request.source,
    )
    return CreateIncomeResponse(
        id=income.id,
        amount=income.amount,
        source=income.source,
    )
