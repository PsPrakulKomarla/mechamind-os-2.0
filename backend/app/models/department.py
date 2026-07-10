from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import BaseModel

class Department(BaseModel):
    __tablename__ = "departments"

    factory_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("factories.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    is_deleted: Mapped[bool] = mapped_column(default=False)

    # Relationships
    factory: Mapped["Factory"] = relationship("Factory", back_populates="departments")
