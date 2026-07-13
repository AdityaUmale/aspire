'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ElementType } from 'react';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminToastVariant = 'success' | 'error' | 'info';

export type AdminToastInput = {
  title: string;
  description?: string;
  variant?: AdminToastVariant;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type AdminToastItem = AdminToastInput & {
  id: string;
  variant: AdminToastVariant;
  durationMs: number;
};

type AdminToastContextValue = {
  toast: (input: AdminToastInput) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

const variantStyles: Record<
  AdminToastVariant,
  { icon: ElementType; className: string; iconClassName: string; barClassName: string }
> = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200/80 bg-white/95 text-emerald-950',
    iconClassName: 'text-emerald-600 bg-emerald-50',
    barClassName: 'bg-emerald-500/40',
  },
  error: {
    icon: CircleAlert,
    className: 'border-red-200/80 bg-white/95 text-red-950',
    iconClassName: 'text-red-600 bg-red-50',
    barClassName: 'bg-red-500/40',
  },
  info: {
    icon: Info,
    className: 'border-[#1a237e]/15 bg-white/95 text-[#0f1a5c]',
    iconClassName: 'text-[#1a237e] bg-[#eef2ff]',
    barClassName: 'bg-[#1a237e]/35',
  },
};

function ToastCard({
  item,
  onClose,
}: {
  item: AdminToastItem;
  onClose: (id: string) => void;
}) {
  const config = variantStyles[item.variant];
  const Icon = config.icon;

  React.useEffect(() => {
    if (item.durationMs <= 0) return;
    const timeoutId = window.setTimeout(() => onClose(item.id), item.durationMs);
    return () => window.clearTimeout(timeoutId);
  }, [item.durationMs, item.id, onClose]);

  return (
    <div
      role={item.variant === 'error' ? 'alert' : 'status'}
      aria-live={item.variant === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'pointer-events-auto w-[min(92vw,400px)] overflow-hidden rounded-2xl border shadow-[0_16px_48px_-18px_rgba(15,23,42,0.35)] backdrop-blur-md',
        'animate-in fade-in slide-in-from-right-4 duration-300',
        config.className
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
              config.iconClassName
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug">{item.title}</p>
            {item.description ? (
              <p className="mt-1 text-xs leading-relaxed text-current/70">{item.description}</p>
            ) : null}
            {item.actionLabel && item.onAction ? (
              <button
                type="button"
                onClick={item.onAction}
                className="mt-2.5 text-xs font-semibold underline underline-offset-4 opacity-90 hover:opacity-100"
              >
                {item.actionLabel}
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onClose(item.id)}
            className="rounded-lg p-1.5 text-current/50 transition-colors hover:bg-black/5 hover:text-current"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {item.durationMs > 0 ? (
        <div className="h-1 w-full bg-black/5">
          <div
            className={cn('h-full animate-[toast-shrink_5s_linear_forwards]', config.barClassName)}
            style={{ animationDuration: `${item.durationMs}ms` }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<AdminToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: AdminToastInput) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const next: AdminToastItem = {
      id,
      title: input.title,
      description: input.description,
      variant: input.variant ?? 'info',
      durationMs: input.durationMs ?? (input.variant === 'error' ? 6500 : 4500),
      actionLabel: input.actionLabel,
      onAction: input.onAction,
    };

    setItems((current) => [...current.slice(-3), next]);
  }, []);

  const success = useCallback(
    (title: string, description?: string) => toast({ title, description, variant: 'success' }),
    [toast]
  );
  const error = useCallback(
    (title: string, description?: string) => toast({ title, description, variant: 'error' }),
    [toast]
  );
  const info = useCallback(
    (title: string, description?: string) => toast({ title, description, variant: 'info' }),
    [toast]
  );

  const value = useMemo(
    () => ({ toast, success, error, info, dismiss }),
    [toast, success, error, info, dismiss]
  );

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[130] flex flex-col gap-3 md:top-6">
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onClose={dismiss} />
        ))}
      </div>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within AdminToastProvider');
  }
  return context;
}
