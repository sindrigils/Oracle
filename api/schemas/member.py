from models.member import Member
from pydantic import BaseModel


class CreateMemberRequest(BaseModel):
    name: str
    image_url: str
    household_id: int


class CreateMemberResponse(BaseModel):
    success: bool


class GetMembersResponse(BaseModel):
    members: list[Member]


class DeleteMemberResponse(BaseModel):
    success: bool
