from fastapi import APIRouter, Depends, HTTPException

from models.expense_category import Color
from schemas.expense_category import (
    CategoryResponse,
    CreateCategoryRequest,
    CreateCategoryResponse,
    DeleteCategoryResponse,
    GetCategoriesResponse,
)
from services.expense_category import (
    ExpenseCategoryService,
    get_expense_category_service,
)

router = APIRouter(prefix="/expense_categories", tags=["Expense Categories"])


@router.get("", response_model=GetCategoriesResponse)
async def get_categories(
    category_service: ExpenseCategoryService = Depends(get_expense_category_service),
):
    """Get all expense categories (includes default and custom categories)."""
    categories = category_service.get_all()
    return GetCategoriesResponse(
        categories=[
            CategoryResponse(
                id=c.id,
                name=c.name,
                is_custom=c.is_custom,
                color=c.color.value,
                color_code=c.color_code,
            )
            for c in categories
        ]
    )


@router.post("", response_model=CreateCategoryResponse)
async def create_category(
    request: CreateCategoryRequest,
    category_service: ExpenseCategoryService = Depends(get_expense_category_service),
):
    """Create a new custom expense category."""
    try:
        color = Color(request.color)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid color. Must be one of: {[c.value for c in Color]}",
        ) from e

    category = category_service.create(
        name=request.name,
        color=color,
        color_code=request.color_code,
    )
    return CreateCategoryResponse(
        id=category.id,
        name=category.name,
        is_custom=category.is_custom,
        color=category.color.value,
        color_code=category.color_code,
    )


@router.delete("/{category_id}", response_model=DeleteCategoryResponse)
async def delete_category(
    category_id: int,
    category_service: ExpenseCategoryService = Depends(get_expense_category_service),
):
    """Delete a custom expense category. Default categories cannot be deleted."""
    try:
        deleted = category_service.delete(category_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Category not found")
        return DeleteCategoryResponse(success=True)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
