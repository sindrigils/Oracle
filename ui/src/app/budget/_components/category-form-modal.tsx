'use client';

import type { CategoryColor, CreateCategoryRequest } from '@/api/budget/types';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/core/components';
import { useEffect, useState } from 'react';

const PRESET_COLORS: { value: CategoryColor; label: string; hex: string }[] = [
  { value: 'red', label: 'Red', hex: '#ef4444' },
  { value: 'green', label: 'Green', hex: '#22c55e' },
  { value: 'blue', label: 'Blue', hex: '#3b82f6' },
  { value: 'yellow', label: 'Yellow', hex: '#eab308' },
  { value: 'purple', label: 'Purple', hex: '#a855f7' },
  { value: 'orange', label: 'Orange', hex: '#f97316' },
  { value: 'pink', label: 'Pink', hex: '#ec4899' },
  { value: 'gray', label: 'Gray', hex: '#6b7280' },
];

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest) => void;
  isSubmitting: boolean;
}

export function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: CategoryFormModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<CategoryColor>('blue');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName('');
      setSelectedColor('blue');
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      color: selectedColor,
    });
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit}>
        <ModalHeader onClose={onClose}>
          <ModalTitle>Create Category</ModalTitle>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <Input
            label="Category Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Groceries, Entertainment"
            error={errors.name}
            autoFocus
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`
                    flex h-10 items-center justify-center rounded-lg border-2 transition-all
                    ${
                      selectedColor === color.value
                        ? 'border-zinc-900 dark:border-white scale-105'
                        : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                    }
                  `}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.label}
                />
              ))}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Category
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
