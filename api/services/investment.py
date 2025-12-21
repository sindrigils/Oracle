from datetime import date, datetime
from typing import Optional

from fastapi import Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from db.engine import get_db
from models.investment_asset import InvestmentAsset, ValuationMode
from models.investment_transaction import InvestmentTransaction, TransactionType
from models.investment_valuation_snapshot import InvestmentValuationSnapshot


class InvestmentService:
    def __init__(self, db: Session):
        self.db = db

    # ==================== Asset Methods ====================

    def get_assets_by_household(self, household_id: int) -> list[InvestmentAsset]:
        """Get all investment assets for a household."""
        return (
            self.db.query(InvestmentAsset)
            .filter(InvestmentAsset.household_id == household_id)
            .order_by(InvestmentAsset.created_at.desc())
            .all()
        )

    def get_assets_by_member(self, member_id: int) -> list[InvestmentAsset]:
        """Get all investment assets for a specific member."""
        return (
            self.db.query(InvestmentAsset)
            .filter(InvestmentAsset.member_id == member_id)
            .order_by(InvestmentAsset.created_at.desc())
            .all()
        )

    def get_asset_by_id(self, asset_id: int) -> Optional[InvestmentAsset]:
        """Get a single asset by ID."""
        return self.db.query(InvestmentAsset).filter(InvestmentAsset.id == asset_id).first()

    def get_asset_by_short_id(self, short_id: str) -> Optional[InvestmentAsset]:
        """Get a single asset by short_id."""
        return self.db.query(InvestmentAsset).filter(InvestmentAsset.short_id == short_id).first()

    def create_asset(
        self,
        household_id: int,
        member_id: int,
        name: str,
        asset_type: str,
        currency: str,
        initial_quantity: float,
        initial_price_per_unit: float,
        initial_date: date,
        symbol: Optional[str] = None,
        custom_type: Optional[str] = None,
        initial_fees: Optional[float] = None,
    ) -> InvestmentAsset:
        """Create a new investment asset with initial BUY transaction."""
        # Create the asset
        asset = InvestmentAsset(
            household_id=household_id,
            member_id=member_id,
            name=name,
            symbol=symbol or "",
            asset_type=asset_type if asset_type != "custom" else (custom_type or "custom"),
            currency=currency,
            quantity=int(initial_quantity),  # Model uses int, we'll track actual via transactions
            valuation_mode=ValuationMode.MANUAL,
        )
        self.db.add(asset)
        self.db.flush()  # Get the asset ID

        # Create initial BUY transaction
        transaction = InvestmentTransaction(
            household_id=household_id,
            member_id=member_id,
            asset_id=asset.id,
            transaction_type=TransactionType.BUY,
            quantity=int(initial_quantity),
            date=initial_date,
            price_per_unit=initial_price_per_unit,
            fees=initial_fees,
        )
        self.db.add(transaction)

        # Create initial valuation snapshot
        valuation = InvestmentValuationSnapshot(
            asset_id=asset.id,
            valuation=initial_price_per_unit,
            source="initial",
            date=initial_date,
        )
        self.db.add(valuation)

        self.db.commit()
        self.db.refresh(asset)
        return asset

    def update_asset(
        self,
        asset_id: int,
        name: Optional[str] = None,
        symbol: Optional[str] = None,
        asset_type: Optional[str] = None,
        custom_type: Optional[str] = None,
    ) -> Optional[InvestmentAsset]:
        """Update an existing asset."""
        asset = self.get_asset_by_id(asset_id)
        if not asset:
            return None

        if name is not None:
            asset.name = name
        if symbol is not None:
            asset.symbol = symbol
        if asset_type is not None:
            if asset_type == "custom" and custom_type:
                asset.asset_type = custom_type
            else:
                asset.asset_type = asset_type

        asset.updated_at = datetime.now()
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def delete_asset(self, asset_id: int) -> bool:
        """Delete an asset and all related transactions/valuations."""
        asset = self.get_asset_by_id(asset_id)
        if not asset:
            return False

        # Delete related transactions
        self.db.query(InvestmentTransaction).filter(InvestmentTransaction.asset_id == asset_id).delete()

        # Delete related valuations
        self.db.query(InvestmentValuationSnapshot).filter(InvestmentValuationSnapshot.asset_id == asset_id).delete()

        # Delete the asset
        self.db.delete(asset)
        self.db.commit()
        return True

    # ==================== Transaction Methods ====================

    def get_transactions_by_asset(self, asset_id: int) -> list[InvestmentTransaction]:
        """Get all transactions for an asset, ordered by date descending."""
        return (
            self.db.query(InvestmentTransaction)
            .filter(InvestmentTransaction.asset_id == asset_id)
            .order_by(desc(InvestmentTransaction.date), desc(InvestmentTransaction.created_at))
            .all()
        )

    def get_transaction_by_id(self, transaction_id: int) -> Optional[InvestmentTransaction]:
        """Get a single transaction by ID."""
        return self.db.query(InvestmentTransaction).filter(InvestmentTransaction.id == transaction_id).first()

    def create_transaction(
        self,
        asset_id: int,
        household_id: int,
        member_id: int,
        transaction_type: TransactionType,
        quantity: float,
        transaction_date: date,
        price_per_unit: float,
        fees: Optional[float] = None,
        note: Optional[str] = None,
    ) -> InvestmentTransaction:
        """Create a new transaction and update asset quantity."""
        transaction = InvestmentTransaction(
            household_id=household_id,
            member_id=member_id,
            asset_id=asset_id,
            transaction_type=transaction_type,
            quantity=int(quantity),
            date=transaction_date,
            price_per_unit=price_per_unit,
            fees=fees,
            note=note,
        )
        self.db.add(transaction)

        # Update asset quantity
        asset = self.get_asset_by_id(asset_id)
        if asset:
            current_qty = self._calculate_current_quantity(asset)
            if transaction_type == TransactionType.BUY:
                asset.quantity = int(current_qty + quantity)
            elif transaction_type == TransactionType.SELL:
                asset.quantity = int(max(0, current_qty - quantity))
            # DIVIDEND and INTEREST don't affect quantity

        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def update_transaction(
        self,
        transaction_id: int,
        transaction_type: Optional[TransactionType] = None,
        quantity: Optional[float] = None,
        transaction_date: Optional[date] = None,
        price_per_unit: Optional[float] = None,
        fees: Optional[float] = None,
        note: Optional[str] = None,
    ) -> Optional[InvestmentTransaction]:
        """Update an existing transaction."""
        transaction = self.get_transaction_by_id(transaction_id)
        if not transaction:
            return None

        if transaction_type is not None:
            transaction.transaction_type = transaction_type
        if quantity is not None:
            transaction.quantity = int(quantity)
        if transaction_date is not None:
            transaction.date = transaction_date
        if price_per_unit is not None:
            transaction.price_per_unit = price_per_unit
        if fees is not None:
            transaction.fees = fees
        if note is not None:
            transaction.note = note

        transaction.updated_at = datetime.now()

        # Recalculate asset quantity
        asset = self.get_asset_by_id(transaction.asset_id)
        if asset:
            asset.quantity = int(self._calculate_current_quantity(asset))

        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def delete_transaction(self, transaction_id: int) -> bool:
        """Delete a transaction and update asset quantity."""
        transaction = self.get_transaction_by_id(transaction_id)
        if not transaction:
            return False

        asset_id = transaction.asset_id
        self.db.delete(transaction)

        # Recalculate asset quantity
        asset = self.get_asset_by_id(asset_id)
        if asset:
            # Need to commit first to exclude deleted transaction
            self.db.commit()
            asset.quantity = int(self._calculate_current_quantity(asset))
            self.db.commit()
        else:
            self.db.commit()

        return True

    # ==================== Valuation Methods ====================

    def get_valuations_by_asset(self, asset_id: int) -> list[InvestmentValuationSnapshot]:
        """Get all valuations for an asset, ordered by date descending."""
        return (
            self.db.query(InvestmentValuationSnapshot)
            .filter(InvestmentValuationSnapshot.asset_id == asset_id)
            .order_by(desc(InvestmentValuationSnapshot.date))
            .all()
        )

    def get_latest_valuation(self, asset_id: int) -> Optional[InvestmentValuationSnapshot]:
        """Get the most recent valuation for an asset."""
        return (
            self.db.query(InvestmentValuationSnapshot)
            .filter(InvestmentValuationSnapshot.asset_id == asset_id)
            .order_by(desc(InvestmentValuationSnapshot.date))
            .first()
        )

    def create_valuation(
        self,
        asset_id: int,
        valuation: float,
        valuation_date: date,
        source: str = "manual",
    ) -> InvestmentValuationSnapshot:
        """Create a new valuation snapshot."""
        snapshot = InvestmentValuationSnapshot(
            asset_id=asset_id,
            valuation=valuation,
            source=source,
            date=valuation_date,
        )
        self.db.add(snapshot)
        self.db.commit()
        self.db.refresh(snapshot)
        return snapshot

    # ==================== Calculation Methods ====================

    def _calculate_current_quantity(self, asset: InvestmentAsset) -> float:
        """Calculate current quantity from transactions."""
        transactions = self.get_transactions_by_asset(asset.id)
        buy_qty = sum(t.quantity for t in transactions if t.transaction_type == TransactionType.BUY)
        sell_qty = sum(t.quantity for t in transactions if t.transaction_type == TransactionType.SELL)
        return buy_qty - sell_qty

    def calculate_asset_metrics(self, asset: InvestmentAsset) -> dict:
        """Calculate all metrics for an asset."""
        transactions = self.get_transactions_by_asset(asset.id)
        latest_valuation = self.get_latest_valuation(asset.id)

        # Calculate quantities
        buy_qty = sum(t.quantity for t in transactions if t.transaction_type == TransactionType.BUY)
        sell_qty = sum(t.quantity for t in transactions if t.transaction_type == TransactionType.SELL)
        current_quantity = buy_qty - sell_qty

        # Calculate cost basis (total invested)
        buy_total = sum(
            t.quantity * t.price_per_unit + (t.fees or 0)
            for t in transactions
            if t.transaction_type == TransactionType.BUY
        )
        sell_total = sum(
            t.quantity * t.price_per_unit - (t.fees or 0)
            for t in transactions
            if t.transaction_type == TransactionType.SELL
        )
        total_invested = buy_total - sell_total

        # Calculate current value
        current_value = None
        if latest_valuation and current_quantity > 0:
            current_value = latest_valuation.valuation * current_quantity

        # Calculate growth
        growth = None
        growth_percentage = None
        if current_value is not None and total_invested > 0:
            growth = current_value - total_invested
            growth_percentage = (growth / total_invested) * 100

        return {
            "current_quantity": current_quantity,
            "total_invested": total_invested,
            "current_value": current_value,
            "growth": growth,
            "growth_percentage": growth_percentage,
            "latest_valuation_per_unit": latest_valuation.valuation if latest_valuation else None,
            "latest_valuation_date": latest_valuation.date if latest_valuation else None,
            "is_fully_sold": current_quantity <= 0,
        }

    def calculate_portfolio_summary(self, household_id: int) -> dict:
        """Calculate portfolio summary for a household."""
        assets = self.get_assets_by_household(household_id)

        total_invested = 0.0
        current_value = 0.0
        assets_by_type: dict[str, dict] = {}
        active_count = 0
        sold_count = 0

        for asset in assets:
            metrics = self.calculate_asset_metrics(asset)

            # Update totals
            total_invested += metrics["total_invested"]
            if metrics["current_value"] is not None:
                current_value += metrics["current_value"]

            # Track active/sold
            if metrics["is_fully_sold"]:
                sold_count += 1
            else:
                active_count += 1

            # Group by asset type
            asset_type = asset.asset_type
            if asset_type not in assets_by_type:
                assets_by_type[asset_type] = {
                    "count": 0,
                    "total_invested": 0.0,
                    "current_value": 0.0,
                    "growth": 0.0,
                }

            assets_by_type[asset_type]["count"] += 1
            assets_by_type[asset_type]["total_invested"] += metrics["total_invested"]
            if metrics["current_value"] is not None:
                assets_by_type[asset_type]["current_value"] += metrics["current_value"]
            if metrics["growth"] is not None:
                assets_by_type[asset_type]["growth"] += metrics["growth"]

        # Calculate overall growth
        total_growth = current_value - total_invested
        growth_percentage = (total_growth / total_invested * 100) if total_invested > 0 else 0.0

        return {
            "total_invested": total_invested,
            "current_value": current_value,
            "total_growth": total_growth,
            "growth_percentage": growth_percentage,
            "assets_by_type": assets_by_type,
            "total_assets": len(assets),
            "active_assets": active_count,
            "sold_assets": sold_count,
        }


def get_investment_service(db: Session = Depends(get_db)) -> InvestmentService:
    return InvestmentService(db)
