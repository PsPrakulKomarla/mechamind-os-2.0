"""Use pgvector

Revision ID: 7b6d65dc470c
Revises: 5ddb24b1c6df
Create Date: 2026-07-20 21:39:41.588776

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import pgvector.sqlalchemy

# revision identifiers, used by Alembic.
revision: str = '7b6d65dc470c'
down_revision: Union[str, None] = '5ddb24b1c6df'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    op.drop_column('knowledge_embeddings', 'embedding_vector')
    op.add_column('knowledge_embeddings', sa.Column('embedding_vector', pgvector.sqlalchemy.vector.VECTOR(dim=384), nullable=True))


def downgrade() -> None:
    op.drop_column('knowledge_embeddings', 'embedding_vector')
    op.add_column('knowledge_embeddings', sa.Column('embedding_vector', postgresql.BYTEA(), nullable=True))
    op.execute("DROP EXTENSION IF EXISTS vector;")
