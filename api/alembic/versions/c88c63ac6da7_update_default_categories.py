"""update_default_categories

Revision ID: c88c63ac6da7
Revises: 35f2f01bc638
Create Date: 2025-11-30 17:32:08.972388

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "c88c63ac6da7"
down_revision: Union[str, Sequence[str], None] = "35f2f01bc638"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Delete all existing default categories (is_custom = false)
    op.execute("DELETE FROM expense_categories WHERE is_custom = false")

    # Insert new default Icelandic categories
    op.execute(
        """
        INSERT INTO expense_categories (name, color, is_custom, created_at, updated_at) VALUES
        ('Matvörur (Groceries)', 'GREEN', false, NOW(), NOW()),
        ('Samgöngur (Transportation)', 'BLUE', false, NOW(), NOW()),
        ('Afþreying (Entertainment)', 'PURPLE', false, NOW(), NOW()),
        ('Útvegingar (Dining Out)', 'ORANGE', false, NOW(), NOW()),
        ('Gjald (Utilities)', 'YELLOW', false, NOW(), NOW()),
        ('Heilsa (Healthcare)', 'RED', false, NOW(), NOW()),
        ('Verslun (Shopping)', 'PINK', false, NOW(), NOW()),
        ('Annað (Other)', 'GRAY', false, NOW(), NOW())
    """
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Delete Icelandic default categories
    op.execute("DELETE FROM expense_categories WHERE is_custom = false")

    # Insert back English default categories
    op.execute(
        """
        INSERT INTO expense_categories (name, color, is_custom, created_at, updated_at) VALUES
        ('Groceries', 'GREEN', false, NOW(), NOW()),
        ('Transportation', 'BLUE', false, NOW(), NOW()),
        ('Entertainment', 'PURPLE', false, NOW(), NOW()),
        ('Dining Out', 'ORANGE', false, NOW(), NOW()),
        ('Utilities', 'YELLOW', false, NOW(), NOW()),
        ('Healthcare', 'RED', false, NOW(), NOW()),
        ('Shopping', 'PINK', false, NOW(), NOW()),
        ('Other', 'GRAY', false, NOW(), NOW())
    """
    )
