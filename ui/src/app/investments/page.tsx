'use client';

import { useAuth } from '@/api/auth/context';
import {
  useAssets,
  useCreateAsset,
  usePortfolioSummary,
} from '@/api/investments/hooks';
import type { CreateAssetRequest } from '@/api/investments/types';
import { useMembers } from '@/api/members/hooks';
import { EmptyState, ErrorState, Loader } from '@/core/components';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { AssetFormModal } from './_components/asset-form-modal';
import { AssetList } from './_components/asset-list';
import { PortfolioHero } from './_components/portfolio-hero';

export default function InvestmentsPage() {
  const { household, isLoading: authLoading } = useAuth();
  const householdId = household?.id;

  // Modal states
  const [assetModalOpen, setAssetModalOpen] = useState(false);

  // Data queries
  const {
    data: portfolioData,
    isLoading: portfolioLoading,
    error: portfolioError,
  } = usePortfolioSummary(householdId);

  const {
    data: assetsData,
    isLoading: assetsLoading,
  } = useAssets(householdId);

  const { data: membersData } = useMembers(householdId || 0);

  // Get default member (primary or first)
  const defaultMember = useMemo(() => {
    if (!membersData?.members?.length) return null;
    return (
      membersData.members.find((m) => m.isPrimary) || membersData.members[0]
    );
  }, [membersData]);

  // Mutations
  const createAssetMutation = useCreateAsset(householdId || 0);

  // Computed values
  const assets = useMemo(
    () => assetsData?.assets || [],
    [assetsData?.assets]
  );

  // Handlers
  const handleAddInvestment = () => {
    setAssetModalOpen(true);
  };

  const handleAssetSubmit = (data: CreateAssetRequest) => {
    if (!defaultMember) return;

    createAssetMutation.mutate(
      { memberId: defaultMember.id, data },
      { onSuccess: () => setAssetModalOpen(false) }
    );
  };

  // Loading state
  if (authLoading || portfolioLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader size="lg" />
      </div>
    );
  }

  // Error state
  if (portfolioError) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
        <ErrorState
          title="Failed to load investments"
          message="We couldn't load your investment data. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const isDataLoading = assetsLoading;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-3xl lg:max-w-5xl xl:max-w-6xl items-center justify-between px-4">
          {/* Left: Back button */}
          <Link
            href="/"
            className="p-2 -ml-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          {/* Center: Title */}
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Investments
          </h1>

          {/* Right: Spacer for balance */}
          <div className="w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl lg:max-w-5xl xl:max-w-6xl px-4 py-6 space-y-6">
        {/* Portfolio Hero Section */}
        {portfolioData && portfolioData.totalAssets > 0 && (
          <PortfolioHero portfolio={portfolioData} currency="USD" />
        )}

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddInvestment}
            className="flex-1 h-12 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            <Plus className="h-4 w-4" />
            Add Investment
          </button>
        </div>

        {/* Asset List */}
        {isDataLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : assets.length > 0 ? (
          <AssetList assets={assets} currency="USD" />
        ) : (
          <EmptyState
            icon={<TrendingUp className="h-8 w-8 text-emerald-600" />}
            title="No investments yet"
            description="Start tracking your investment portfolio by adding your first asset."
            action={{
              label: 'Add Investment',
              onClick: handleAddInvestment,
            }}
          />
        )}
      </main>

      {/* Modals */}
      <AssetFormModal
        open={assetModalOpen}
        onClose={() => setAssetModalOpen(false)}
        onSubmit={handleAssetSubmit}
        isSubmitting={createAssetMutation.isPending}
      />
    </div>
  );
}
