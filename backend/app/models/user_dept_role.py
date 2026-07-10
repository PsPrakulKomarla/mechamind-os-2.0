from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import BaseModel

class UserDepartmentRole(BaseModel):
    """Mapping table for assigning a role to a user within a specific Department scope."""
    __tablename__ = "user_department_roles"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    department_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"), primary_key=True)
    role_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    user: Mapped["User"] = relationship("User")
    department: Mapped["Department"] = relationship("Department")
    role: Mapped["Role"] = relationship("Role")
