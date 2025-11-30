'use client';

import { Button, Input } from '@/core/components';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Pencil,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface BudgetHeroProps {
  totalExpenses: number;
  totalIncome: number;
  plannedBudget: number;
  currency: string;
  onUpdateBudget: (amount: number) => void;
  isUpdating: boolean;
}

type BudgetStatus = 'healthy' | 'warning' | 'danger';

function getBudgetStatus(spentPercentage: number): BudgetStatus {
  if (spentPercentage >= 100) return 'danger';
  if (spentPercentage >= 80) return 'warning';
  return 'healthy';
}

const statusConfig = {
  healthy: {
    background:
      'bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 dark:from-emerald-950/20 dark:via-zinc-900 dark:to-teal-950/20',
    border: 'border-emerald-200/50 dark:border-emerald-800/30',
    progressBar:
      'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500',
    badge:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: CheckCircle2,
    label: 'On Track',
  },
  warning: {
    background:
      'bg-gradient-to-br from-amber-50 via-white to-orange-50/50 dark:from-amber-950/20 dark:via-zinc-900 dark:to-orange-950/20',
    border: 'border-amber-200/50 dark:border-amber-800/30',
    progressBar: 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500',
    badge:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: AlertTriangle,
    label: 'Approaching Limit',
  },
  danger: {
    background:
      'bg-gradient-to-br from-red-50 via-white to-rose-50/50 dark:from-red-950/20 dark:via-zinc-900 dark:to-rose-950/20',
    border: 'border-red-200/50 dark:border-red-800/30',
    progressBar: 'bg-gradient-to-r from-red-400 via-rose-500 to-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
    label: 'Over Budget',
  },
};

export function BudgetHero({
  totalExpenses,
  totalIncome,
  plannedBudget,
  currency,
  onUpdateBudget,
  isUpdating,
}: BudgetHeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(plannedBudget.toString());

  const remaining = plannedBudget - totalExpenses;
  const spentPercentage =
    plannedBudget > 0 ? (totalExpenses / plannedBudget) * 100 : 0;
  const status = getBudgetStatus(spentPercentage);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatCurrency = (amount: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'ISK',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const handleStartEdit = () => {
    setEditValue(plannedBudget.toString());
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(plannedBudget.toString());
  };

  const handleSaveEdit = () => {
    const newAmount = parseFloat(editValue);
    if (!isNaN(newAmount) && newAmount >= 0) {
      onUpdateBudget(newAmount);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6 sm:p-8 lg:p-10',
        config.background,
        config.border
      )}
    >
      {/* Status Badge */}
      <div className="flex justify-center mb-6">
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
            config.badge
          )}
        >
          <StatusIcon className="h-4 w-4" />
          {config.label}
        </div>
      </div>

      {/* Hero Amount */}
      <div className="text-center mb-6">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
          {remaining >= 0 ? 'Remaining Budget' : 'Over Budget'}
        </p>
        <p
          className={cn(
            'text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight tabular-nums',
            remaining >= 0
              ? 'text-zinc-900 dark:text-white'
              : 'text-red-600 dark:text-red-400'
          )}
        >
          {formatCurrency(Math.abs(remaining))}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-3 w-full rounded-full bg-zinc-200/70 dark:bg-zinc-800 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              config.progressBar
            )}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{Math.round(spentPercentage)}% spent</span>
          <span>
            {formatCurrency(totalExpenses)} / {formatCurrency(plannedBudget)}
          </span>
        </div>
      </div>

      {/* Condensed Stats Row */}
      <div className="flex items-center justify-center gap-6 sm:gap-10">
        {/* Income Stat */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Income</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tabular-nums">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />

        {/* Expenses Stat */}
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Expenses</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tabular-nums">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />

        {/* Budget Stat (Editable) */}
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Budget</p>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  inputSize="sm"
                  autoFocus
                  min={0}
                  step={100}
                  className="w-24 h-7 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="h-6 w-6"
                >
                  <Check className="h-3 w-3 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            ) : (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1 group"
              >
                <span className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tabular-nums">
                  {formatCurrency(plannedBudget)}
                </span>
                <Pencil className="h-3 w-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
