'use client';

import { useEffect } from 'react';
import type { ElementType } from 'react';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

interface FloatingToastProps {
  open: boolean;
  title: string;
  description?: string;
  variant?: ToastVariant;
  onClose: () => void;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const variantStyles: Record<ToastVariant, { icon: ElementType; className: string; iconClassName: string }> = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200/80 bg-white/95 text-emerald-900',
    iconClassName: 'text-emerald-600',
  },
  error: {
    icon: CircleAlert,
    className: 'border-red-200/80 bg-white/95 text-red-900',
    iconClassName: 'text-red-600',
  },
  info: {
    icon: Info,
    className: 'border-[#1a237e]/20 bg-white/95 text-[#1a237e]',
    iconClassName: 'text-[#1a237e]',
  },
};

export function FloatingToast({
  open,
  title,
  description,
  variant = 'success',
  onClose,
  durationMs = 5000,
  actionLabel,
  onAction,
  className,
}: FloatingToastProps) {
  useEffect(() => {
    if (!open || durationMs <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [durationMs, onClose, open]);

  if (!open) {
    return null;
  }

  const config = variantStyles[variant];
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed right-4 z-[120] w-[min(92vw,430px)] rounded-2xl border shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300',
        'top-24 md:top-28',
        config.className,
        className
      )}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className={cn('mt-0.5', config.iconClassName)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm md:text-base font-semibold leading-snug">{title}</p>
            {description && (
              <p className="mt-1 text-xs md:text-sm leading-relaxed opacity-80">{description}</p>
            )}
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="mt-3 text-xs md:text-sm font-semibold underline underline-offset-4 opacity-90 hover:opacity-100"
              >
                {actionLabel}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="h-1 w-full bg-black/5">
        <div
          className="h-full bg-current opacity-20 animate-[toast-shrink_5s_linear_forwards]"
          style={{ animationDuration: `${durationMs}ms` }}
        />
      </div>
    </div>
  );
}
