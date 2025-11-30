from pydantic import BaseModel
from models.member import Member


class CreateMemberRequest(BaseModel):
    name: str
    image_url: str
    household_id: int


class CreateMemberResponse(BaseModel):
    success: bool


class GetMembersResponse(BaseModel):
    members: list[Member]
