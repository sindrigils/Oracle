// Monthly Budget Types
export interface MonthlyBudget {
  id: number;
  householdId: number;
  year: number;
  month: number;
  plannedBudget: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetOrCreateBudgetRequest {
  householdId: number;
  year: number;
  month: number;
}

export interface GetOrCreateBudgetResponse {
  id: number;
  year: number;
  month: number;
  plannedBudget: number;
  currency: string;
}

export interface UpdateBudgetRequest {
  plannedBudget?: number;
  currency?: string;
}

export interface UpdateBudgetResponse {
  id: number;
  plannedBudget: number;
  currency: string;
}

// Expense Types
export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
  category?: ExpenseCategory;
  monthlyBudgetId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseRequest {
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface CreateExpenseResponse {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface UpdateExpenseRequest {
  amount?: number;
  description?: string;
  date?: string;
  categoryId?: number;
}

export interface UpdateExpenseResponse {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface DeleteExpenseResponse {
  success: boolean;
}

export interface GetExpensesResponse {
  expenses: Expense[];
}

// Income Types
export interface Income {
  id: number;
  amount: number;
  source: string;
  monthlyBudgetId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIncomeRequest {
  amount: number;
  source: string;
}

export interface CreateIncomeResponse {
  id: number;
  amount: number;
  source: string;
}

export interface UpdateIncomeRequest {
  amount?: number;
  source?: string;
}

export interface UpdateIncomeResponse {
  id: number;
  amount: number;
  source: string;
}

export interface DeleteIncomeResponse {
  success: boolean;
}

export interface GetIncomeResponse {
  income: Income[];
}

// Category Types
export type CategoryColor =
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'brown'
  | 'gray'
  | 'black'
  | 'white'
  | 'custom';

export interface ExpenseCategory {
  id: number;
  name: string;
  isCustom: boolean;
  color: CategoryColor;
  colorCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: CategoryColor;
  colorCode?: string;
}

export interface CreateCategoryResponse {
  id: number;
  name: string;
  isCustom: boolean;
  color: CategoryColor;
  colorCode?: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
}

export interface GetCategoriesResponse {
  categories: ExpenseCategory[];
}
