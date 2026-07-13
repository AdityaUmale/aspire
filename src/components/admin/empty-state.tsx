import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AdminEmptyStateProps = {
  icon: ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1a237e]/15 bg-white/70 px-6 py-12 text-center shadow-sm',
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#1a237e]">
        <Icon className="h-7 w-7 opacity-80" />
      </div>
      <p className="text-base font-semibold text-gray-800">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
