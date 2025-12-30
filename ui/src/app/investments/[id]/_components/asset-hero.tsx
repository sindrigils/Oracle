'use client';

import type { AssetWithMetrics } from '@/api/investments/types';
import { Badge } from '@/core/components';
import { cn } from '@/lib/utils';
import { Calendar, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface AssetHeroProps {
  asset: AssetWithMetrics;
  currency?: string;
}

type AssetStatus = 'gain' | 'loss' | 'neutral' | 'no_valuation';

function getAssetStatus(asset: AssetWithMetrics): AssetStatus {
  if (asset.growth === null) return 'no_valuation';
  if (asset.growth > 0) return 'gain';
  if (asset.growth < 0) return 'loss';
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
    label: 'Gaining',
  },
  loss: {
    background:
      'bg-gradient-to-br from-red-50 via-white to-rose-50/50 dark:from-red-950/20 dark:via-zinc-900 dark:to-rose-950/20',
    border: 'border-red-200/50 dark:border-red-800/30',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: TrendingDown,
    label: 'Losing',
  },
  neutral: {
    background:
      'bg-gradient-to-br from-zinc-50 via-white to-zinc-50/50 dark:from-zinc-950/20 dark:via-zinc-900 dark:to-zinc-950/20',
    border: 'border-zinc-200/50 dark:border-zinc-800/30',
    badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    icon: Wallet,
    label: 'No Change',
  },
  no_valuation: {
    background:
      'bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 dark:from-amber-950/20 dark:via-zinc-900 dark:to-yellow-950/20',
    border: 'border-amber-200/50 dark:border-amber-800/30',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Calendar,
    label: 'Needs Valuation',
  },
};

const assetTypeLabels: Record<string, string> = {
  stocks: 'Stock',
  bonds: 'Bond',
  crypto: 'Crypto',
  etf: 'ETF',
  real_estate: 'Real Estate',
  custom: 'Custom',
};

const assetTypeColors: Record<string, 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'gray'> = {
  stocks: 'blue',
  bonds: 'green',
  crypto: 'yellow',
  etf: 'purple',
  real_estate: 'orange',
  custom: 'gray',
};

export function AssetHero({ asset, currency = 'USD' }: AssetHeroProps) {
  const status = getAssetStatus(asset);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatCurrency = (amount: number | null, decimals = 0) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const formatPercentage = (value: number | null) => {
    if (value === null) return '-';
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(2)}%`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const typeLabel = assetTypeLabels[asset.assetType] || asset.customType || asset.assetType;
  const typeColor = assetTypeColors[asset.assetType] || 'gray';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6 sm:p-8',
        config.background,
        config.border
      )}
    >
      {/* Header Row: Name, Symbol, Type */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {asset.name}
            </h1>
            {asset.symbol && (
              <span className="text-lg text-zinc-500 dark:text-zinc-400">
                {asset.symbol}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge color={typeColor}>{typeLabel}</Badge>
            {asset.isFullySold && (
              <Badge color="gray">Sold</Badge>
            )}
          </div>
        </div>
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
          Current Value
        </p>
        <p className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight tabular-nums text-zinc-900 dark:text-white">
          {formatCurrency(asset.currentValue)}
        </p>
        {/* Growth indicator */}
        {asset.growth !== null && (
          <p
            className={cn(
              'text-lg font-semibold mt-2',
              status === 'gain' && 'text-emerald-600 dark:text-emerald-400',
              status === 'loss' && 'text-red-600 dark:text-red-400',
              status === 'neutral' && 'text-zinc-500 dark:text-zinc-400'
            )}
          >
            {formatCurrency(asset.growth)} ({formatPercentage(asset.growthPercentage)})
          </p>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
        {/* Quantity */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#</span>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Quantity</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tabular-nums">
              {asset.currentQuantity}
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />

        {/* Total Invested */}
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-purple-500" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Invested</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tabular-nums">
              {formatCurrency(asset.totalInvested)}
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />

        {/* Price per Unit */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Price/Unit</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tabular-nums">
              {asset.latestValuationPerUnit !== null
                ? formatCurrency(asset.latestValuationPerUnit, 2)
                : '-'}
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />

        {/* Last Valuation Date */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Last Valued</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">
              {formatDate(asset.latestValuationDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
