from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import BaseModel

class UserFactoryRole(BaseModel):
    """Mapping table for assigning a role to a user within a specific Factory scope."""
    __tablename__ = "user_factory_roles"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    factory_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("factories.id", ondelete="CASCADE"), primary_key=True)
    role_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    user: Mapped["User"] = relationship("User")
    factory: Mapped["Factory"] = relationship("Factory")
    role: Mapped["Role"] = relationship("Role")
