export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
}

export interface Member extends BaseEntity {
  name: string;
  imageUrl: string;
  householdId: number;
  isPrimary?: boolean;
}

export interface Household extends BaseEntity {
  name: string;
  ownerId: number;
  members?: Member[];
}

export interface Session {
  token: string;
  user: User;
}

export interface ExpenseCategory extends BaseEntity {
  name: string;
  color: string;
  householdId: number;
  isDefault?: boolean;
}

export interface Expense extends BaseEntity {
  amount: number;
  description: string;
  date: string;
  categoryId: number;
  category?: ExpenseCategory;
  monthlyBudgetId: number;
}

export interface MonthlyBudget extends BaseEntity {
  year: number;
  month: number;
  plannedAmount: number;
  householdId: number;
  expenses?: Expense[];
}

export interface InvestmentAsset extends BaseEntity {
  name: string;
  ticker?: string;
  assetType: string;
  householdId: number;
}

export interface Loan extends BaseEntity {
  name: string;
  principalAmount: number;
  interestRate: number;
  startDate: string;
  householdId: number;
}
