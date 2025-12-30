'use client';

import { useAuth } from '@/api/auth/context';
import {
  useAsset,
  useCreateTransaction,
  useCreateValuation,
  useDeleteTransaction,
  useTransactions,
  useValuations,
} from '@/api/investments/hooks';
import type { CreateTransactionRequest, CreateValuationRequest } from '@/api/investments/types';
import { Badge, EmptyState, ErrorState, Loader } from '@/core/components';
import { cn } from '@/lib/utils';
import { ArrowLeft, Calendar, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { AssetHero } from './_components/asset-hero';
import { TransactionFormModal } from './_components/transaction-form-modal';
import { TransactionList } from './_components/transaction-list';
import { ValuationFormModal } from './_components/valuation-form-modal';

export default function InvestmentDetailPage() {
  const params = useParams();
  const assetId = params.id ? Number(params.id) : undefined;

  const { household, isLoading: authLoading } = useAuth();
  const householdId = household?.id;

  // Modal states
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [valuationModalOpen, setValuationModalOpen] = useState(false);

  // Data queries
  const {
    data: assetData,
    isLoading: assetLoading,
    error: assetError,
  } = useAsset(assetId);

  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(assetId);
  const { data: valuationsData, isLoading: valuationsLoading } = useValuations(assetId);

  // Mutations
  const createTransactionMutation = useCreateTransaction(assetId || 0, householdId || 0);
  const deleteTransactionMutation = useDeleteTransaction(assetId || 0, householdId || 0);
  const createValuationMutation = useCreateValuation(assetId || 0, householdId || 0);

  // Handlers
  const handleAddTransaction = () => {
    setTransactionModalOpen(true);
  };

  const handleUpdateValue = () => {
    setValuationModalOpen(true);
  };

  const handleTransactionSubmit = (data: CreateTransactionRequest) => {
    createTransactionMutation.mutate(data, {
      onSuccess: () => setTransactionModalOpen(false),
    });
  };

  const handleValuationSubmit = (data: CreateValuationRequest) => {
    createValuationMutation.mutate(data, {
      onSuccess: () => setValuationModalOpen(false),
    });
  };

  const handleDeleteTransaction = (transactionId: number) => {
    deleteTransactionMutation.mutate(transactionId);
  };

  // Loading state
  if (authLoading || assetLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader size="lg" />
      </div>
    );
  }

  // Error state
  if (assetError) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
        <ErrorState
          title="Failed to load investment"
          message="We couldn't load this investment. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Asset not found
  if (!assetData?.asset) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
        <EmptyState
          title="Investment not found"
          description="This investment doesn't exist or you don't have access to it."
          action={{
            label: 'Back to Investments',
            onClick: () => window.location.href = '/investments',
          }}
        />
      </div>
    );
  }

  const asset = assetData.asset;
  const transactions = transactionsData?.transactions || [];
  const valuations = valuationsData?.valuations || [];
  const isDataLoading = transactionsLoading || valuationsLoading;

  // Sort valuations by date (newest first)
  const sortedValuations = [...valuations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-3xl lg:max-w-5xl xl:max-w-6xl items-center justify-between px-4">
          {/* Left: Back button */}
          <Link
            href="/investments"
            className="p-2 -ml-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          {/* Center: Title */}
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
            {asset.name}
          </h1>

          {/* Right: Spacer */}
          <div className="w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl lg:max-w-5xl xl:max-w-6xl px-4 py-6 space-y-6">
        {/* Asset Hero */}
        <AssetHero asset={asset} currency={asset.currency} />

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddTransaction}
            className="flex-1 h-12 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
          <button
            onClick={handleUpdateValue}
            className="flex-1 h-12 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700"
          >
            <RefreshCw className="h-4 w-4" />
            Update Value
          </button>
        </div>

        {/* Content Sections */}
        {isDataLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Transactions Section */}
            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                Transactions
              </h2>
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                isDeleting={deleteTransactionMutation.isPending}
                currency={asset.currency}
              />
            </section>

            {/* Valuation History Section */}
            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                Valuation History
              </h2>
              {sortedValuations.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  No valuations recorded yet. Add a valuation to track your asset&apos;s value over time.
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedValuations.map((valuation, index) => (
                    <div
                      key={valuation.id}
                      className={cn(
                        'p-4 rounded-xl border transition-all',
                        'bg-white dark:bg-zinc-900',
                        'border-zinc-200 dark:border-zinc-800',
                        index === 0 && 'ring-2 ring-emerald-500/20 border-emerald-200 dark:border-emerald-800'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-zinc-900 dark:text-white tabular-nums">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: asset.currency,
                                  minimumFractionDigits: 2,
                                }).format(valuation.valuation)}
                              </span>
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                per unit
                              </span>
                              {index === 0 && (
                                <Badge color="green" size="sm">Latest</Badge>
                              )}
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              {new Date(valuation.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                              {valuation.source && ` • ${valuation.source}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Value</p>
                          <p className="font-semibold text-zinc-900 dark:text-white tabular-nums">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: asset.currency,
                            }).format(valuation.valuation * asset.currentQuantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Modals */}
      <TransactionFormModal
        open={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSubmit={handleTransactionSubmit}
        isSubmitting={createTransactionMutation.isPending}
        currentQuantity={asset.currentQuantity}
        currency={asset.currency}
      />

      <ValuationFormModal
        open={valuationModalOpen}
        onClose={() => setValuationModalOpen(false)}
        onSubmit={handleValuationSubmit}
        isSubmitting={createValuationMutation.isPending}
        currentQuantity={asset.currentQuantity}
        currency={asset.currency}
      />
    </div>
  );
}
