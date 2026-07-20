import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select

async def check():
    async with AsyncSessionLocal() as s:
        res = await s.execute(select(User.email, User.password_hash))
        users = res.all()
        for u in users:
            print(f"Email: {u[0]}, Hash: {u[1][:10]}...")

if __name__ == "__main__":
    asyncio.run(check())
