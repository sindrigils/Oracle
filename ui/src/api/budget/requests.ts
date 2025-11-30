import { apiClient } from '@/lib/axios';
import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  CreateExpenseRequest,
  CreateExpenseResponse,
  CreateIncomeRequest,
  CreateIncomeResponse,
  DeleteCategoryResponse,
  DeleteExpenseResponse,
  DeleteIncomeResponse,
  GetCategoriesResponse,
  GetExpensesResponse,
  GetIncomeResponse,
  GetOrCreateBudgetRequest,
  GetOrCreateBudgetResponse,
  UpdateBudgetRequest,
  UpdateBudgetResponse,
  UpdateExpenseRequest,
  UpdateExpenseResponse,
  UpdateIncomeRequest,
  UpdateIncomeResponse,
} from './types';

export async function getOrCreateBudget(
  data: GetOrCreateBudgetRequest
): Promise<GetOrCreateBudgetResponse> {
  const response = await apiClient.post<GetOrCreateBudgetResponse>(
    '/monthly_budgets',
    null,
    {
      params: {
        householdId: data.householdId,
        year: data.year,
        month: data.month,
      },
    }
  );
  return response.data;
}

export async function updateBudget(
  budgetId: number,
  data: UpdateBudgetRequest
): Promise<UpdateBudgetResponse> {
  const response = await apiClient.patch<UpdateBudgetResponse>(
    `/monthly_budgets/${budgetId}`,
    data
  );
  return response.data;
}

// Expenses
export async function getExpenses(
  budgetId: number
): Promise<GetExpensesResponse> {
  const response = await apiClient.get<GetExpensesResponse>(
    `/monthly_budgets/${budgetId}/expenses`
  );
  return response.data;
}

export async function createExpense(
  budgetId: number,
  data: CreateExpenseRequest
): Promise<CreateExpenseResponse> {
  const response = await apiClient.post<CreateExpenseResponse>(
    `/monthly_budgets/${budgetId}/expenses`,
    data
  );
  return response.data;
}

export async function updateExpense(
  expenseId: number,
  data: UpdateExpenseRequest
): Promise<UpdateExpenseResponse> {
  const response = await apiClient.patch<UpdateExpenseResponse>(
    `/expenses/${expenseId}`,
    data
  );
  return response.data;
}

export async function deleteExpense(
  expenseId: number
): Promise<DeleteExpenseResponse> {
  const response = await apiClient.delete<DeleteExpenseResponse>(
    `/expenses/${expenseId}`
  );
  return response.data;
}

// Income
export async function getIncome(budgetId: number): Promise<GetIncomeResponse> {
  const response = await apiClient.get<GetIncomeResponse>(
    `/monthly_budgets/${budgetId}/income`
  );
  return response.data;
}

export async function createIncome(
  budgetId: number,
  data: CreateIncomeRequest
): Promise<CreateIncomeResponse> {
  const response = await apiClient.post<CreateIncomeResponse>(
    `/monthly_budgets/${budgetId}/income`,
    data
  );
  return response.data;
}

export async function updateIncome(
  incomeId: number,
  data: UpdateIncomeRequest
): Promise<UpdateIncomeResponse> {
  const response = await apiClient.patch<UpdateIncomeResponse>(
    `/income/${incomeId}`,
    data
  );
  return response.data;
}

export async function deleteIncome(
  incomeId: number
): Promise<DeleteIncomeResponse> {
  const response = await apiClient.delete<DeleteIncomeResponse>(
    `/income/${incomeId}`
  );
  return response.data;
}

// Categories
export async function getCategories(): Promise<GetCategoriesResponse> {
  const response = await apiClient.get<GetCategoriesResponse>(
    '/expense_categories'
  );
  return response.data;
}

export async function createCategory(
  data: CreateCategoryRequest
): Promise<CreateCategoryResponse> {
  const response = await apiClient.post<CreateCategoryResponse>(
    '/expense_categories',
    data
  );
  return response.data;
}

export async function deleteCategory(
  categoryId: number
): Promise<DeleteCategoryResponse> {
  const response = await apiClient.delete<DeleteCategoryResponse>(
    `/expense_categories/${categoryId}`
  );
  return response.data;
}
