import { apiClient } from '@/lib/axios';
import type {
  AssetDetailResponse,
  CreateAssetRequest,
  CreateAssetResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
  CreateValuationRequest,
  CreateValuationResponse,
  DeleteAssetResponse,
  DeleteTransactionResponse,
  GetAssetsResponse,
  GetTransactionsResponse,
  GetValuationsResponse,
  PortfolioSummary,
  UpdateAssetRequest,
  UpdateAssetResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
} from './types';

// ============ Asset Requests ============

export async function getAssets(
  householdId: number
): Promise<GetAssetsResponse> {
  const response = await apiClient.get<GetAssetsResponse>(
    `/investments/household/${householdId}`
  );
  return response.data;
}

export async function getAsset(assetId: number): Promise<AssetDetailResponse> {
  const response = await apiClient.get<AssetDetailResponse>(
    `/investments/${assetId}`
  );
  return response.data;
}

export async function createAsset(
  householdId: number,
  memberId: number,
  data: CreateAssetRequest
): Promise<CreateAssetResponse> {
  const response = await apiClient.post<CreateAssetResponse>(
    `/investments/household/${householdId}/member/${memberId}`,
    data
  );
  return response.data;
}

export async function updateAsset(
  assetId: number,
  data: UpdateAssetRequest
): Promise<UpdateAssetResponse> {
  const response = await apiClient.patch<UpdateAssetResponse>(
    `/investments/${assetId}`,
    data
  );
  return response.data;
}

export async function deleteAsset(
  assetId: number
): Promise<DeleteAssetResponse> {
  const response = await apiClient.delete<DeleteAssetResponse>(
    `/investments/${assetId}`
  );
  return response.data;
}

export async function getPortfolioSummary(
  householdId: number
): Promise<PortfolioSummary> {
  const response = await apiClient.get<PortfolioSummary>(
    `/investments/household/${householdId}/portfolio`
  );
  return response.data;
}

// ============ Transaction Requests ============

export async function getTransactions(
  assetId: number
): Promise<GetTransactionsResponse> {
  const response = await apiClient.get<GetTransactionsResponse>(
    `/investments/${assetId}/transactions`
  );
  return response.data;
}

export async function createTransaction(
  assetId: number,
  data: CreateTransactionRequest
): Promise<CreateTransactionResponse> {
  const response = await apiClient.post<CreateTransactionResponse>(
    `/investments/${assetId}/transactions`,
    data
  );
  return response.data;
}

export async function updateTransaction(
  transactionId: number,
  data: UpdateTransactionRequest
): Promise<UpdateTransactionResponse> {
  const response = await apiClient.patch<UpdateTransactionResponse>(
    `/investments/transactions/${transactionId}`,
    data
  );
  return response.data;
}

export async function deleteTransaction(
  transactionId: number
): Promise<DeleteTransactionResponse> {
  const response = await apiClient.delete<DeleteTransactionResponse>(
    `/investments/transactions/${transactionId}`
  );
  return response.data;
}

// ============ Valuation Requests ============

export async function getValuations(
  assetId: number
): Promise<GetValuationsResponse> {
  const response = await apiClient.get<GetValuationsResponse>(
    `/investments/${assetId}/valuations`
  );
  return response.data;
}

export async function createValuation(
  assetId: number,
  data: CreateValuationRequest
): Promise<CreateValuationResponse> {
  const response = await apiClient.post<CreateValuationResponse>(
    `/investments/${assetId}/valuations`,
    data
  );
  return response.data;
}
