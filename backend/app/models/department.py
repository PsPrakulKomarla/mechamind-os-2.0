from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from typing import List, Optional
import uuid

from app.db.base_class import BaseModel
from app.models.enums import OperationalStatus, DepartmentType

class Department(BaseModel):
    __tablename__ = "departments"

    factory_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("factories.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    department_type: Mapped[DepartmentType] = mapped_column(Enum(DepartmentType), default=DepartmentType.CUSTOM)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    manager_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[OperationalStatus] = mapped_column(Enum(OperationalStatus), default=OperationalStatus.ACTIVE)
    is_deleted: Mapped[bool] = mapped_column(default=False)

    # Relationships
    factory: Mapped["Factory"] = relationship("Factory", back_populates="departments")
    manager: Mapped[Optional["User"]] = relationship("User", foreign_keys=[manager_id])
    teams: Mapped[List["Team"]] = relationship("Team", back_populates="department", cascade="all, delete-orphan")
