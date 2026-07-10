from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from typing import List, Optional
import uuid

from app.db.base_class import BaseModel
from app.models.enums import OperationalStatus

class Team(BaseModel):
    __tablename__ = "teams"

    department_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    team_lead_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[OperationalStatus] = mapped_column(Enum(OperationalStatus), default=OperationalStatus.ACTIVE)
    is_deleted: Mapped[bool] = mapped_column(default=False)

    # Relationships
    department: Mapped["Department"] = relationship("Department", back_populates="teams")
    team_lead: Mapped[Optional["User"]] = relationship("User", foreign_keys=[team_lead_id])
