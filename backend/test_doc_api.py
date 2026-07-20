import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

async def test():
    async with httpx.AsyncClient(base_url="http://localhost:8000/api/v1") as client:
        # 1. Login
        login_data = {
            "email": os.getenv("ADMIN_EMAIL", "admin@gmail.com"),
            "password": os.getenv("ADMIN_PASSWORD", "qwertyuiop")
        }
        res = await client.post("/auth/login", json=login_data)
        if res.status_code != 200:
            print("Login failed:", res.status_code, res.text)
            return
            
        token = res.json()["data"]["access_token"]
        print("Logged in successfully.")
        
        # 2. Test /auth/me
        res = await client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        print("/auth/me status:", res.status_code)
        
        # 3. Test /documents
        res = await client.get("/documents", headers={"Authorization": f"Bearer {token}"})
        print("/documents status:", res.status_code)
        print("/documents body:", res.text[:200])
        
        # 4. Test /documents/
        res = await client.get("/documents/", headers={"Authorization": f"Bearer {token}"})
        print("/documents/ status:", res.status_code)
        
if __name__ == "__main__":
    asyncio.run(test())
