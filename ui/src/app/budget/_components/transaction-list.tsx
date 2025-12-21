'use client';

import type { Expense, ExpenseCategory, Income } from '@/api/budget/types';
import { EmptyState } from '@/core/components';
import { cn } from '@/lib/utils';
import { FolderOpen, List, Receipt } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { CategoryBreakdown } from './category-breakdown';
import { Transaction, TransactionItem } from './transaction-item';

type FilterTab = 'all' | 'expenses' | 'income';
type ViewMode = 'list' | 'categories';

interface TransactionListProps {
  expenses: Expense[];
  income: Income[];
  categories: ExpenseCategory[];
  currency: string;
  onEditExpense: (expense: Expense) => void;
  onEditIncome: (income: Income) => void;
  onDeleteExpense: (expenseId: number) => void;
  onDeleteIncome: (incomeId: number) => void;
  isDeletingExpense: boolean;
  isDeletingIncome: boolean;
}

export function TransactionList({
  expenses,
  income,
  categories,
  currency,
  onEditExpense,
  onEditIncome,
  onDeleteExpense,
  onDeleteIncome,
  isDeletingExpense,
  isDeletingIncome,
}: TransactionListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const getCategoryById = useCallback(
    (categoryId: number) => {
      return categories.find((cat) => cat.id === categoryId);
    },
    [categories]
  );

  // Create unified transaction list
  const transactions = useMemo(() => {
    const allTransactions: (Transaction & { sortDate: Date })[] = [];

    // Add expenses
    expenses.forEach((expense) => {
      allTransactions.push({
        type: 'expense',
        data: expense,
        category: getCategoryById(expense.categoryId),
        sortDate: new Date(expense.date),
      });
    });

    // Add income (use current date for sorting since income doesn't have date)
    income.forEach((inc) => {
      allTransactions.push({
        type: 'income',
        data: inc,
        sortDate: inc.createdAt ? new Date(inc.createdAt) : new Date(),
      });
    });

    // Sort by date, newest first
    return allTransactions.sort(
      (a, b) => b.sortDate.getTime() - a.sortDate.getTime()
    );
  }, [expenses, income, getCategoryById]);

  // Filter transactions based on active tab
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'expenses')
      return transactions.filter((t) => t.type === 'expense');
    return transactions.filter((t) => t.type === 'income');
  }, [transactions, activeTab]);

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: transactions.length },
    {
      key: 'expenses',
      label: 'Expenses',
      count: transactions.filter((t) => t.type === 'expense').length,
    },
    {
      key: 'income',
      label: 'Income',
      count: transactions.filter((t) => t.type === 'income').length,
    },
  ];

  const getEmptyMessage = () => {
    if (activeTab === 'expenses') {
      return {
        title: 'No expenses yet',
        description: 'Add your first expense to start tracking your spending.',
      };
    }
    if (activeTab === 'income') {
      return {
        title: 'No income yet',
        description: 'Add your income sources to track your earnings.',
      };
    }
    return {
      title: 'No transactions yet',
      description: 'Add expenses or income to start tracking your budget.',
    };
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-sm font-medium text-zinc-900 dark:text-white">
          Transactions
        </span>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('categories')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              viewMode === 'categories'
                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            )}
            aria-label="Category view"
          >
            <FolderOpen className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'categories' ? (
        // Category Breakdown View
        <div className="max-h-[400px] overflow-y-auto p-3">
          <CategoryBreakdown
            expenses={expenses}
            categories={categories}
            currency={currency}
            onEditExpense={onEditExpense}
            onDeleteExpense={onDeleteExpense}
            isDeletingExpense={isDeletingExpense}
          />
        </div>
      ) : (
        // List View with Tabs
        <>
          {/* Tab Header */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
                  activeTab === tab.key
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'ml-1.5 text-xs tabular-nums',
                    activeTab === tab.key
                      ? 'text-zinc-600 dark:text-zinc-300'
                      : 'text-zinc-400 dark:text-zinc-500'
                  )}
                >
                  {tab.count}
                </span>
                {/* Active indicator */}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white" />
                )}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="max-h-[400px] overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 px-4">
                <EmptyState
                  icon={<Receipt className="h-8 w-8 text-zinc-400" />}
                  title={getEmptyMessage().title}
                  description={getEmptyMessage().description}
                />
              </div>
            ) : (
              <div className="p-3 divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredTransactions.map((transaction) => {
                  const key =
                    transaction.type === 'expense'
                      ? `expense-${transaction.data.id}`
                      : `income-${transaction.data.id}`;

                  return (
                    <TransactionItem
                      key={key}
                      transaction={transaction}
                      currency={currency}
                      onEdit={() => {
                        if (transaction.type === 'expense') {
                          onEditExpense(transaction.data as Expense);
                        } else {
                          onEditIncome(transaction.data as Income);
                        }
                      }}
                      onDelete={() => {
                        if (transaction.type === 'expense') {
                          if (
                            confirm(
                              'Are you sure you want to delete this expense?'
                            )
                          ) {
                            onDeleteExpense(transaction.data.id);
                          }
                        } else {
                          if (
                            confirm(
                              'Are you sure you want to delete this income?'
                            )
                          ) {
                            onDeleteIncome(transaction.data.id);
                          }
                        }
                      }}
                      isDeleting={
                        transaction.type === 'expense'
                          ? isDeletingExpense
                          : isDeletingIncome
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
