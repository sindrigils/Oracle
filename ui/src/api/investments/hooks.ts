import { queryKeys } from '@/lib/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAsset,
  createTransaction,
  createValuation,
  deleteAsset,
  deleteTransaction,
  getAsset,
  getAssets,
  getPortfolioSummary,
  getTransactions,
  getValuations,
  updateAsset,
  updateTransaction,
} from './requests';
import type {
  CreateAssetRequest,
  CreateTransactionRequest,
  CreateValuationRequest,
  UpdateAssetRequest,
  UpdateTransactionRequest,
} from './types';

// ============ Asset Hooks ============

export function useAssets(householdId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.investments.byHousehold(householdId!),
    queryFn: () => getAssets(householdId!),
    enabled: Boolean(householdId),
  });
}

export function useAsset(assetId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.investments.detail(assetId!),
    queryFn: () => getAsset(assetId!),
    enabled: Boolean(assetId),
  });
}

export function usePortfolioSummary(householdId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.investments.portfolio(householdId!),
    queryFn: () => getPortfolioSummary(householdId!),
    enabled: Boolean(householdId),
  });
}

export function useCreateAsset(householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number;
      data: CreateAssetRequest;
    }) => createAsset(householdId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.byHousehold(householdId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.portfolio(householdId),
      });
    },
  });
}

export function useUpdateAsset(householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assetId,
      data,
    }: {
      assetId: number;
      data: UpdateAssetRequest;
    }) => updateAsset(assetId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.byHousehold(householdId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.detail(variables.assetId),
      });
    },
  });
}

export function useDeleteAsset(householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assetId: number) => deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.byHousehold(householdId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.portfolio(householdId),
      });
    },
  });
}

// ============ Transaction Hooks ============

export function useTransactions(assetId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.investments.transactions(assetId!),
    queryFn: () => getTransactions(assetId!),
    enabled: Boolean(assetId),
  });
}

export function useCreateTransaction(assetId: number, householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      createTransaction(assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.transactions(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.detail(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.byHousehold(householdId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.portfolio(householdId),
      });
    },
  });
}

export function useUpdateTransaction(assetId: number, householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      data,
    }: {
      transactionId: number;
      data: UpdateTransactionRequest;
    }) => updateTransaction(transactionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.transactions(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.detail(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.byHousehold(householdId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.portfolio(householdId),
      });
    },
  });
}

export function useDeleteTransaction(assetId: number, householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: number) => deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.transactions(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.detail(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.byHousehold(householdId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.portfolio(householdId),
      });
    },
  });
}

// ============ Valuation Hooks ============

export function useValuations(assetId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.investments.valuations(assetId!),
    queryFn: () => getValuations(assetId!),
    enabled: Boolean(assetId),
  });
}

export function useCreateValuation(assetId: number, householdId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateValuationRequest) =>
      createValuation(assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.valuations(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.detail(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.byHousehold(householdId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.investments.portfolio(householdId),
      });
    },
  });
}
