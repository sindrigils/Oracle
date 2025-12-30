'use client';

import type { InvestmentTransaction } from '@/api/investments/types';
import { Badge } from '@/core/components';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Banknote, Percent, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: InvestmentTransaction[];
  onDelete: (transactionId: number) => void;
  isDeleting?: boolean;
  currency?: string;
}

const transactionTypeConfig: Record<
  string,
  {
    label: string;
    color: 'green' | 'red' | 'blue' | 'purple';
    icon: typeof ArrowUpRight;
  }
> = {
  buy: { label: 'Buy', color: 'green', icon: ArrowDownRight },
  sell: { label: 'Sell', color: 'red', icon: ArrowUpRight },
  dividend: { label: 'Dividend', color: 'blue', icon: Banknote },
  interest: { label: 'Interest', color: 'purple', icon: Percent },
};

export function TransactionList({
  transactions,
  onDelete,
  isDeleting,
  currency = 'USD',
}: TransactionListProps) {
  const formatCurrency = (amount: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No transactions recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedTransactions.map((transaction) => {
        const config = transactionTypeConfig[transaction.transactionType] || {
          label: transaction.transactionType,
          color: 'gray' as const,
          icon: ArrowUpRight,
        };
        const Icon = config.icon;
        const totalAmount = transaction.quantity * transaction.pricePerUnit;
        const totalWithFees = transaction.fees
          ? totalAmount + (transaction.transactionType === 'sell' ? -transaction.fees : transaction.fees)
          : totalAmount;

        return (
          <div
            key={transaction.id}
            className={cn(
              'group p-4 rounded-xl border transition-all',
              'bg-white dark:bg-zinc-900',
              'border-zinc-200 dark:border-zinc-800',
              'hover:border-zinc-300 dark:hover:border-zinc-700'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Transaction Info */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Icon */}
                <div
                  className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    config.color === 'green' && 'bg-emerald-100 dark:bg-emerald-900/30',
                    config.color === 'red' && 'bg-red-100 dark:bg-red-900/30',
                    config.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30',
                    config.color === 'purple' && 'bg-purple-100 dark:bg-purple-900/30'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      config.color === 'green' && 'text-emerald-600 dark:text-emerald-400',
                      config.color === 'red' && 'text-red-600 dark:text-red-400',
                      config.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                      config.color === 'purple' && 'text-purple-600 dark:text-purple-400'
                    )}
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color={config.color} size="sm">
                      {config.label}
                    </Badge>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {transaction.quantity} units @ {formatCurrency(transaction.pricePerUnit)}
                  </p>
                  {transaction.fees !== null && transaction.fees > 0 && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Fees: {formatCurrency(transaction.fees)}
                    </p>
                  )}
                  {transaction.note && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                      {transaction.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Total & Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p
                    className={cn(
                      'font-semibold tabular-nums',
                      transaction.transactionType === 'sell'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-900 dark:text-white'
                    )}
                  >
                    {transaction.transactionType === 'sell' ? '+' : '-'}
                    {formatCurrency(totalWithFees)}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(transaction.id)}
                  disabled={isDeleting}
                  className={cn(
                    'p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100',
                    'text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
                    isDeleting && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
