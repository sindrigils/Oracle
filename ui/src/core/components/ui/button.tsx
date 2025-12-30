import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader } from './loader';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100',
        secondary:
          'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
        outline:
          'border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-50 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800',
        ghost:
          'text-zinc-900 hover:bg-zinc-100 focus-visible:ring-zinc-500 dark:text-zinc-100 dark:hover:bg-zinc-800',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        link:
          'text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader size="sm" /> : leftIcon ? leftIcon : null}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
