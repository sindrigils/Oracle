import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes } from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        green:
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        yellow:
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        purple:
          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        orange:
          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
        gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        outline:
          'border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dotColor, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dotColor && (
          <span
            className="mr-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { badgeVariants };

// Helper to map category colors to badge variants
export const categoryColorToVariant = (
  color: string
): VariantProps<typeof badgeVariants>['variant'] => {
  const colorMap: Record<
    string,
    VariantProps<typeof badgeVariants>['variant']
  > = {
    red: 'red',
    green: 'green',
    blue: 'blue',
    yellow: 'yellow',
    purple: 'purple',
    orange: 'orange',
    pink: 'pink',
    gray: 'gray',
    brown: 'orange',
    black: 'default',
    white: 'outline',
    custom: 'default',
  };
  return colorMap[color] || 'default';
};
