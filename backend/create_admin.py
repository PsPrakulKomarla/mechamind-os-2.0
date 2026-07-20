import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from dotenv import load_dotenv

load_dotenv()

from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.organization import Organization
from app.models.role import Role
from app.models.user_role import UserRole
from app.core.security import get_password_hash

async def seed_admin():
    async with AsyncSessionLocal() as session:
        # 1. Get or create a default organization
        org_result = await session.execute(select(Organization).limit(1))
        org = org_result.scalars().first()
        if not org:
            org = Organization(name="MechaMind Default", domain="default.com")
            session.add(org)
            await session.flush()
            
        # 2. Get or create the System Admin role
        role_result = await session.execute(select(Role).filter_by(name="System Admin"))
        role = role_result.scalars().first()
        if not role:
            role = Role(name="System Admin", description="Full system access")
            session.add(role)
            await session.flush()
            
        # 3. Create the user from .env
        email = os.getenv("ADMIN_EMAIL")
        password = os.getenv("ADMIN_PASSWORD")
        
        if not email or not password:
            print("ADMIN_EMAIL or ADMIN_PASSWORD not found in .env")
            return
            
        user_result = await session.execute(select(User).filter_by(email=email))
        user = user_result.scalars().first()
        
        if not user:
            user = User(
                organization_id=org.id,
                email=email,
                password_hash=get_password_hash(password),
                first_name="Admin",
                last_name="User"
            )
            session.add(user)
            await session.flush()
            
            # Assign role
            ur = UserRole(user_id=user.id, role_id=role.id)
            session.add(ur)
            await session.commit()
            print(f"Admin user {email} created successfully!")
        else:
            # User exists, update password and ensure they are admin
            user.password_hash = get_password_hash(password)
            
            ur_result = await session.execute(select(UserRole).filter_by(user_id=user.id, role_id=role.id))
            if not ur_result.scalars().first():
                ur = UserRole(user_id=user.id, role_id=role.id)
                session.add(ur)
                
            await session.commit()
            print(f"Admin user {email} updated successfully!")

if __name__ == "__main__":
    asyncio.run(seed_admin())
