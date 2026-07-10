from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from typing import List
import uuid

from app.db.base_class import BaseModel

class Factory(BaseModel):
    __tablename__ = "factories"

    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    is_deleted: Mapped[bool] = mapped_column(default=False)

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="factories")
    departments: Mapped[List["Department"]] = relationship("Department", back_populates="factory", cascade="all, delete-orphan")
