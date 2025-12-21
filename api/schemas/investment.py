from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


# Enums
class AssetType(str, Enum):
    STOCKS = "stocks"
    BONDS = "bonds"
    CRYPTO = "crypto"
    ETF = "etf"
    REAL_ESTATE = "real_estate"
    CUSTOM = "custom"


class TransactionType(str, Enum):
    BUY = "buy"
    SELL = "sell"
    DIVIDEND = "dividend"
    INTEREST = "interest"


class ValuationMode(str, Enum):
    MARKET = "market"
    MANUAL = "manual"


# Asset Schemas
class CreateAssetRequest(BaseModel):
    name: str
    symbol: Optional[str] = None
    asset_type: AssetType
    custom_type: Optional[str] = None  # Used when asset_type is CUSTOM
    currency: str
    # Initial transaction (required for new assets)
    initial_quantity: float
    initial_price_per_unit: float
    initial_date: date
    initial_fees: Optional[float] = None


class CreateAssetResponse(BaseModel):
    id: int
    short_id: str
    name: str
    symbol: Optional[str]
    asset_type: str
    custom_type: Optional[str]
    currency: str
    quantity: float
    valuation_mode: str
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateAssetRequest(BaseModel):
    name: Optional[str] = None
    symbol: Optional[str] = None
    asset_type: Optional[AssetType] = None
    custom_type: Optional[str] = None


class AssetResponse(BaseModel):
    id: int
    short_id: str
    name: str
    symbol: Optional[str]
    asset_type: str
    custom_type: Optional[str]
    currency: str
    quantity: float
    valuation_mode: str
    household_id: int
    member_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AssetWithMetricsResponse(BaseModel):
    id: int
    short_id: str
    name: str
    symbol: Optional[str]
    asset_type: str
    custom_type: Optional[str]
    currency: str
    quantity: float
    valuation_mode: str
    household_id: int
    member_id: int
    # Computed metrics
    current_quantity: float
    total_invested: float
    current_value: Optional[float]
    growth: Optional[float]
    growth_percentage: Optional[float]
    latest_valuation_per_unit: Optional[float]
    latest_valuation_date: Optional[date]
    is_fully_sold: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GetAssetsResponse(BaseModel):
    assets: list[AssetWithMetricsResponse]


# Transaction Schemas
class TransactionResponse(BaseModel):
    id: int
    short_id: str
    asset_id: int
    transaction_type: str
    quantity: float
    date: date
    price_per_unit: float
    fees: Optional[float]
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class CreateTransactionRequest(BaseModel):
    transaction_type: TransactionType
    quantity: float
    date: date
    price_per_unit: float
    fees: Optional[float] = None
    note: Optional[str] = None


class CreateTransactionResponse(BaseModel):
    id: int
    short_id: str
    asset_id: int
    transaction_type: str
    quantity: float
    date: date
    price_per_unit: float
    fees: Optional[float]
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateTransactionRequest(BaseModel):
    transaction_type: Optional[TransactionType] = None
    quantity: Optional[float] = None
    date: Optional[date] = None
    price_per_unit: Optional[float] = None
    fees: Optional[float] = None
    note: Optional[str] = None


class GetTransactionsResponse(BaseModel):
    transactions: list[TransactionResponse]


class DeleteTransactionResponse(BaseModel):
    success: bool


# Valuation Schemas
class ValuationResponse(BaseModel):
    id: int
    short_id: str
    asset_id: int
    valuation: float
    source: str
    date: date
    created_at: datetime

    class Config:
        from_attributes = True


class CreateValuationRequest(BaseModel):
    valuation: float  # Price per unit
    date: date
    source: str = "manual"


class CreateValuationResponse(BaseModel):
    id: int
    short_id: str
    asset_id: int
    valuation: float
    source: str
    date: date
    created_at: datetime

    class Config:
        from_attributes = True


class GetValuationsResponse(BaseModel):
    valuations: list[ValuationResponse]


# Portfolio Summary
class AssetTypeSummary(BaseModel):
    count: int
    total_invested: float
    current_value: float
    growth: float


class PortfolioSummaryResponse(BaseModel):
    total_invested: float
    current_value: float
    total_growth: float
    growth_percentage: float
    assets_by_type: dict[str, AssetTypeSummary]
    total_assets: int
    active_assets: int
    sold_assets: int


# Asset Detail (includes transactions and valuations)
class AssetDetailResponse(BaseModel):
    asset: AssetWithMetricsResponse
    transactions: list[TransactionResponse]
    valuations: list[ValuationResponse]


# Delete response
class DeleteAssetResponse(BaseModel):
    success: bool
