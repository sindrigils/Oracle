'use client';

import type {
  CreateExpenseRequest,
  Expense,
  ExpenseCategory,
} from '@/api/budget/types';
import { Button, Modal } from '@/core/components';
import { cn } from '@/lib/utils';
import { Calendar, ChevronDown, Plus, Tag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ExpenseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseRequest) => void;
  onOpenCategoryForm: () => void;
  expense?: Expense | null;
  categories: ExpenseCategory[];
  isSubmitting: boolean;
}

export function ExpenseFormModal({
  open,
  onClose,
  onSubmit,
  onOpenCategoryForm,
  expense,
  categories,
  isSubmitting,
}: ExpenseFormModalProps) {
  const isEditing = Boolean(expense);
  const today = new Date().toISOString().split('T')[0];
  const amountInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: today,
    categoryId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description,
        date: expense.date.split('T')[0],
        categoryId: expense.categoryId.toString(),
      });
    } else {
      setFormData({
        amount: '',
        description: '',
        date: today,
        categoryId: '',
      });
    }
    setErrors({});
  }, [expense, open, today]);

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

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Select a category';
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

    onSubmit({
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
      categoryId: parseInt(formData.categoryId),
    });
  };

  const selectedCategory = categories.find(
    (c) => c.id.toString() === formData.categoryId
  );

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {isEditing ? 'Edit Expense' : 'New Expense'}
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
              <span className="text-3xl font-bold text-zinc-400 dark:text-zinc-500 mr-1">
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
          {/* Description */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What did you spend on?"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                'text-zinc-900 dark:text-white placeholder:text-zinc-400',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                'transition-all',
                errors.description
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-zinc-200 dark:border-zinc-700'
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Date and Category Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
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
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                Category
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800',
                    'text-left transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10',
                    errors.categoryId
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-zinc-200 dark:border-zinc-700'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {selectedCategory ? (
                      <>
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              selectedCategory.colorCode ||
                              selectedCategory.color,
                          }}
                        />
                        <span className="text-zinc-900 dark:text-white truncate">
                          {selectedCategory.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <Tag className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                        <span className="text-zinc-400">Select</span>
                      </>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-zinc-400 transition-transform flex-shrink-0',
                      categoryDropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                {/* Category Dropdown */}
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg z-10 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            categoryId: cat.id.toString(),
                          });
                          setCategoryDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: cat.colorCode || cat.color,
                          }}
                        />
                        <span className="text-zinc-900 dark:text-white">
                          {cat.name}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryDropdownOpen(false);
                        onOpenCategoryForm();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-blue-600 dark:text-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 border-t border-zinc-100 dark:border-zinc-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create new category</span>
                    </button>
                  </div>
                )}
              </div>
              {errors.categoryId && (
                <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
              )}
            </div>
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
            className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900"
          >
            {isEditing ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
