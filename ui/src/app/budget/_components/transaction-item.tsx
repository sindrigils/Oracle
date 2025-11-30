'use client';

import type { Expense, ExpenseCategory, Income } from '@/api/budget/types';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

export type Transaction =
  | { type: 'expense'; data: Expense; category?: ExpenseCategory }
  | { type: 'income'; data: Income };

interface TransactionItemProps {
  transaction: Transaction;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function TransactionItem({
  transaction,
  currency,
  onEdit,
  onDelete,
  isDeleting,
}: TransactionItemProps) {
  const isExpense = transaction.type === 'expense';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'ISK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getTitle = () => {
    if (isExpense) {
      return (transaction.data as Expense).description;
    }
    return (transaction.data as Income).source;
  };

  const getSubtitle = () => {
    if (isExpense) {
      const expense = transaction.data as Expense;
      const category = transaction.category;
      const parts = [formatDate(expense.date)];
      if (category) {
        parts.push(category.name);
      }
      return parts.join(' · ');
    }
    return 'Income';
  };

  const getCategoryColor = () => {
    if (isExpense && transaction.category) {
      return transaction.category.colorCode || transaction.category.color;
    }
    return null;
  };

  const amount = transaction.data.amount;
  const categoryColor = getCategoryColor();

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-3 px-2 -mx-2 rounded-lg',
        'group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
      )}
    >
      {/* Left: Category dot + Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Category color dot */}
        <div
          className={cn('h-2.5 w-2.5 rounded-full flex-shrink-0', {
            'bg-emerald-500': !isExpense,
          })}
          style={
            categoryColor
              ? { backgroundColor: categoryColor }
              : isExpense
                ? { backgroundColor: '#ef4444' }
                : undefined
          }
        />

        {/* Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
            {getTitle()}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* Right: Amount + Actions */}
      <div className="flex items-center gap-3">
        <span
          className={cn('text-sm font-semibold tabular-nums whitespace-nowrap', {
            'text-zinc-900 dark:text-white': isExpense,
            'text-emerald-600 dark:text-emerald-400': !isExpense,
          })}
        >
          {isExpense ? '-' : '+'}
          {formatCurrency(amount)}
        </span>

        {/* Hover-reveal actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
