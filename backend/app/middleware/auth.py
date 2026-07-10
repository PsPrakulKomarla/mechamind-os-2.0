from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable

from app.core.jwt import jwt_service
from app.core.exceptions import UnauthorizedException

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Global authentication middleware.
    Extracts the JWT from the Authorization header, validates it, 
    and sets request.state.user_payload. 
    It does not block unauthorized requests natively, so public routes can still work.
    Access control is enforced by Dependencies that read request.state.user_payload.
    """
    async def dispatch(self, request: Request, call_next: Callable):
        auth_header = request.headers.get("Authorization")
        
        request.state.user_payload = None
        request.state.token = None

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                # We validate the access token here
                payload = await jwt_service.validate_token(token, expected_type="access")
                request.state.user_payload = payload
                request.state.token = token
            except UnauthorizedException as e:
                # If they provided a token but it's invalid, return 401 immediately
                return JSONResponse(
                    status_code=401,
                    content={
                        "error_code": "UnauthorizedException",
                        "message": e.message,
                        "details": {},
                        "timestamp": "now" # In real app, format UTC ISO
                    }
                )

        return await call_next(request)
