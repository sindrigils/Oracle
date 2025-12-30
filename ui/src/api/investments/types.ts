// Enums
export type AssetType =
  | 'stocks'
  | 'bonds'
  | 'crypto'
  | 'etf'
  | 'real_estate'
  | 'custom';

export type TransactionType = 'buy' | 'sell' | 'dividend' | 'interest';

export type ValuationMode = 'market' | 'manual';

// Asset Types
export interface InvestmentAsset {
  id: number;
  shortId: string;
  name: string;
  symbol: string | null;
  assetType: string;
  customType: string | null;
  currency: string;
  quantity: number;
  valuationMode: string;
  householdId: number;
  memberId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetWithMetrics extends InvestmentAsset {
  currentQuantity: number;
  totalInvested: number;
  currentValue: number | null;
  growth: number | null;
  growthPercentage: number | null;
  latestValuationPerUnit: number | null;
  latestValuationDate: string | null;
  isFullySold: boolean;
}

export interface CreateAssetRequest {
  name: string;
  symbol?: string;
  assetType: AssetType;
  customType?: string;
  currency: string;
  initialQuantity: number;
  initialPricePerUnit: number;
  initialDate: string;
  initialFees?: number;
}

export interface CreateAssetResponse {
  id: number;
  shortId: string;
  name: string;
  symbol: string | null;
  assetType: string;
  customType: string | null;
  currency: string;
  quantity: number;
  valuationMode: string;
  createdAt: string;
}

export interface UpdateAssetRequest {
  name?: string;
  symbol?: string;
  assetType?: AssetType;
  customType?: string;
}

export type UpdateAssetResponse = InvestmentAsset;

export interface GetAssetsResponse {
  assets: AssetWithMetrics[];
}

export interface DeleteAssetResponse {
  success: boolean;
}

// Transaction Types
export interface InvestmentTransaction {
  id: number;
  shortId: string;
  assetId: number;
  transactionType: string;
  quantity: number;
  date: string;
  pricePerUnit: number;
  fees: number | null;
  note: string | null;
  createdAt: string;
}

export interface CreateTransactionRequest {
  transactionType: TransactionType;
  quantity: number;
  date: string;
  pricePerUnit: number;
  fees?: number;
  note?: string;
}

export type CreateTransactionResponse = InvestmentTransaction;

export interface UpdateTransactionRequest {
  transactionType?: TransactionType;
  quantity?: number;
  date?: string;
  pricePerUnit?: number;
  fees?: number;
  note?: string;
}

export type UpdateTransactionResponse = InvestmentTransaction;

export interface GetTransactionsResponse {
  transactions: InvestmentTransaction[];
}

export interface DeleteTransactionResponse {
  success: boolean;
}

// Valuation Types
export interface ValuationSnapshot {
  id: number;
  shortId: string;
  assetId: number;
  valuation: number;
  source: string;
  date: string;
  createdAt: string;
}

export interface CreateValuationRequest {
  valuation: number;
  date: string;
  source?: string;
}

export type CreateValuationResponse = ValuationSnapshot;

export interface GetValuationsResponse {
  valuations: ValuationSnapshot[];
}

// Portfolio Summary Types
export interface AssetTypeSummary {
  count: number;
  totalInvested: number;
  currentValue: number;
  growth: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalGrowth: number;
  growthPercentage: number;
  assetsByType: Record<string, AssetTypeSummary>;
  totalAssets: number;
  activeAssets: number;
  soldAssets: number;
}

// Asset Detail (combined response)
export interface AssetDetailResponse {
  asset: AssetWithMetrics;
  transactions: InvestmentTransaction[];
  valuations: ValuationSnapshot[];
}
