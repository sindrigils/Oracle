'use client';

import { Plus } from 'lucide-react';

interface QuickActionsProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
}

export function QuickActions({ onAddExpense, onAddIncome }: QuickActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onAddExpense}
        className="flex-1 h-12 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
      >
        <Plus className="h-4 w-4" />
        Add Expense
      </button>
      <button
        onClick={onAddIncome}
        className="flex-1 h-12 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        <Plus className="h-4 w-4" />
        Add Income
      </button>
    </div>
  );
}
