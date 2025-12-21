from datetime import datetime
from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from db.engine import get_db
from models.expense_category import Color, ExpenseCategory

# Default categories that should exist for all users
DEFAULT_CATEGORIES = [
    {"name": "Matvörur (Groceries)", "color": Color.GREEN},
    {"name": "Samgöngur (Transportation)", "color": Color.BLUE},
    {"name": "Afþreying (Entertainment)", "color": Color.PURPLE},
    {"name": "Útvegingar (Dining Out)", "color": Color.ORANGE},
    {"name": "Gjald (Utilities)", "color": Color.YELLOW},
    {"name": "Heilsa (Healthcare)", "color": Color.RED},
    {"name": "Verslun (Shopping)", "color": Color.PINK},
    {"name": "Annað (Other)", "color": Color.GRAY},
]


class ExpenseCategoryService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[ExpenseCategory]:
        """Get all expense categories."""
        # Ensure default categories exist
        self._ensure_default_categories()
        return self.db.query(ExpenseCategory).order_by(ExpenseCategory.name).all()

    def get_by_id(self, category_id: int) -> Optional[ExpenseCategory]:
        """Get a single category by ID."""
        return (
            self.db.query(ExpenseCategory)
            .filter(ExpenseCategory.id == category_id)
            .first()
        )

    def _ensure_default_categories(self) -> None:
        """Create default categories if they don't exist, or update existing ones."""
        existing_defaults = (
            self.db.query(ExpenseCategory).filter(not ExpenseCategory.is_custom).all()
        )

        # If no default categories exist, create them
        if len(existing_defaults) == 0:
            for cat_data in DEFAULT_CATEGORIES:
                category = ExpenseCategory(
                    name=cat_data["name"],
                    color=cat_data["color"],
                    is_custom=False,
                )
                self.db.add(category)
            self.db.commit()
        # If default categories exist, update them to ensure they have the correct names
        elif len(existing_defaults) > 0:
            # Update existing categories with new names if needed
            for i, existing_cat in enumerate(existing_defaults):
                if i < len(DEFAULT_CATEGORIES):
                    new_data = DEFAULT_CATEGORIES[i]
                    if (
                        existing_cat.name != new_data["name"]
                        or existing_cat.color != new_data["color"]
                    ):
                        existing_cat.name = new_data["name"]
                        existing_cat.color = new_data["color"]
            self.db.commit()

    def create(
        self,
        name: str,
        color: Color,
        color_code: Optional[str] = None,
    ) -> ExpenseCategory:
        """Create a new custom category."""
        category = ExpenseCategory(
            name=name,
            color=color,
            color_code=color_code,
            is_custom=True,
        )
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def update(
        self,
        category_id: int,
        name: Optional[str] = None,
        color: Optional[Color] = None,
        color_code: Optional[str] = None,
    ) -> Optional[ExpenseCategory]:
        """Update an existing category."""
        category = self.get_by_id(category_id)
        if not category:
            return None

        # Only allow updating custom categories
        if not category.is_custom:
            raise ValueError("Cannot update default categories")

        if name is not None:
            category.name = name
        if color is not None:
            category.color = color
        if color_code is not None:
            category.color_code = color_code

        category.updated_at = datetime.now()
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category_id: int) -> bool:
        """Delete a category. Only custom categories can be deleted."""
        category = self.get_by_id(category_id)
        if not category:
            return False

        # Only allow deleting custom categories
        if not category.is_custom:
            raise ValueError("Cannot delete default categories")

        self.db.delete(category)
        self.db.commit()
        return True


def get_expense_category_service(
    db: Session = Depends(get_db),
) -> ExpenseCategoryService:
    return ExpenseCategoryService(db)
