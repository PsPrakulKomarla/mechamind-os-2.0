from typing import Any, Dict, Generic, List, Optional, TypeVar, Union
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base_class import Base
from app.repositories.base import BaseRepository
from app.core.exceptions import NotFoundException

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Generic Service layer providing business logic over the repository."""

    def __init__(self, repository: BaseRepository[ModelType, CreateSchemaType, UpdateSchemaType]):
        self.repository = repository

    async def get(self, db: AsyncSession, id: UUID) -> ModelType:
        obj = await self.repository.get(db=db, id=id)
        if not obj:
            raise NotFoundException(f"{self.repository.model.__name__} not found")
        return obj

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return await self.repository.get_multi(db=db, skip=skip, limit=limit)

    async def create(self, db: AsyncSession, obj_in: CreateSchemaType) -> ModelType:
        return await self.repository.create(db=db, obj_in=obj_in)

    async def update(
        self, db: AsyncSession, id: UUID, obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        db_obj = await self.get(db=db, id=id)
        return await self.repository.update(db=db, db_obj=db_obj, obj_in=obj_in)

    async def remove(self, db: AsyncSession, id: UUID) -> ModelType:
        db_obj = await self.get(db=db, id=id)
        return await self.repository.remove(db=db, id=id)
