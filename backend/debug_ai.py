import asyncio
from app.db.session import AsyncSessionLocal
from app.api.v1.copilot import chat_with_copilot
from app.schemas.copilot import ChatRequest
from app.repositories.user import user_repo

async def debug():
    async with AsyncSessionLocal() as db:
        user = await user_repo.get_by_email(db, email="admin@gmail.com")
        req = ChatRequest(message="Hello")
        
        try:
            res = await chat_with_copilot(req, db, user)
            print("Success:", res)
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug())
