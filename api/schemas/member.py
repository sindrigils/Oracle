from datetime import datetime

from pydantic import BaseModel


class CreateMemberRequest(BaseModel):
    name: str
    image_url: str
    household_id: int


class MemberResponse(BaseModel):
    id: int
    name: str
    image_url: str | None
    household_id: int
    created_at: datetime
    updated_at: datetime
    is_primary: bool = False


class CreateMemberResponse(BaseModel):
    success: bool
    member: MemberResponse | None = None


class GetMembersResponse(BaseModel):
    members: list[MemberResponse]


class DeleteMemberResponse(BaseModel):
    success: bool
