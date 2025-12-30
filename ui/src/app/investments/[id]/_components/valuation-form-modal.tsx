'use client';

import type { CreateValuationRequest } from '@/api/investments/types';
import { Button, Modal } from '@/core/components';
import { cn } from '@/lib/utils';
import { Calendar, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ValuationFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateValuationRequest) => void;
  isSubmitting: boolean;
  currentQuantity: number;
  currency?: string;
}

export function ValuationFormModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  currentQuantity,
  currency = 'USD',
}: ValuationFormModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const valuationInputRef = useRef<HTMLInputElement>(null);

  const formKey = open ? 'valuation-new' : 'closed';

  const [formData, setFormData] = useState(() => ({
    valuation: '',
    date: today,
    source: 'manual',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Focus valuation input when modal opens
  useEffect(() => {
    if (open && valuationInputRef.current) {
      setTimeout(() => valuationInputRef.current?.focus(), 100);
    }
  }, [open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.valuation || parseFloat(formData.valuation) <= 0) {
      newErrors.valuation = 'Enter a valid price per unit';
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

    const data: CreateValuationRequest = {
      valuation: parseFloat(formData.valuation),
      date: formData.date,
      source: formData.source || 'manual',
    };

    onSubmit(data);
  };

  const totalValue =
    formData.valuation && currentQuantity > 0
      ? parseFloat(formData.valuation) * currentQuantity
      : 0;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <form key={formKey} onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Update Value
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
          {/* Valuation (Price per Unit) */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Price per Unit *
            </label>
            <input
              ref={valuationInputRef}
              type="text"
              inputMode="decimal"
              value={formData.valuation}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                setFormData({ ...formData, valuation: value });
              }}
              placeholder="0.00"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                'transition-all',
                errors.valuation
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-zinc-200 dark:border-zinc-700'
              )}
            />
            {errors.valuation && <p className="text-sm text-red-500 mt-1">{errors.valuation}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Valuation Date *
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

          {/* Source */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Source
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g., manual, yahoo, broker"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                'transition-all border-zinc-200 dark:border-zinc-700'
              )}
            />
          </div>

          {/* Total Value Preview */}
          {totalValue > 0 && (
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Total Value ({currentQuantity} units)
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                  }).format(totalValue)}
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
            Update Value
          </Button>
        </div>
      </form>
    </Modal>
  );
}
