import type { ElementType } from 'react';
import {
  BarChart3,
  BookOpen,
  CalendarPlus,
  FilePlus2,
  Inbox,
  Share2,
} from 'lucide-react';

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: ElementType;
  /** Exact match only (dashboard home). */
  exact?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: '/admin',
    label: 'Overview',
    description: 'Stats & courses',
    icon: BarChart3,
    exact: true,
  },
  {
    href: '/admin/courses',
    label: 'Upcoming Courses',
    description: 'Import or add',
    icon: CalendarPlus,
  },
  {
    href: '/admin/articles',
    label: 'Founder Articles',
    description: 'Publish & manage',
    icon: FilePlus2,
  },
  {
    href: '/admin/review-articles',
    label: 'Review Articles',
    description: 'Student submissions',
    icon: BookOpen,
  },
  {
    href: '/admin/review-enquiries',
    label: 'Enquiries',
    description: 'Contact form inbox',
    icon: Inbox,
  },
  {
    href: '/admin/social-posts',
    label: 'Social Embeds',
    description: 'Homepage posts',
    icon: Share2,
  },
];

export function isAdminNavActive(pathname: string, item: AdminNavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
