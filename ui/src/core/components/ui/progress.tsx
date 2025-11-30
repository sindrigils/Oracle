import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes } from 'react';

const progressTrackVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const progressBarVariants = cva(
  'h-full rounded-full transition-all duration-500 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 dark:bg-zinc-100',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
        blue: 'bg-blue-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ProgressProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressTrackVariants>,
    VariantProps<typeof progressBarVariants> {
  value: number;
  max?: number;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside' | 'none';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      size,
      variant,
      showLabel = false,
      labelPosition = 'outside',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayPercentage = Math.round(percentage);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && labelPosition === 'outside' && (
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {displayPercentage}%
            </span>
          </div>
        )}
        <div className={progressTrackVariants({ size })}>
          <div
            className={progressBarVariants({ variant })}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          >
            {showLabel && labelPosition === 'inside' && size === 'lg' && (
              <span className="flex h-full items-center justify-center text-xs font-medium text-white">
                {displayPercentage}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Helper to determine variant based on percentage thresholds
export const getProgressVariant = (
  percentage: number,
  thresholds?: { warning?: number; danger?: number }
): VariantProps<typeof progressBarVariants>['variant'] => {
  const { warning = 80, danger = 100 } = thresholds || {};

  if (percentage >= danger) return 'danger';
  if (percentage >= warning) return 'warning';
  return 'success';
};

export { progressBarVariants, progressTrackVariants };
