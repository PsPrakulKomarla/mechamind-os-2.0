from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import delete

from app.core.exceptions import NotFoundException, ValidationException
from app.models.department import Department
from app.models.user import User
from app.models.user_dept_role import UserDepartmentRole
from app.models.enums import AuditAction, EntityType
from app.repositories.department import department_repo
from app.repositories.factory import factory_repo
from app.repositories.audit_log import audit_repo
from app.schemas.department import DepartmentCreate, DepartmentUpdate, UserAssignment

class DepartmentService:
    @staticmethod
    async def get_department(db: AsyncSession, department_id: UUID) -> Department:
        dept = await department_repo.get(db, id=department_id)
        if not dept or dept.is_deleted:
            raise NotFoundException(message="Department not found")
        return dept

    @staticmethod
    async def list_departments(db: AsyncSession, factory_id: UUID, skip: int = 0, limit: int = 100) -> List[Department]:
        return await department_repo.get_accessible_multi(db, factory_id=factory_id, skip=skip, limit=limit)

    @staticmethod
    async def create_department(db: AsyncSession, obj_in: DepartmentCreate, current_user: User) -> Department:
        # Validate Factory
        factory = await factory_repo.get(db, id=obj_in.factory_id)
        if not factory or factory.is_deleted:
            raise ValidationException(message="Invalid Factory ID")

        # Validate Name uniqueness inside factory
        existing_dept = await department_repo.get_by_name(db, name=obj_in.name, factory_id=obj_in.factory_id)
        if existing_dept:
            raise ValidationException(message="Department name already exists in this factory")

        dept = await department_repo.create(db, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.CREATE,
            entity_type=EntityType.DEPARTMENT,
            entity_id=dept.id,
            details={"name": dept.name, "factory_id": str(dept.factory_id)},
            ip_address=None
        )
        return dept

    @staticmethod
    async def update_department(db: AsyncSession, department_id: UUID, obj_in: DepartmentUpdate, current_user: User) -> Department:
        dept = await DepartmentService.get_department(db, department_id)
        
        if obj_in.name and obj_in.name != dept.name:
            existing_dept = await department_repo.get_by_name(db, name=obj_in.name, factory_id=dept.factory_id)
            if existing_dept:
                raise ValidationException(message="Department name already exists in this factory")
                
        dept = await department_repo.update(db, db_obj=dept, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.DEPARTMENT,
            entity_id=dept.id,
            details={"updated_fields": obj_in.model_dump(exclude_unset=True)},
            ip_address=None
        )
        return dept

    @staticmethod
    async def delete_department(db: AsyncSession, department_id: UUID, current_user: User) -> None:
        dept = await DepartmentService.get_department(db, department_id)
        
        await department_repo.update(db, db_obj=dept, obj_in={"is_deleted": True})
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.DELETE,
            entity_type=EntityType.DEPARTMENT,
            entity_id=dept.id,
            details={"name": dept.name},
            ip_address=None
        )

    @staticmethod
    async def assign_user(db: AsyncSession, department_id: UUID, obj_in: UserAssignment, current_user: User) -> None:
        dept = await DepartmentService.get_department(db, department_id)
        if not obj_in.role_id:
            raise ValidationException(message="A role_id is required for department assignment")
        
        user_dept_role = UserDepartmentRole(user_id=obj_in.user_id, department_id=dept.id, role_id=obj_in.role_id)
        db.add(user_dept_role)
        try:
            await db.commit()
        except IntegrityError:
            await db.rollback()
            raise ValidationException(message="User is already assigned this role in the department or User/Role does not exist")
            
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.DEPARTMENT,
            entity_id=dept.id,
            details={"assigned_user_id": str(obj_in.user_id), "role_id": str(obj_in.role_id)},
            ip_address=None
        )

    @staticmethod
    async def remove_user(db: AsyncSession, department_id: UUID, user_id: UUID, role_id: UUID, current_user: User) -> None:
        dept = await DepartmentService.get_department(db, department_id)
        await db.execute(
            delete(UserDepartmentRole).where(
                UserDepartmentRole.user_id == user_id,
                UserDepartmentRole.department_id == dept.id,
                UserDepartmentRole.role_id == role_id
            )
        )
        await db.commit()
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.DEPARTMENT,
            entity_id=dept.id,
            details={"removed_user_id": str(user_id), "role_id": str(role_id)},
            ip_address=None
        )
