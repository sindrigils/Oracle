'use client';

import type { CreateIncomeRequest, Income } from '@/api/budget/types';
import { Button, Modal } from '@/core/components';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface IncomeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIncomeRequest) => void;
  income?: Income | null;
  isSubmitting: boolean;
}

export function IncomeFormModal({
  open,
  onClose,
  onSubmit,
  income,
  isSubmitting,
}: IncomeFormModalProps) {
  const isEditing = Boolean(income);
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Reset form state when modal opens or income changes - using key prop to force remount
  // Key changes when open becomes true or income id changes, resetting all form state
  const formKey = open ? `income-${income?.id ?? 'new'}` : 'closed';

  // Initialize form data based on income prop (function initializer runs on mount)
  const [formData, setFormData] = useState(() => {
    if (income) {
      return {
        amount: income.amount.toString(),
        source: income.source,
      };
    }
    return {
      amount: '',
      source: '',
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && amountInputRef.current) {
      setTimeout(() => amountInputRef.current?.focus(), 100);
    }
  }, [open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      amount: parseFloat(formData.amount),
      source: formData.source.trim(),
    });
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <form key={formKey} onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {isEditing ? 'Edit Income' : 'New Income'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Amount - Hero Style */}
        <div className="px-6 py-6">
          <div className="text-center">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">
              Amount
            </label>
            <div className="relative inline-flex items-center justify-center">
              <span className="text-3xl font-bold text-emerald-500 mr-1">
                kr
              </span>
              <input
                ref={amountInputRef}
                type="text"
                inputMode="decimal"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setFormData({ ...formData, amount: value });
                }}
                placeholder="0"
                className={cn(
                  'text-5xl font-bold text-center bg-transparent border-none outline-none w-48',
                  'text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700',
                  'focus:ring-0'
                )}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500 mt-2">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-6 pb-6 space-y-4">
          {/* Source */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Source
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              placeholder="e.g., Salary, Freelance, Investment"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                'transition-all',
                errors.source
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-zinc-200 dark:border-zinc-700'
              )}
            />
            {errors.source && (
              <p className="text-sm text-red-500 mt-1">{errors.source}</p>
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
            isLoading={isSubmitting}
            className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isEditing ? 'Save Changes' : 'Add Income'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
