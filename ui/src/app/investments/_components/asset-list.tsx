'use client';

import type { AssetWithMetrics } from '@/api/investments/types';
import { cn } from '@/lib/utils';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AssetCard } from './asset-card';

interface AssetListProps {
  assets: AssetWithMetrics[];
  currency?: string;
}

const assetTypeLabels: Record<string, string> = {
  stocks: 'Stocks',
  bonds: 'Bonds',
  crypto: 'Crypto',
  etf: 'ETFs',
  real_estate: 'Real Estate',
  custom: 'Custom',
};

const assetTypeOrder = ['stocks', 'etf', 'crypto', 'bonds', 'real_estate', 'custom'];

export function AssetList({ assets, currency = 'USD' }: AssetListProps) {
  const [showSold, setShowSold] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Filter and group assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => showSold || !asset.isFullySold);
  }, [assets, showSold]);

  const groupedAssets = useMemo(() => {
    const groups: Record<string, AssetWithMetrics[]> = {};

    for (const asset of filteredAssets) {
      const type = asset.assetType;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(asset);
    }

    // Sort groups by predefined order
    const sortedGroups: Array<{ type: string; assets: AssetWithMetrics[] }> = [];
    for (const type of assetTypeOrder) {
      if (groups[type]) {
        sortedGroups.push({ type, assets: groups[type] });
      }
    }

    // Add any custom types that aren't in the predefined order
    for (const type of Object.keys(groups)) {
      if (!assetTypeOrder.includes(type)) {
        sortedGroups.push({ type, assets: groups[type] });
      }
    }

    return sortedGroups;
  }, [filteredAssets]);

  const soldCount = useMemo(() => {
    return assets.filter((a) => a.isFullySold).length;
  }, [assets]);

  const toggleSection = (type: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  if (assets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Filter toggle */}
      {soldCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowSold(!showSold)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              showSold
                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
            )}
          >
            {showSold ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide sold ({soldCount})
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show sold ({soldCount})
              </>
            )}
          </button>
        </div>
      )}

      {/* Asset groups */}
      {groupedAssets.map(({ type, assets: groupAssets }) => {
        const isCollapsed = collapsedSections.has(type);
        const label = assetTypeLabels[type] || type;

        return (
          <div key={type}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(type)}
              className="w-full flex items-center justify-between px-1 py-2 group"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  {label}
                </h3>
                <span className="text-sm text-zinc-400 dark:text-zinc-500">
                  ({groupAssets.length})
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform',
                  isCollapsed && '-rotate-90'
                )}
              />
            </button>

            {/* Asset cards */}
            {!isCollapsed && (
              <div className="space-y-2">
                {groupAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} currency={currency} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
