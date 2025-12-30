import { DefaultOptions, QueryClient } from '@tanstack/react-query';

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (
        axiosError?.response?.status &&
        axiosError.response.status >= 400 &&
        axiosError.response.status < 500
      ) {
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
    byHousehold: (householdId: number) =>
      [...queryKeys.members.all, householdId] as const,
  },
  households: {
    all: ['households'] as const,
    detail: (id: number) => [...queryKeys.households.all, id] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    byMonth: (year: number, month: number) =>
      [...queryKeys.budgets.all, year, month] as const,
  },
  expenses: {
    all: ['expenses'] as const,
    byBudget: (budgetId: number) =>
      [...queryKeys.expenses.all, budgetId] as const,
  },
  income: {
    all: ['income'] as const,
    byBudget: (budgetId: number) =>
      [...queryKeys.income.all, budgetId] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  investments: {
    all: ['investments'] as const,
    byMember: (memberId: number) =>
      [...queryKeys.investments.all, 'member', memberId] as const,
    byHousehold: (householdId: number) =>
      [...queryKeys.investments.all, 'household', householdId] as const,
    detail: (assetId: number) =>
      [...queryKeys.investments.all, 'detail', assetId] as const,
    transactions: (assetId: number) =>
      [...queryKeys.investments.all, 'transactions', assetId] as const,
    valuations: (assetId: number) =>
      [...queryKeys.investments.all, 'valuations', assetId] as const,
    portfolio: (householdId: number) =>
      [...queryKeys.investments.all, 'portfolio', householdId] as const,
  },
  loans: {
    all: ['loans'] as const,
    detail: (id: number) => [...queryKeys.loans.all, id] as const,
  },
} as const;
