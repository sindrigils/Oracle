'use client';

import type { AssetWithMetrics } from '@/api/investments/types';
import { Badge } from '@/core/components';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface AssetCardProps {
  asset: AssetWithMetrics;
  currency?: string;
}

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

export function AssetCard({ asset, currency = 'USD' }: AssetCardProps) {
  const hasGrowth = asset.growth !== null && asset.growthPercentage !== null;
  const isPositive = hasGrowth && asset.growth! > 0;
  const isNegative = hasGrowth && asset.growth! < 0;

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

  const typeLabel = assetTypeLabels[asset.assetType] || asset.assetType;
  const typeColor = assetTypeColors[asset.assetType] || 'gray';

  return (
    <Link href={`/investments/${asset.id}`}>
      <div
        className={cn(
          'group p-4 rounded-xl border transition-all cursor-pointer',
          'bg-white dark:bg-zinc-900',
          'border-zinc-200 dark:border-zinc-800',
          'hover:border-zinc-300 dark:hover:border-zinc-700',
          'hover:shadow-sm',
          asset.isFullySold && 'opacity-60'
        )}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Asset Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                {asset.name}
              </h3>
              {asset.symbol && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                  {asset.symbol}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge color={typeColor} size="sm">
                {typeLabel}
              </Badge>
              {asset.isFullySold && (
                <Badge color="gray" size="sm">
                  Sold
                </Badge>
              )}
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {asset.currentQuantity} units
              </span>
            </div>
          </div>

          {/* Right: Value & Growth */}
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-zinc-900 dark:text-white tabular-nums">
              {formatCurrency(asset.currentValue)}
            </p>
            {hasGrowth && (
              <div
                className={cn(
                  'flex items-center justify-end gap-1 text-sm font-medium',
                  isPositive && 'text-emerald-600 dark:text-emerald-400',
                  isNegative && 'text-red-600 dark:text-red-400',
                  !isPositive && !isNegative && 'text-zinc-500 dark:text-zinc-400'
                )}
              >
                {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                <span>{formatPercentage(asset.growthPercentage)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
