import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: false,
  },
};

export function createQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions });
}

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: number) => [...queryKeys.users.all, id] as const,
  },
  members: {
    all: ['members'] as const,
    byHousehold: (householdId: number) => [...queryKeys.members.all, householdId] as const,
  },
  households: {
    all: ['households'] as const,
    detail: (id: number) => [...queryKeys.households.all, id] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    byMonth: (year: number, month: number) => [...queryKeys.budgets.all, year, month] as const,
  },
  investments: {
    all: ['investments'] as const,
    byMember: (memberId: number) => [...queryKeys.investments.all, memberId] as const,
  },
  loans: {
    all: ['loans'] as const,
    detail: (id: number) => [...queryKeys.loans.all, id] as const,
  },
} as const;
