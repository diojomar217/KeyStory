'use client';

import { useState } from 'react';
import Link from 'next/link';

// Icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface AdminHeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showCreateButton?: boolean;
  createButtonLabel?: string;
  createButtonHref?: string;
}

export default function AdminHeader({
  title,
  breadcrumbs,
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearch,
  showCreateButton = false,
  createButtonLabel = 'Create New',
  createButtonHref = '/admin/websites/create',
}: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Title & Breadcrumbs */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-1">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <span className="mx-1.5 text-slate-300">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-rose-600 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-slate-700 font-medium">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
            
            {/* Page Title */}
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 truncate">
              {title}
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search Bar */}
            {showSearch && (
              <div className="hidden md:block relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="w-64 pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Create Button */}
            {showCreateButton && (
              <Link
                href={createButtonHref}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-xl hover:from-rose-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{createButtonLabel}</span>
              </Link>
            )}

            {/* Notification Bell */}
            <button className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
              <BellIcon className="w-5 h-5" />
              {/* Optional notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-slate-700">Admin</p>
                <p className="text-xs text-slate-500">KeyStory</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                <UserIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden mt-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

