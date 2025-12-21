'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface MonthPickerProps {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

export function MonthPicker({ year, month, onMonthChange }: MonthPickerProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const isCurrentMonth = year === currentYear && month === currentMonth;

  const goToPreviousMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const goToCurrentMonth = () => {
    onMonthChange(currentYear, currentMonth);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={goToPreviousMonth}
        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="min-w-[100px] text-center">
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
          {MONTH_NAMES_SHORT[month - 1]} {year}
        </span>
      </div>

      <button
        onClick={goToNextMonth}
        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <button
        onClick={goToCurrentMonth}
        className={`ml-2 px-2 py-1 text-xs font-medium transition-all ${
          isCurrentMonth
            ? 'invisible pointer-events-none'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
        }`}
        aria-label="Go to current month"
      >
        Today
      </button>
    </div>
  );
}
