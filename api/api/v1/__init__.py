from fastapi import APIRouter

from .auth import router as auth_router
from .expense import router as expense_router
from .expense_category import router as expense_category_router
from .income import router as income_router
from .monthly_budget import router as monthly_budget_router

v1_router = APIRouter(prefix="/v1", tags=["v1"])

v1_router.include_router(auth_router)
v1_router.include_router(monthly_budget_router)
v1_router.include_router(expense_router)
v1_router.include_router(income_router)
v1_router.include_router(expense_category_router)
