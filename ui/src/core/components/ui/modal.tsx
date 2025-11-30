'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import {
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

const modalOverlayVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'
);

const modalContentVariants = cva(
  'relative w-full bg-white dark:bg-zinc-900 rounded-xl shadow-2xl animate-in zoom-in-95 fade-in duration-200',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ModalProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalContentVariants> {
  open: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      children,
      open,
      onClose,
      size,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      ...props
    },
    ref
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === overlayRef.current) {
          onClose();
        }
      },
      [closeOnOverlayClick, onClose]
    );

    useEffect(() => {
      if (open) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }, [open, handleEscape]);

    if (!open) return null;

    return createPortal(
      <div
        ref={overlayRef}
        className={modalOverlayVariants()}
        onClick={handleOverlayClick}
      >
        <div
          ref={ref}
          className={cn(modalContentVariants({ size, className }))}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';

export const ModalHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { onClose?: () => void }
>(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800',
      className
    )}
    {...props}
  >
    <div className="flex-1">{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="ml-4 p-1 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Close modal"
      >
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
));

ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-lg font-semibold text-zinc-900 dark:text-zinc-100',
      className
    )}
    {...props}
  />
));

ModalTitle.displayName = 'ModalTitle';

export const ModalBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
));

ModalBody.displayName = 'ModalBody';

export const ModalFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800',
      className
    )}
    {...props}
  />
));

ModalFooter.displayName = 'ModalFooter';

export { modalContentVariants };
