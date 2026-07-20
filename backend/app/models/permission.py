from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from typing import List, Optional

from app.db.base_class import BaseModel

class Permission(BaseModel):
    __tablename__ = "permissions"

    name: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    action: Mapped[str] = mapped_column(String(100), index=True)
    resource: Mapped[str] = mapped_column(String(100), index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    role_permissions: Mapped[List["RolePermission"]] = relationship("RolePermission", back_populates="permission", cascade="all, delete-orphan")
