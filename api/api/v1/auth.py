from core.config import settings
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from models.session import Session as SessionModel
from schemas.auth import (
    HouseholdResponse,
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
    UserResponse,
    WhoAmIResponse,
)
from services.household import HouseholdService, get_household_service
from services.member import MemberService, get_member_service
from services.session import SessionService, get_session_service
from services.user import UserService, get_user_service
from starlette.status import HTTP_401_UNAUTHORIZED

from api.dependencies import get_current_session, get_session_from_cookie_optional

router = APIRouter(prefix="/auth", tags=["Authentication"])


def set_session_cookie(response: Response, token: str) -> None:
    """Set the session token as an HTTP-only cookie."""
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        max_age=settings.session_token_expiration_time,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
    )


def clear_session_cookie(response: Response) -> None:
    """Clear the session cookie."""
    response.delete_cookie(
        key=settings.session_cookie_name,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
    )


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    response: Response,
    fastapi_request: Request,
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

    user_agent = fastapi_request.headers.get("user-agent", "")
    ip_address = fastapi_request.client.host if fastapi_request.client else ""

    token = session_service.create_session(user.id, user_agent, ip_address)
    set_session_cookie(response, token)

    return LoginResponse(user=UserResponse.model_validate(user))


@router.post("/register", response_model=RegisterResponse)
async def register(
    request: RegisterRequest,
    user_service: UserService = Depends(get_user_service),
    household_service: HouseholdService = Depends(get_household_service),
    member_service: MemberService = Depends(get_member_service),
):
    user = user_service.create_user(request.username, request.email, request.password)
    household = household_service.create_household(
        f"{user.username}'s Household", user.id
    )
    member_service.create_member(user.username, household.id)
    return RegisterResponse(success=True)


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    response: Response,
    session: SessionModel = Depends(get_current_session),
    session_service: SessionService = Depends(get_session_service),
):
    session_service.delete_session(session.token)
    clear_session_cookie(response)
    return LogoutResponse(success=True)


@router.get("/whoami", response_model=WhoAmIResponse)
async def whoami(
    session: SessionModel | None = Depends(get_session_from_cookie_optional),
):
    if session is None:
        return WhoAmIResponse(user=None, household=None)

    user_response = UserResponse.model_validate(session.user)
    household_response = None
    if session.user.households:
        household_response = HouseholdResponse.model_validate(
            session.user.households[0]
        )

    return WhoAmIResponse(
        user=user_response,
        household=household_response,
    )
