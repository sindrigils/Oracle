import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "./requests";
import { queryKeys } from "@/lib/react-query";
import type { CreateMemberRequest, UpdateMemberRequest } from "./types";

export function useMembers(householdId: number) {
  return useQuery({
    queryKey: queryKeys.members.byHousehold(householdId),
    queryFn: () => membersApi.getMembers(householdId),
    enabled: Boolean(householdId),
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberRequest) => membersApi.createMember(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.byHousehold(variables.household_id),
      });
    },
  });
}

export function useUpdateMember(householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number;
      data: UpdateMemberRequest;
    }) => membersApi.updateMember(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.byHousehold(householdId),
      });
    },
  });
}

export function useDeleteMember(householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => membersApi.deleteMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.byHousehold(householdId),
      });
    },
  });
}
