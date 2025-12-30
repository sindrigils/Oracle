'use client';

import type { PortfolioSummary } from '@/api/investments/types';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface PortfolioHeroProps {
  portfolio: PortfolioSummary;
  currency?: string;
}

type PortfolioStatus = 'gain' | 'loss' | 'neutral';

function getPortfolioStatus(growth: number): PortfolioStatus {
  if (growth > 0) return 'gain';
  if (growth < 0) return 'loss';
  return 'neutral';
}

const statusConfig = {
  gain: {
    background:
      'bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 dark:from-emerald-950/20 dark:via-zinc-900 dark:to-teal-950/20',
    border: 'border-emerald-200/50 dark:border-emerald-800/30',
    badge:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: TrendingUp,
    label: 'Portfolio Up',
  },
  loss: {
    background:
      'bg-gradient-to-br from-red-50 via-white to-rose-50/50 dark:from-red-950/20 dark:via-zinc-900 dark:to-rose-950/20',
    border: 'border-red-200/50 dark:border-red-800/30',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: TrendingDown,
    label: 'Portfolio Down',
  },
  neutral: {
    background:
      'bg-gradient-to-br from-zinc-50 via-white to-zinc-50/50 dark:from-zinc-950/20 dark:via-zinc-900 dark:to-zinc-950/20',
    border: 'border-zinc-200/50 dark:border-zinc-800/30',
    badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    icon: Wallet,
    label: 'No Change',
  },
};

export function PortfolioHero({ portfolio, currency = 'USD' }: PortfolioHeroProps) {
  const status = getPortfolioStatus(portfolio.totalGrowth);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatCurrency = (amount: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(2)}%`;
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

      {/* Hero Amount - Current Value */}
      <div className="text-center mb-6">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
          Current Portfolio Value
        </p>
        <p className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight tabular-nums text-zinc-900 dark:text-white">
          {formatCurrency(portfolio.currentValue)}
        </p>
        {/* Growth indicator */}
        <p
          className={cn(
            'text-lg font-semibold mt-2',
            status === 'gain' && 'text-emerald-600 dark:text-emerald-400',
            status === 'loss' && 'text-red-600 dark:text-red-400',
            status === 'neutral' && 'text-zinc-500 dark:text-zinc-400'
          )}
        >
          {formatCurrency(portfolio.totalGrowth)} ({formatPercentage(portfolio.growthPercentage)})
        </p>
      </div>

      {/* Condensed Stats Row */}
      <div className="flex items-center justify-center gap-6 sm:gap-10">
        {/* Total Invested */}
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Invested</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tabular-nums">
              {formatCurrency(portfolio.totalInvested)}
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />

        {/* Active Assets */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Active</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tabular-nums">
              {portfolio.activeAssets} assets
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />

        {/* Total Growth */}
        <div className="flex items-center gap-2">
          {status === 'gain' ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : status === 'loss' ? (
            <TrendingDown className="h-4 w-4 text-red-500" />
          ) : (
            <Wallet className="h-4 w-4 text-zinc-400" />
          )}
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Growth</p>
            <p
              className={cn(
                'text-base sm:text-lg font-semibold tabular-nums',
                status === 'gain' && 'text-emerald-600 dark:text-emerald-400',
                status === 'loss' && 'text-red-600 dark:text-red-400',
                status === 'neutral' && 'text-zinc-900 dark:text-white'
              )}
            >
              {formatPercentage(portfolio.growthPercentage)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
