from typing import Optional

from pydantic import BaseModel


class CreateCategoryRequest(BaseModel):
    name: str
    color: str
    color_code: Optional[str] = None


class CreateCategoryResponse(BaseModel):
    id: int
    name: str
    is_custom: bool
    color: str
    color_code: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    is_custom: bool
    color: str
    color_code: Optional[str] = None

    class Config:
        from_attributes = True


class GetCategoriesResponse(BaseModel):
    categories: list[CategoryResponse]


class DeleteCategoryResponse(BaseModel):
    success: bool
