from fastapi import APIRouter, Depends, HTTPException

from models.investment_transaction import TransactionType
from schemas.investment import (
    AssetDetailResponse,
    AssetResponse,
    AssetWithMetricsResponse,
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
    PortfolioSummaryResponse,
    TransactionResponse,
    UpdateAssetRequest,
    UpdateTransactionRequest,
    ValuationResponse,
)
from services.investment import InvestmentService, get_investment_service

router = APIRouter(prefix="/investments", tags=["Investments"])


# ============ Asset Endpoints ============


@router.get("/household/{household_id}", response_model=GetAssetsResponse)
async def get_assets_by_household(
    household_id: int,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Get all investment assets for a household with computed metrics."""
    assets = investment_service.get_assets_by_household(household_id)
    assets_with_metrics = []

    for asset in assets:
        metrics = investment_service.calculate_asset_metrics(asset)
        assets_with_metrics.append(
            AssetWithMetricsResponse(
                id=asset.id,
                short_id=asset.short_id,
                name=asset.name,
                symbol=asset.symbol if asset.symbol else None,
                asset_type=asset.asset_type,
                custom_type=None,  # Stored in asset_type field when custom
                currency=asset.currency,
                quantity=asset.quantity,
                valuation_mode=asset.valuation_mode.value,
                household_id=asset.household_id,
                member_id=asset.member_id,
                current_quantity=metrics["current_quantity"],
                total_invested=metrics["total_invested"],
                current_value=metrics["current_value"],
                growth=metrics["growth"],
                growth_percentage=metrics["growth_percentage"],
                latest_valuation_per_unit=metrics["latest_valuation_per_unit"],
                latest_valuation_date=metrics["latest_valuation_date"],
                is_fully_sold=metrics["is_fully_sold"],
                created_at=asset.created_at,
                updated_at=asset.updated_at,
            )
        )

    return GetAssetsResponse(assets=assets_with_metrics)


@router.get("/household/{household_id}/portfolio", response_model=PortfolioSummaryResponse)
async def get_portfolio_summary(
    household_id: int,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Get portfolio summary for a household."""
    summary = investment_service.calculate_portfolio_summary(household_id)
    return PortfolioSummaryResponse(**summary)


@router.get("/{asset_id}", response_model=AssetDetailResponse)
async def get_asset_detail(
    asset_id: int,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Get detailed information about a single asset including transactions and valuations."""
    asset = investment_service.get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    metrics = investment_service.calculate_asset_metrics(asset)
    transactions = investment_service.get_transactions_by_asset(asset_id)
    valuations = investment_service.get_valuations_by_asset(asset_id)

    asset_response = AssetWithMetricsResponse(
        id=asset.id,
        short_id=asset.short_id,
        name=asset.name,
        symbol=asset.symbol if asset.symbol else None,
        asset_type=asset.asset_type,
        custom_type=None,
        currency=asset.currency,
        quantity=asset.quantity,
        valuation_mode=asset.valuation_mode.value,
        household_id=asset.household_id,
        member_id=asset.member_id,
        current_quantity=metrics["current_quantity"],
        total_invested=metrics["total_invested"],
        current_value=metrics["current_value"],
        growth=metrics["growth"],
        growth_percentage=metrics["growth_percentage"],
        latest_valuation_per_unit=metrics["latest_valuation_per_unit"],
        latest_valuation_date=metrics["latest_valuation_date"],
        is_fully_sold=metrics["is_fully_sold"],
        created_at=asset.created_at,
        updated_at=asset.updated_at,
    )

    transactions_response = [
        TransactionResponse(
            id=t.id,
            short_id=t.short_id,
            asset_id=t.asset_id,
            transaction_type=t.transaction_type.value,
            quantity=t.quantity,
            date=t.date,
            price_per_unit=t.price_per_unit,
            fees=t.fees,
            note=t.note,
            created_at=t.created_at,
        )
        for t in transactions
    ]

    valuations_response = [
        ValuationResponse(
            id=v.id,
            short_id=v.short_id,
            asset_id=v.asset_id,
            valuation=v.valuation,
            source=v.source,
            date=v.date,
            created_at=v.created_at,
        )
        for v in valuations
    ]

    return AssetDetailResponse(
        asset=asset_response,
        transactions=transactions_response,
        valuations=valuations_response,
    )


@router.post("/household/{household_id}/member/{member_id}", response_model=CreateAssetResponse)
async def create_asset(
    household_id: int,
    member_id: int,
    request: CreateAssetRequest,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Create a new investment asset with initial BUY transaction."""
    asset = investment_service.create_asset(
        household_id=household_id,
        member_id=member_id,
        name=request.name,
        symbol=request.symbol,
        asset_type=request.asset_type.value,
        custom_type=request.custom_type,
        currency=request.currency,
        initial_quantity=request.initial_quantity,
        initial_price_per_unit=request.initial_price_per_unit,
        initial_date=request.initial_date,
        initial_fees=request.initial_fees,
    )
    return CreateAssetResponse(
        id=asset.id,
        short_id=asset.short_id,
        name=asset.name,
        symbol=asset.symbol if asset.symbol else None,
        asset_type=asset.asset_type,
        custom_type=None,
        currency=asset.currency,
        quantity=asset.quantity,
        valuation_mode=asset.valuation_mode.value,
        created_at=asset.created_at,
    )


@router.patch("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: int,
    request: UpdateAssetRequest,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Update an existing asset."""
    asset = investment_service.update_asset(
        asset_id=asset_id,
        name=request.name,
        symbol=request.symbol,
        asset_type=request.asset_type.value if request.asset_type else None,
        custom_type=request.custom_type,
    )
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    return AssetResponse(
        id=asset.id,
        short_id=asset.short_id,
        name=asset.name,
        symbol=asset.symbol if asset.symbol else None,
        asset_type=asset.asset_type,
        custom_type=None,
        currency=asset.currency,
        quantity=asset.quantity,
        valuation_mode=asset.valuation_mode.value,
        household_id=asset.household_id,
        member_id=asset.member_id,
        created_at=asset.created_at,
        updated_at=asset.updated_at,
    )


@router.delete("/{asset_id}", response_model=DeleteAssetResponse)
async def delete_asset(
    asset_id: int,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Delete an asset and all related transactions and valuations."""
    deleted = investment_service.delete_asset(asset_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Asset not found")

    return DeleteAssetResponse(success=True)


# ============ Transaction Endpoints ============


@router.get("/{asset_id}/transactions", response_model=GetTransactionsResponse)
async def get_transactions(
    asset_id: int,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Get all transactions for an asset."""
    # Verify asset exists
    asset = investment_service.get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    transactions = investment_service.get_transactions_by_asset(asset_id)
    return GetTransactionsResponse(
        transactions=[
            TransactionResponse(
                id=t.id,
                short_id=t.short_id,
                asset_id=t.asset_id,
                transaction_type=t.transaction_type.value,
                quantity=t.quantity,
                date=t.date,
                price_per_unit=t.price_per_unit,
                fees=t.fees,
                note=t.note,
                created_at=t.created_at,
            )
            for t in transactions
        ]
    )


@router.post("/{asset_id}/transactions", response_model=CreateTransactionResponse)
async def create_transaction(
    asset_id: int,
    request: CreateTransactionRequest,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Create a new transaction for an asset."""
    # Verify asset exists and get details
    asset = investment_service.get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Validate SELL doesn't exceed current quantity
    if request.transaction_type.value == "sell":
        metrics = investment_service.calculate_asset_metrics(asset)
        if request.quantity > metrics["current_quantity"]:
            available = metrics["current_quantity"]
            raise HTTPException(
                status_code=400,
                detail=f"Cannot sell {request.quantity} units. Only {available} available.",
            )

    transaction = investment_service.create_transaction(
        asset_id=asset_id,
        household_id=asset.household_id,
        member_id=asset.member_id,
        transaction_type=TransactionType(request.transaction_type.value),
        quantity=request.quantity,
        transaction_date=request.date,
        price_per_unit=request.price_per_unit,
        fees=request.fees,
        note=request.note,
    )

    return CreateTransactionResponse(
        id=transaction.id,
        short_id=transaction.short_id,
        asset_id=transaction.asset_id,
        transaction_type=transaction.transaction_type.value,
        quantity=transaction.quantity,
        date=transaction.date,
        price_per_unit=transaction.price_per_unit,
        fees=transaction.fees,
        note=transaction.note,
        created_at=transaction.created_at,
    )


@router.patch("/transactions/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: int,
    request: UpdateTransactionRequest,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Update an existing transaction."""
    transaction = investment_service.update_transaction(
        transaction_id=transaction_id,
        transaction_type=TransactionType(request.transaction_type.value) if request.transaction_type else None,
        quantity=request.quantity,
        transaction_date=request.date,
        price_per_unit=request.price_per_unit,
        fees=request.fees,
        note=request.note,
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return TransactionResponse(
        id=transaction.id,
        short_id=transaction.short_id,
        asset_id=transaction.asset_id,
        transaction_type=transaction.transaction_type.value,
        quantity=transaction.quantity,
        date=transaction.date,
        price_per_unit=transaction.price_per_unit,
        fees=transaction.fees,
        note=transaction.note,
        created_at=transaction.created_at,
    )


@router.delete("/transactions/{transaction_id}", response_model=DeleteTransactionResponse)
async def delete_transaction(
    transaction_id: int,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Delete a transaction."""
    deleted = investment_service.delete_transaction(transaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return DeleteTransactionResponse(success=True)


# ============ Valuation Endpoints ============


@router.get("/{asset_id}/valuations", response_model=GetValuationsResponse)
async def get_valuations(
    asset_id: int,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Get all valuations for an asset."""
    # Verify asset exists
    asset = investment_service.get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    valuations = investment_service.get_valuations_by_asset(asset_id)
    return GetValuationsResponse(
        valuations=[
            ValuationResponse(
                id=v.id,
                short_id=v.short_id,
                asset_id=v.asset_id,
                valuation=v.valuation,
                source=v.source,
                date=v.date,
                created_at=v.created_at,
            )
            for v in valuations
        ]
    )


@router.post("/{asset_id}/valuations", response_model=CreateValuationResponse)
async def create_valuation(
    asset_id: int,
    request: CreateValuationRequest,
    investment_service: InvestmentService = Depends(get_investment_service),
):
    """Create a new valuation snapshot for an asset."""
    # Verify asset exists
    asset = investment_service.get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    valuation = investment_service.create_valuation(
        asset_id=asset_id,
        valuation=request.valuation,
        valuation_date=request.date,
        source=request.source,
    )

    return CreateValuationResponse(
        id=valuation.id,
        short_id=valuation.short_id,
        asset_id=valuation.asset_id,
        valuation=valuation.valuation,
        source=valuation.source,
        date=valuation.date,
        created_at=valuation.created_at,
    )
