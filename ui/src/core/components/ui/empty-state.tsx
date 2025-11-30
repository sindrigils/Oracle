import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { Button, type ButtonProps } from './button';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
  };
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
            {icon}
          </div>
        )}
        <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        {description && (
          <p className="mb-4 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
        {action && (
          <Button
            variant={action.variant || 'primary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
