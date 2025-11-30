from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
from sqlalchemy.orm import Session

from db.engine import get_db
from models.user import User
from models.household import Household
from models.member import Member
from models.session import Session as SessionModel
from services.session import SessionService, get_session_service

security = HTTPBearer()


def get_current_session(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session_service: SessionService = Depends(get_session_service),
) -> SessionModel:
    """Get the current valid session from the token."""
    token = credentials.credentials
    session = session_service.get_valid_session(token)
    if not session:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )
    return session


def get_current_user(
    session: SessionModel = Depends(get_current_session),
) -> User:
    """Get the currently authenticated user from the session."""
    return session.user


class HouseholdAccess:
    """Dependency that verifies user has access to a household."""

    def __init__(self, household_id_param: str = "household_id"):
        self.household_id_param = household_id_param

    def __call__(
        self,
        household_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> Household:
        household = db.query(Household).filter(Household.id == household_id).first()

        if not household:
            raise HTTPException(status_code=404, detail="Household not found")

        if household.owner_id != current_user.id:
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail="You don't have access to this household",
            )

        return household


verify_household_access = HouseholdAccess()


def get_user_member(
    member_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Member:
    """Verify user has access to this member and return it."""
    member = db.query(Member).filter(Member.id == member_id).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    if member.household.owner_id != current_user.id:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="You don't have access to this member",
        )

    return member
