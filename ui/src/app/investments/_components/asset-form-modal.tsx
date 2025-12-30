'use client';

import type { AssetType, CreateAssetRequest } from '@/api/investments/types';
import { Button, Modal } from '@/core/components';
import { cn } from '@/lib/utils';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AssetFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssetRequest) => void;
  isSubmitting: boolean;
}

const assetTypes: Array<{ value: AssetType; label: string }> = [
  { value: 'stocks', label: 'Stocks' },
  { value: 'etf', label: 'ETF' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'bonds', label: 'Bonds' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'custom', label: 'Custom' },
];

const currencies = ['USD', 'EUR', 'GBP', 'ISK', 'JPY', 'CAD', 'AUD', 'CHF'];

export function AssetFormModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: AssetFormModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Key changes when modal opens, forcing form state reset
  const formKey = open ? 'asset-new' : 'closed';

  const [formData, setFormData] = useState(() => ({
    name: '',
    symbol: '',
    assetType: '' as AssetType | '',
    customType: '',
    currency: 'USD',
    initialQuantity: '',
    initialPricePerUnit: '',
    initialDate: today,
    initialFees: '',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [assetTypeDropdownOpen, setAssetTypeDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Focus name input when modal opens
  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.assetType) {
      newErrors.assetType = 'Select an asset type';
    }

    if (formData.assetType === 'custom' && !formData.customType.trim()) {
      newErrors.customType = 'Custom type is required';
    }

    if (!formData.initialQuantity || parseFloat(formData.initialQuantity) <= 0) {
      newErrors.initialQuantity = 'Enter a valid quantity';
    }

    if (!formData.initialPricePerUnit || parseFloat(formData.initialPricePerUnit) <= 0) {
      newErrors.initialPricePerUnit = 'Enter a valid price';
    }

    if (!formData.initialDate) {
      newErrors.initialDate = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: CreateAssetRequest = {
      name: formData.name.trim(),
      symbol: formData.symbol.trim() || undefined,
      assetType: formData.assetType as AssetType,
      customType: formData.assetType === 'custom' ? formData.customType.trim() : undefined,
      currency: formData.currency,
      initialQuantity: parseFloat(formData.initialQuantity),
      initialPricePerUnit: parseFloat(formData.initialPricePerUnit),
      initialDate: formData.initialDate,
      initialFees: formData.initialFees ? parseFloat(formData.initialFees) : undefined,
    };

    onSubmit(data);
  };

  const selectedAssetType = assetTypes.find((t) => t.value === formData.assetType);
  const totalCost =
    formData.initialQuantity && formData.initialPricePerUnit
      ? parseFloat(formData.initialQuantity) * parseFloat(formData.initialPricePerUnit) +
        (formData.initialFees ? parseFloat(formData.initialFees) : 0)
      : 0;

  return (
    <Modal open={open} onClose={onClose} size="md">
      <form key={formKey} onSubmit={handleSubmit} className="max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Add Investment
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="px-6 py-6 space-y-4">
          {/* Asset Info Section */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                Name *
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Apple Inc."
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                  'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                  'transition-all',
                  errors.name
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-zinc-200 dark:border-zinc-700'
                )}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Symbol and Asset Type Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Symbol */}
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                  Symbol
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, symbol: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., AAPL"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                    'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                    'transition-all border-zinc-200 dark:border-zinc-700'
                  )}
                />
              </div>

              {/* Asset Type */}
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                  Type *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAssetTypeDropdownOpen(!assetTypeDropdownOpen)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                      'text-left transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                      errors.assetType
                        ? 'border-red-300 dark:border-red-700'
                        : 'border-zinc-200 dark:border-zinc-700'
                    )}
                  >
                    <span
                      className={
                        selectedAssetType
                          ? 'text-zinc-900 dark:text-white'
                          : 'text-zinc-400'
                      }
                    >
                      {selectedAssetType?.label || 'Select'}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-zinc-400 transition-transform',
                        assetTypeDropdownOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {assetTypeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg z-10 max-h-48 overflow-y-auto">
                      {assetTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, assetType: type.value });
                            setAssetTypeDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-900 dark:text-white transition-colors"
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.assetType && (
                  <p className="text-sm text-red-500 mt-1">{errors.assetType}</p>
                )}
              </div>
            </div>

            {/* Custom Type (shown when asset type is custom) */}
            {formData.assetType === 'custom' && (
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                  Custom Type *
                </label>
                <input
                  type="text"
                  value={formData.customType}
                  onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                  placeholder="e.g., Precious Metals"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                    'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                    'transition-all',
                    errors.customType
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-zinc-200 dark:border-zinc-700'
                  )}
                />
                {errors.customType && (
                  <p className="text-sm text-red-500 mt-1">{errors.customType}</p>
                )}
              </div>
            )}

            {/* Currency */}
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                Currency
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                    'text-left transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                    'border-zinc-200 dark:border-zinc-700'
                  )}
                >
                  <span className="text-zinc-900 dark:text-white">{formData.currency}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-zinc-400 transition-transform',
                      currencyDropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                {currencyDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg z-10 max-h-48 overflow-y-auto">
                    {currencies.map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, currency: curr });
                          setCurrencyDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-900 dark:text-white transition-colors"
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Initial Transaction Section */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
              Initial Purchase
            </h3>

            {/* Quantity and Price Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Quantity */}
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                  Quantity *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.initialQuantity}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setFormData({ ...formData, initialQuantity: value });
                  }}
                  placeholder="0"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                    'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                    'transition-all',
                    errors.initialQuantity
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-zinc-200 dark:border-zinc-700'
                  )}
                />
                {errors.initialQuantity && (
                  <p className="text-sm text-red-500 mt-1">{errors.initialQuantity}</p>
                )}
              </div>

              {/* Price per Unit */}
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                  Price/Unit *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.initialPricePerUnit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setFormData({ ...formData, initialPricePerUnit: value });
                  }}
                  placeholder="0.00"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                    'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                    'transition-all',
                    errors.initialPricePerUnit
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-zinc-200 dark:border-zinc-700'
                  )}
                />
                {errors.initialPricePerUnit && (
                  <p className="text-sm text-red-500 mt-1">{errors.initialPricePerUnit}</p>
                )}
              </div>
            </div>

            {/* Date and Fees Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="date"
                    value={formData.initialDate}
                    onChange={(e) => setFormData({ ...formData, initialDate: e.target.value })}
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                      'text-zinc-900 dark:text-white',
                      'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                      'transition-all appearance-none',
                      errors.initialDate
                        ? 'border-red-300 dark:border-red-700'
                        : 'border-zinc-200 dark:border-zinc-700'
                    )}
                  />
                </div>
                {errors.initialDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.initialDate}</p>
                )}
              </div>

              {/* Fees */}
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                  Fees
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.initialFees}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setFormData({ ...formData, initialFees: value });
                  }}
                  placeholder="0.00"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                    'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                    'transition-all border-zinc-200 dark:border-zinc-700'
                  )}
                />
              </div>
            </div>

            {/* Total Cost Preview */}
            {totalCost > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Total Cost</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: formData.currency,
                    }).format(totalCost)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1 h-12 rounded-xl"
          >
            Add Investment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
