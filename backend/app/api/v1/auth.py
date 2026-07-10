from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from app.schemas.response import APIResponse
from app.schemas.auth import LoginRequest, RegisterRequest, Tokens
from app.schemas.user import UserResponse
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.services.auth import auth_service
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=APIResponse[UserResponse])
async def register(
    request_data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    user = await auth_service.register(db=db, obj_in=request_data)
    return APIResponse(data=UserResponse.model_validate(user))

@router.post("/login", response_model=APIResponse[Tokens])
async def login(
    request: Request,
    request_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    tokens = await auth_service.login(
        db=db, 
        obj_in=request_data, 
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    )
    return APIResponse(data=tokens)

@router.post("/logout", response_model=APIResponse[None])
async def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await auth_service.logout(db=db, user_id=current_user.id, access_token=request.state.token)
    return APIResponse(message="Successfully logged out")

@router.get("/me", response_model=APIResponse[UserResponse])
async def read_users_me(
    current_user: User = Depends(get_current_user),
) -> Any:
    return APIResponse(data=UserResponse.model_validate(current_user))
