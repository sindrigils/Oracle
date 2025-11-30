import type { Member } from "@/types/global";

export interface CreateMemberRequest {
  name: string;
  image_url?: string;
  household_id: number;
}

export interface UpdateMemberRequest {
  name?: string;
  image_url?: string;
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
