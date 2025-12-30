from fastapi import APIRouter, Depends

from api.dependencies import get_user_member
from models.member import Member
from schemas.member import (
    CreateMemberRequest,
    CreateMemberResponse,
    DeleteMemberResponse,
    GetMembersResponse,
    MemberResponse,
)
from services.member import MemberService, get_member_service

router = APIRouter(prefix="/members", tags=["Members"])


@router.get("", response_model=GetMembersResponse)
async def get_members(
    household_id: int,
    member_service: MemberService = Depends(get_member_service),
):
    members = member_service.get_members(household_id)
    return GetMembersResponse(
        members=[
            MemberResponse(
                id=m.id,
                name=m.name,
                image_url=m.image_url,
                household_id=m.household_id,
                created_at=m.created_at,
                updated_at=m.updated_at,
                is_primary=(i == 0),
            )
            for i, m in enumerate(members)
        ]
    )


@router.post("/", response_model=CreateMemberResponse)
async def create_member(
    member: CreateMemberRequest,
    member_service: MemberService = Depends(get_member_service),
):
    return member_service.create_member(
        member.name,
        member.household_id,
        member.image_url,
    )


@router.delete("/{member_id}", response_model=DeleteMemberResponse)
async def delete_member(
    member: Member = Depends(get_user_member),
    member_service: MemberService = Depends(get_member_service),
):
    member_service.delete_member(member.id)
    return DeleteMemberResponse(success=True)
