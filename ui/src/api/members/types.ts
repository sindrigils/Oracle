import type { Member } from '@/types/global';

export interface CreateMemberRequest {
  name: string;
  imageUrl?: string;
  householdId: number;
}

export interface UpdateMemberRequest {
  name?: string;
  imageUrl?: string;
}

export interface GetMembersResponse {
  members: Member[];
}

export interface CreateMemberResponse {
  success: boolean;
  member: Member;
}

export interface DeleteMemberResponse {
  success: boolean;
}
