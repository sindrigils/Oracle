'use client';

import type { Expense, ExpenseCategory } from '@/api/budget/types';
import { EmptyState } from '@/core/components';
import { ChevronDown, ChevronUp, FolderOpen } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TransactionItem } from './transaction-item';

interface CategoryBreakdownProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  currency: string;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: number) => void;
  isDeletingExpense: boolean;
}

interface CategorySpending {
  category: ExpenseCategory;
  total: number;
  expenses: Expense[];
}

export function CategoryBreakdown({
  expenses,
  categories,
  currency,
  onEditExpense,
  onDeleteExpense,
  isDeletingExpense,
}: CategoryBreakdownProps) {
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'ISK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate spending by category, sorted by total (highest first)
  const categorySpending = useMemo(() => {
    const spending = new Map<number, CategorySpending>();

    expenses.forEach((expense) => {
      const category = categories.find((c) => c.id === expense.categoryId);
      if (category) {
        const existing = spending.get(expense.categoryId);
        if (existing) {
          existing.total += expense.amount;
          existing.expenses.push(expense);
        } else {
          spending.set(expense.categoryId, {
            category,
            total: expense.amount,
            expenses: [expense],
          });
        }
      }
    });

    // Sort expenses within each category by date (newest first)
    spending.forEach((item) => {
      item.expenses.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    // Sort categories by total spending descending
    return Array.from(spending.values()).sort((a, b) => b.total - a.total);
  }, [expenses, categories]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  const toggleExpand = (categoryId: number) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  if (categorySpending.length === 0) {
    return (
      <div className="py-12 px-4">
        <EmptyState
          icon={<FolderOpen className="h-8 w-8 text-zinc-400" />}
          title="No expenses yet"
          description="Add expenses to see spending by category."
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {categorySpending.map(
        ({ category, total, expenses: categoryExpenses }) => {
          const isExpanded = expandedCategoryId === category.id;
          const percentage =
            totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
          const categoryColor = category.colorCode || category.color;

          return (
            <div key={category.id} className="py-4 first:pt-2 last:pb-2">
              {/* Category Header - Clickable */}
              <button
                onClick={() => toggleExpand(category.id)}
                className="w-full text-left"
              >
                {/* Top row: Name and Amount */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: categoryColor }}
                    />
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <span className="font-semibold tabular-nums text-zinc-900 dark:text-white">
                    {formatCurrency(total)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: categoryColor,
                    }}
                  />
                </div>

                {/* Bottom row: Percentage and expand hint */}
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{Math.round(percentage)}% of expenses</span>
                  <span className="flex items-center gap-1">
                    {categoryExpenses.length}{' '}
                    {categoryExpenses.length === 1 ? 'item' : 'items'}
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </span>
                </div>
              </button>

              {/* Expanded: Show expenses in this category */}
              {isExpanded && (
                <div className="mt-3 ml-6 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4">
                  {categoryExpenses.map((expense) => (
                    <TransactionItem
                      key={expense.id}
                      transaction={{
                        type: 'expense',
                        data: expense,
                        category: category,
                      }}
                      currency={currency}
                      onEdit={() => onEditExpense(expense)}
                      onDelete={() => {
                        if (
                          confirm(
                            'Are you sure you want to delete this expense?'
                          )
                        ) {
                          onDeleteExpense(expense.id);
                        }
                      }}
                      isDeleting={isDeletingExpense}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}
