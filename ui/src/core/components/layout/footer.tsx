import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Oracle. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
