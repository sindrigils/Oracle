'use client';

import { useAuth } from '@/api/auth/context';
import {
  useCategories,
  useCreateCategory,
  useCreateExpense,
  useCreateIncome,
  useDeleteExpense,
  useDeleteIncome,
  useExpenses,
  useIncome,
  useMonthlyBudget,
  useUpdateBudget,
  useUpdateExpense,
  useUpdateIncome,
} from '@/api/budget/hooks';
import type {
  CreateExpenseRequest,
  CreateIncomeRequest,
  Expense,
  Income,
} from '@/api/budget/types';
import { ErrorState, Loader } from '@/core/components';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { BudgetHero } from './_components/budget-hero';
import { CategoryFormModal } from './_components/category-form-modal';
import { ExpenseFormModal } from './_components/expense-form-modal';
import { IncomeFormModal } from './_components/income-form-modal';
import { MonthPicker } from './_components/month-picker';
import { QuickActions } from './_components/quick-actions';
import { TransactionList } from './_components/transaction-list';

export default function BudgetPage() {
  const { household, isLoading: authLoading } = useAuth();
  const householdId = household?.id;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  // Modal states
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Data queries
  const {
    data: budget,
    isLoading: budgetLoading,
    error: budgetError,
  } = useMonthlyBudget(householdId || 0, year, month);

  const budgetId = budget?.id;

  const { data: expensesData, isLoading: expensesLoading } =
    useExpenses(budgetId);
  const { data: incomeData, isLoading: incomeLoading } = useIncome(budgetId);
  const { data: categoriesData } = useCategories();

  // Mutations
  const updateBudgetMutation = useUpdateBudget(year, month);
  const createExpenseMutation = useCreateExpense(budgetId || 0, year, month);
  const updateExpenseMutation = useUpdateExpense(budgetId || 0, year, month);
  const deleteExpenseMutation = useDeleteExpense(budgetId || 0, year, month);
  const createIncomeMutation = useCreateIncome(budgetId || 0, year, month);
  const updateIncomeMutation = useUpdateIncome(budgetId || 0, year, month);
  const deleteIncomeMutation = useDeleteIncome(budgetId || 0, year, month);
  const createCategoryMutation = useCreateCategory();

  // Computed values
  const expenses = useMemo(
    () => expensesData?.expenses || [],
    [expensesData?.expenses]
  );
  const income = useMemo(() => incomeData?.income || [], [incomeData?.income]);
  const categories = categoriesData?.categories || [];

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  const totalIncome = useMemo(
    () => income.reduce((sum, inc) => sum + inc.amount, 0),
    [income]
  );

  // Handlers
  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const handleUpdateBudget = (amount: number) => {
    if (!budgetId) return;
    updateBudgetMutation.mutate({
      budgetId,
      data: { plannedBudget: amount, currency: budget?.currency || 'ISK' },
    });
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleExpenseSubmit = (data: CreateExpenseRequest) => {
    if (editingExpense) {
      updateExpenseMutation.mutate(
        { expenseId: editingExpense.id, data },
        { onSuccess: () => setExpenseModalOpen(false) }
      );
    } else {
      createExpenseMutation.mutate(data, {
        onSuccess: () => setExpenseModalOpen(false),
      });
    }
  };

  const handleDeleteExpense = (expenseId: number) => {
    deleteExpenseMutation.mutate(expenseId);
  };

  const handleAddIncome = () => {
    setEditingIncome(null);
    setIncomeModalOpen(true);
  };

  const handleEditIncome = (incomeItem: Income) => {
    setEditingIncome(incomeItem);
    setIncomeModalOpen(true);
  };

  const handleIncomeSubmit = (data: CreateIncomeRequest) => {
    if (editingIncome) {
      updateIncomeMutation.mutate(
        { incomeId: editingIncome.id, data },
        { onSuccess: () => setIncomeModalOpen(false) }
      );
    } else {
      createIncomeMutation.mutate(data, {
        onSuccess: () => setIncomeModalOpen(false),
      });
    }
  };

  const handleDeleteIncome = (incomeId: number) => {
    deleteIncomeMutation.mutate(incomeId);
  };

  const handleCategorySubmit = (data: { name: string; color: string }) => {
    createCategoryMutation.mutate(
      data as Parameters<typeof createCategoryMutation.mutate>[0],
      {
        onSuccess: () => setCategoryModalOpen(false),
      }
    );
  };

  // Loading state
  if (authLoading || budgetLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader size="lg" />
      </div>
    );
  }

  // Error state
  if (budgetError) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
        <ErrorState
          title="Failed to load budget"
          message="We couldn't load your budget data. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const isDataLoading = expensesLoading || incomeLoading;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-3xl lg:max-w-5xl xl:max-w-6xl items-center justify-between px-4">
          {/* Left: Back button */}
          <Link
            href="/"
            className="p-2 -ml-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          {/* Center: Month picker */}
          <MonthPicker
            year={year}
            month={month}
            onMonthChange={handleMonthChange}
          />

          {/* Right: Spacer for balance */}
          <div className="w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl lg:max-w-5xl xl:max-w-6xl px-4 py-6 space-y-6">
        {/* Hero Budget Section */}
        <BudgetHero
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          plannedBudget={budget?.plannedBudget || 0}
          currency={budget?.currency || 'ISK'}
          onUpdateBudget={handleUpdateBudget}
          isUpdating={updateBudgetMutation.isPending}
        />

        {/* Quick Actions */}
        <QuickActions
          onAddExpense={handleAddExpense}
          onAddIncome={handleAddIncome}
        />

        {/* Transaction List */}
        {isDataLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <TransactionList
            expenses={expenses}
            income={income}
            categories={categories}
            currency={budget?.currency || 'ISK'}
            onEditExpense={handleEditExpense}
            onEditIncome={handleEditIncome}
            onDeleteExpense={handleDeleteExpense}
            onDeleteIncome={handleDeleteIncome}
            isDeletingExpense={deleteExpenseMutation.isPending}
            isDeletingIncome={deleteIncomeMutation.isPending}
          />
        )}
      </main>

      {/* Modals */}
      <ExpenseFormModal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={handleExpenseSubmit}
        onOpenCategoryForm={() => {
          setExpenseModalOpen(false);
          setCategoryModalOpen(true);
        }}
        expense={editingExpense}
        categories={categories}
        isSubmitting={
          createExpenseMutation.isPending || updateExpenseMutation.isPending
        }
      />

      <IncomeFormModal
        open={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onSubmit={handleIncomeSubmit}
        income={editingIncome}
        isSubmitting={
          createIncomeMutation.isPending || updateIncomeMutation.isPending
        }
      />

      <CategoryFormModal
        open={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setExpenseModalOpen(true);
        }}
        onSubmit={handleCategorySubmit}
        isSubmitting={createCategoryMutation.isPending}
      />
    </div>
  );
}
