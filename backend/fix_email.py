import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import update

async def fix():
    async with AsyncSessionLocal() as s:
        await s.execute(update(User).where(User.email == 'admin@gmai.com').values(email='admin@gmail.com'))
        await s.commit()
        print('Fixed email')

if __name__ == "__main__":
    asyncio.run(fix())
