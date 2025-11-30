export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
}

export interface Member extends BaseEntity {
  name: string;
  image_url: string;
  household_id: number;
  is_primary?: boolean;
}

export interface Household extends BaseEntity {
  name: string;
  owner_id: number;
  members?: Member[];
}

export interface Session {
  token: string;
  user: User;
}

export interface ExpenseCategory extends BaseEntity {
  name: string;
  color: string;
  household_id: number;
  is_default?: boolean;
}

export interface Expense extends BaseEntity {
  amount: number;
  description: string;
  date: string;
  category_id: number;
  category?: ExpenseCategory;
  monthly_budget_id: number;
}

export interface MonthlyBudget extends BaseEntity {
  year: number;
  month: number;
  planned_amount: number;
  household_id: number;
  expenses?: Expense[];
}

export interface InvestmentAsset extends BaseEntity {
  name: string;
  ticker?: string;
  asset_type: string;
  household_id: number;
}

export interface Loan extends BaseEntity {
  name: string;
  principal_amount: number;
  interest_rate: number;
  start_date: string;
  household_id: number;
}
