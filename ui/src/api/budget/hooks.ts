import { queryKeys } from '@/lib/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  createExpense,
  createIncome,
  deleteCategory,
  deleteExpense,
  deleteIncome,
  getCategories,
  getExpenses,
  getIncome,
  getOrCreateBudget,
  updateBudget,
  updateExpense,
  updateIncome,
} from './requests';
import type {
  CreateCategoryRequest,
  CreateExpenseRequest,
  CreateIncomeRequest,
  UpdateBudgetRequest,
  UpdateExpenseRequest,
  UpdateIncomeRequest,
} from './types';

// Monthly Budget Hooks
export function useMonthlyBudget(
  householdId: number,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: queryKeys.budgets.byMonth(year, month),
    queryFn: () => getOrCreateBudget({ householdId, year, month }),
    enabled: Boolean(householdId && year && month),
  });
}

export function useUpdateBudget(year: number, month: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      data,
    }: {
      budgetId: number;
      data: UpdateBudgetRequest;
    }) => updateBudget(budgetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byMonth(year, month),
      });
    },
  });
}

// Expense Hooks
export function useExpenses(budgetId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.expenses.byBudget(budgetId!),
    queryFn: () => getExpenses(budgetId!),
    enabled: Boolean(budgetId),
  });
}

export function useCreateExpense(
  budgetId: number,
  year: number,
  month: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => createExpense(budgetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.byBudget(budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byMonth(year, month),
      });
    },
  });
}

export function useUpdateExpense(
  budgetId: number,
  year: number,
  month: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      data,
    }: {
      expenseId: number;
      data: UpdateExpenseRequest;
    }) => updateExpense(expenseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.byBudget(budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byMonth(year, month),
      });
    },
  });
}

export function useDeleteExpense(
  budgetId: number,
  year: number,
  month: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: number) => deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.byBudget(budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byMonth(year, month),
      });
    },
  });
}

// Income Hooks
export function useIncome(budgetId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.income.byBudget(budgetId!),
    queryFn: () => getIncome(budgetId!),
    enabled: Boolean(budgetId),
  });
}

export function useCreateIncome(budgetId: number, year: number, month: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncomeRequest) => createIncome(budgetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.income.byBudget(budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byMonth(year, month),
      });
    },
  });
}

export function useUpdateIncome(budgetId: number, year: number, month: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incomeId,
      data,
    }: {
      incomeId: number;
      data: UpdateIncomeRequest;
    }) => updateIncome(incomeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.income.byBudget(budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byMonth(year, month),
      });
    },
  });
}

export function useDeleteIncome(budgetId: number, year: number, month: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incomeId: number) => deleteIncome(incomeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.income.byBudget(budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byMonth(year, month),
      });
    },
  });
}

// Category Hooks
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => getCategories(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
    },
  });
}
