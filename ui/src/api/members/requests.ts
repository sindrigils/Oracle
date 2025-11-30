import { apiClient } from '@/lib/axios';
import type {
  CreateMemberRequest,
  CreateMemberResponse,
  DeleteMemberResponse,
  GetMembersResponse,
  UpdateMemberRequest,
} from './types';

export const membersApi = {
  getMembers: async (householdId: number): Promise<GetMembersResponse> => {
    const response = await apiClient.get<GetMembersResponse>('/members', {
      params: { householdId },
    });
    return response.data;
  },

  createMember: async (
    data: CreateMemberRequest
  ): Promise<CreateMemberResponse> => {
    const response = await apiClient.post<CreateMemberResponse>(
      '/members/',
      data
    );
    return response.data;
  },

  updateMember: async (
    memberId: number,
    data: UpdateMemberRequest
  ): Promise<CreateMemberResponse> => {
    const response = await apiClient.patch<CreateMemberResponse>(
      `/members/${memberId}`,
      data
    );
    return response.data;
  },

  deleteMember: async (memberId: number): Promise<DeleteMemberResponse> => {
    const response = await apiClient.delete<DeleteMemberResponse>(
      `/members/${memberId}`
    );
    return response.data;
  },
};
