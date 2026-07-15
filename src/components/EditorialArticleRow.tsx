import Link from 'next/link';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type EditorialArticleRowProps = {
  title: string;
  description?: string | null;
  coverImage?: string | null;
  href?: string;
  metadata?: ReactNode;
  note?: ReactNode;
  actions?: ReactNode;
  dense?: boolean;
  className?: string;
};

function ArticleText({
  title,
  description,
}: Pick<EditorialArticleRowProps, 'title' | 'description'>) {
  return (
    <>
      <h2 className="line-clamp-2 text-[21px] font-semibold leading-[1.25] tracking-[-0.025em] text-slate-950 transition-colors group-hover:text-[#1a237e] md:text-[24px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 line-clamp-2 max-w-[62ch] text-sm leading-6 text-slate-500 md:text-[15px]">
          {description}
        </p>
      ) : null}
    </>
  );
}

function ArticleCover({
  title,
  coverImage,
  href,
  dense,
}: Pick<EditorialArticleRowProps, 'title' | 'coverImage' | 'href' | 'dense'>) {
  if (!coverImage) return null;

  const className = cn(
    'relative w-28 overflow-hidden rounded-lg bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a237e]/30 md:w-[190px]',
    dense ? 'h-[82px] md:h-[112px]' : 'h-[88px] md:h-[126px]'
  );
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={coverImage}
      alt=""
      className={cn(
        'absolute inset-0 h-full w-full object-cover',
        href && 'transition duration-500 ease-out group-hover:scale-[1.025]'
      )}
      loading="lazy"
      decoding="async"
    />
  );

  if (!href) return <div className={className}>{image}</div>;

  return (
    <Link href={href} className={className} aria-label={`Open ${title}`}>
      {image}
    </Link>
  );
}

export function EditorialArticleRow({
  title,
  description,
  coverImage,
  href,
  metadata,
  note,
  actions,
  dense = false,
  className,
}: EditorialArticleRowProps) {
  const text = <ArticleText title={title} description={description} />;

  return (
    <article
      className={cn('group', dense ? 'py-6' : 'py-8 md:py-9', className)}
    >
      <div
        className={cn(
          coverImage &&
            'grid grid-cols-[minmax(0,1fr)_112px] gap-5 md:grid-cols-[minmax(0,1fr)_190px] md:gap-10'
        )}
      >
        <div className="min-w-0">
          {metadata ? (
            <div className="mb-3 flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
              {metadata}
            </div>
          ) : null}

          {href ? (
            <Link href={href} className="block max-w-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a237e]/30">
              {text}
            </Link>
          ) : (
            <div className="max-w-2xl">{text}</div>
          )}

          {note ? <div className="mt-4">{note}</div> : null}
          {actions ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>

        <ArticleCover
          title={title}
          coverImage={coverImage}
          href={href}
          dense={dense}
        />
      </div>
    </article>
  );
}

export function EditorialArticleRowSkeleton({ dense = false }: { dense?: boolean }) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_112px] gap-5 md:grid-cols-[1fr_190px] md:gap-10',
        dense ? 'py-6' : 'py-8'
      )}
    >
      <div className="space-y-3">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-7 w-4/5 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-9 w-64 max-w-full rounded-full" />
      </div>
      <Skeleton
        className={cn(
          'w-28 rounded-lg md:w-[190px]',
          dense ? 'h-[82px] md:h-[112px]' : 'h-[88px] md:h-[126px]'
        )}
      />
    </div>
  );
}
