'use client';

import type { CreateTransactionRequest, TransactionType } from '@/api/investments/types';
import { Button, Modal } from '@/core/components';
import { cn } from '@/lib/utils';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionRequest) => void;
  isSubmitting: boolean;
  currentQuantity: number;
  currency?: string;
}

const transactionTypes: Array<{ value: TransactionType; label: string; description: string }> = [
  { value: 'buy', label: 'Buy', description: 'Purchase more units' },
  { value: 'sell', label: 'Sell', description: 'Sell existing units' },
  { value: 'dividend', label: 'Dividend', description: 'Dividend payment received' },
  { value: 'interest', label: 'Interest', description: 'Interest payment received' },
];

export function TransactionFormModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  currentQuantity,
  currency = 'USD',
}: TransactionFormModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const formKey = open ? 'transaction-new' : 'closed';

  const [formData, setFormData] = useState(() => ({
    transactionType: '' as TransactionType | '',
    quantity: '',
    pricePerUnit: '',
    date: today,
    fees: '',
    note: '',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  // Focus quantity input when modal opens
  useEffect(() => {
    if (open && quantityInputRef.current) {
      setTimeout(() => quantityInputRef.current?.focus(), 100);
    }
  }, [open]);

  const selectedType = transactionTypes.find((t) => t.value === formData.transactionType);
  const isSellTransaction = formData.transactionType === 'sell';
  const isDividendOrInterest = formData.transactionType === 'dividend' || formData.transactionType === 'interest';

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.transactionType) {
      newErrors.transactionType = 'Select a transaction type';
    }

    const quantity = parseFloat(formData.quantity);
    if (!formData.quantity || quantity <= 0) {
      newErrors.quantity = 'Enter a valid quantity';
    } else if (isSellTransaction && quantity > currentQuantity) {
      newErrors.quantity = `Cannot sell more than ${currentQuantity} units`;
    }

    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      newErrors.pricePerUnit = 'Enter a valid price';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: CreateTransactionRequest = {
      transactionType: formData.transactionType as TransactionType,
      quantity: parseFloat(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      date: formData.date,
      fees: formData.fees ? parseFloat(formData.fees) : undefined,
      note: formData.note.trim() || undefined,
    };

    onSubmit(data);
  };

  const totalAmount =
    formData.quantity && formData.pricePerUnit
      ? parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit) +
        (formData.fees ? parseFloat(formData.fees) : 0)
      : 0;

  return (
    <Modal open={open} onClose={onClose} size="md">
      <form key={formKey} onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Add Transaction
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
          {/* Transaction Type */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Transaction Type *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                  'text-left transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                  errors.transactionType
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-zinc-200 dark:border-zinc-700'
                )}
              >
                <span
                  className={
                    selectedType
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-400'
                  }
                >
                  {selectedType?.label || 'Select type'}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-zinc-400 transition-transform',
                    typeDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {typeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg z-10 overflow-hidden">
                  {transactionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, transactionType: type.value });
                        setTypeDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                    >
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {type.label}
                      </span>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.transactionType && (
              <p className="text-sm text-red-500 mt-1">{errors.transactionType}</p>
            )}
          </div>

          {/* Quantity and Price Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Quantity */}
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                {isDividendOrInterest ? 'Amount *' : 'Quantity *'}
              </label>
              <input
                ref={quantityInputRef}
                type="text"
                inputMode="decimal"
                value={formData.quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setFormData({ ...formData, quantity: value });
                }}
                placeholder="0"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                  'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                  'transition-all',
                  errors.quantity
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-zinc-200 dark:border-zinc-700'
                )}
              />
              {isSellTransaction && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Max: {currentQuantity} units
                </p>
              )}
              {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
            </div>

            {/* Price per Unit */}
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                Price/Unit *
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.pricePerUnit}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setFormData({ ...formData, pricePerUnit: value });
                }}
                placeholder="0.00"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                  'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                  'transition-all',
                  errors.pricePerUnit
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-zinc-200 dark:border-zinc-700'
                )}
              />
              {errors.pricePerUnit && (
                <p className="text-sm text-red-500 mt-1">{errors.pricePerUnit}</p>
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
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                    'text-zinc-900 dark:text-white',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                    'transition-all appearance-none',
                    errors.date
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-zinc-200 dark:border-zinc-700'
                  )}
                />
              </div>
              {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Fees */}
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                Fees
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.fees}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setFormData({ ...formData, fees: value });
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

          {/* Note */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Note
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Optional note about this transaction"
              rows={2}
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                'transition-all border-zinc-200 dark:border-zinc-700 resize-none'
              )}
            />
          </div>

          {/* Total Preview */}
          {totalAmount > 0 && (
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {isSellTransaction ? 'Total Proceeds' : 'Total Cost'}
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                  }).format(totalAmount)}
                </span>
              </div>
            </div>
          )}
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
            isLoading={isSubmitting}
            className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900"
          >
            Add Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
