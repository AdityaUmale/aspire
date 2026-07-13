import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AdminPageHeaderProps = {
  badge?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function AdminPageHeader({
  badge,
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="min-w-0 space-y-2">
        {badge ? (
          <div className="inline-flex items-center rounded-full border border-[#1a237e]/15 bg-white/90 px-3 py-1 text-xs font-medium text-[#1a237e] shadow-sm">
            <span className="mr-2 flex h-1.5 w-1.5 rounded-full bg-[#1a237e]" />
            {badge}
          </div>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-[#1a237e] lg:text-3xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600 lg:text-base">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
