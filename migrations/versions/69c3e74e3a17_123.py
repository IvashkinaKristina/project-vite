"""123

Revision ID: 69c3e74e3a17
Revises: 002b354b6804
Create Date: 2025-03-14 16:13:30.332967

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '69c3e74e3a17'
down_revision: Union[str, None] = '002b354b6804'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Добавляем столбец без ограничения NOT NULL
    op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=True))

    # Заполняем столбец значениями по умолчанию (например, пустой строкой)
    op.execute("UPDATE users SET hashed_password = '' WHERE hashed_password IS NULL")

    # Устанавливаем ограничение NOT NULL
    op.alter_column('users', 'hashed_password', nullable=False)

def downgrade():
    # Удаляем столбец
    op.drop_column('users', 'hashed_password')
