import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, DateTime, func
from app.db.base_class import BaseModel

class Building(BaseModel):
    __tablename__ = "buildings"

    name: Mapped[str] = mapped_column(String(255), index=True)
    address: Mapped[str] = mapped_column(String(255), nullable=True)
    factory_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("factories.id"), nullable=False)

    factory: Mapped["Factory"] = relationship("Factory", back_populates="buildings")
