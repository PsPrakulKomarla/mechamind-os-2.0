import asyncio
import sys
from app.db.session import AsyncSessionLocal
from sqlalchemy import select
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.permission import Permission
from app.models.role_permission import RolePermission

async def make_admin(email: str):
    async with AsyncSessionLocal() as db:
        user = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
        if not user:
            print(f"User {email} not found")
            return

        role = (await db.execute(select(Role).where(Role.name == "ADMIN"))).scalar_one_or_none()
        if not role:
            role = Role(name="ADMIN", description="Administrator")
            db.add(role)
            await db.flush()
        
        permissions_to_grant = [
            ("factory.create", "factory", "create"),
            ("department.create", "department", "create"),
            ("machine.create", "machine", "create"),
            ("machine.update", "machine", "update"),
            ("component.create", "component", "create"),
            ("document.create", "document", "create"),
            ("document.read", "document", "read"),
            ("document.update", "document", "update"),
            ("document.delete", "document", "delete")
        ]
        
        for p_name, p_res, p_act in permissions_to_grant:
            perm = (await db.execute(select(Permission).where(Permission.name == p_name))).scalar_one_or_none()
            if not perm:
                perm = Permission(name=p_name, action=p_act, resource=p_res, description=f"{p_act} {p_res}s")
                db.add(perm)
                await db.flush()
                
            role_perm = (await db.execute(select(RolePermission).where(RolePermission.role_id == role.id, RolePermission.permission_id == perm.id))).scalar_one_or_none()
            if not role_perm:
                db.add(RolePermission(role_id=role.id, permission_id=perm.id))
            
        # Assign ADMIN to user
        user_role = (await db.execute(select(UserRole).where(UserRole.user_id == user.id, UserRole.role_id == role.id))).scalar_one_or_none()
        if not user_role:
            db.add(UserRole(user_id=user.id, role_id=role.id))
        
        await db.commit()
        print(f"Granted ADMIN to {email}")

if __name__ == "__main__":
    asyncio.run(make_admin("test_integration@example.com"))
