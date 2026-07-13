'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Menu, Shield, X } from 'lucide-react';
import { AdminToastProvider } from '@/components/admin/admin-toast';
import { ADMIN_NAV, isAdminNavActive } from '@/components/admin/nav-config';
import { cn } from '@/lib/utils';

function NavLink({
  href,
  label,
  description,
  icon: Icon,
  active,
  onNavigate,
  compact,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
  active: boolean;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
        active
          ? 'bg-[#1a237e] text-white shadow-md shadow-[#1a237e]/20'
          : 'text-gray-600 hover:bg-[#eef2ff] hover:text-[#1a237e]'
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
          active ? 'bg-white/15 text-white' : 'bg-[#eef2ff] text-[#1a237e] group-hover:bg-white'
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className={cn('block text-sm font-semibold leading-tight', compact && 'text-[13px]')}>
          {label}
        </span>
        {!compact ? (
          <span
            className={cn(
              'mt-0.5 block truncate text-[11px] leading-tight',
              active ? 'text-white/70' : 'text-gray-400'
            )}
          >
            {description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
  compact,
}: {
  pathname: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <>
      <div className="mb-6 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a237e] to-[#3949ab] text-white shadow-md shadow-[#1a237e]/25">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-[#1a237e]">Aspire Admin</p>
          <p className="truncate text-[11px] text-gray-400">Content control panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Admin">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            description={item.description}
            icon={item.icon}
            active={isAdminNavActive(pathname, item)}
            onNavigate={onNavigate}
            compact={compact}
          />
        ))}
      </nav>

      <div className="mt-6 border-t border-[#1a237e]/10 pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#1a237e]"
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </Link>
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const activeItem = ADMIN_NAV.find((item) => isAdminNavActive(pathname, item));

  return (
    <AdminToastProvider>
      <div className="relative min-h-screen bg-[#f4f6fb]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] via-[#eef1fb] to-[#dce3f8]" />
          <div className="absolute -right-20 top-0 h-[480px] w-[480px] rounded-full bg-[#1a237e]/[0.06] blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[#3949ab]/[0.08] blur-3xl" />
        </div>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-[#1a237e]/10 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1a237e]/10 bg-white text-[#1a237e] shadow-sm transition-colors hover:bg-[#eef2ff]"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1a237e]">
              {activeItem?.label ?? 'Admin'}
            </p>
            <p className="truncate text-[11px] text-gray-400">
              {activeItem?.description ?? 'Dashboard'}
            </p>
          </div>
        </header>

        <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-[1400px] lg:min-h-screen">
          {/* Desktop sidebar */}
          <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-[#1a237e]/10 bg-white/80 p-5 backdrop-blur-md lg:flex">
            <SidebarContent pathname={pathname} />
          </aside>

          {/* Mobile drawer */}
          <div
            className={cn(
              'fixed inset-0 z-50 lg:hidden',
              sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
            )}
          >
            <div
              className={cn(
                'absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300',
                sidebarOpen ? 'opacity-100' : 'opacity-0'
              )}
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
            <aside
              className={cn(
                'absolute inset-y-0 left-0 flex w-[min(100vw-3rem,18rem)] flex-col bg-white p-5 shadow-2xl transition-transform duration-300 ease-out',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              )}
              aria-hidden={!sidebarOpen}
            >
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Close admin menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent
                pathname={pathname}
                onNavigate={() => setSidebarOpen(false)}
                compact
              />
            </aside>
          </div>

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminToastProvider>
  );
}
