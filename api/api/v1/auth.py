from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from api.dependencies import get_current_session
from services.user import UserService, get_user_service
from services.session import SessionService, get_session_service
from schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    LogoutResponse,
)
from models.session import Session as SessionModel


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    user_service: UserService = Depends(get_user_service),
    session_service: SessionService = Depends(get_session_service),
):
    identifier = request.identifier
    password = request.password
    user = user_service.authenticate(identifier, password)
    if not user:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    session = session_service.create_session(user.id)
    return LoginResponse(token=session.token)


@router.post("/register", response_model=RegisterResponse)
async def register(
    request: RegisterRequest,
    user_service: UserService = Depends(get_user_service),
):
    user_service.create_user(request.username, request.email, request.password)
    return RegisterResponse(success=True)


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    session: SessionModel = Depends(get_current_session),
    session_service: SessionService = Depends(get_session_service),
):
    session_service.delete_session(session.token)
    return LogoutResponse(success=True)
