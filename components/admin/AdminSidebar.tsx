'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import type { NavItem } from '@/lib/types';

// Icons as components for reusability
const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const WebsitesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const CreateIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Sidebar configuration
interface SidebarItem extends NavItem {
  children?: NavItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: <DashboardIcon className="w-5 h-5" />,
  },
  {
    name: 'Websites',
    href: '/admin/websites',
    icon: <WebsitesIcon className="w-5 h-5" />,
    children: [
      {
        name: 'Create Website',
        href: '/admin/websites/create',
        icon: <CreateIcon className="w-4 h-4" />,
      },
      {
        name: 'Archived Sites',
        href: '/admin/sites/archived',
        icon: <span className="w-4 h-4 inline-flex">🗄️</span>,
      },
    ],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: <SettingsIcon className="w-5 h-5" />,
  },
];

// Sidebar Toggle Button Component
interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function SidebarToggle({ isCollapsed, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        absolute -right-3 top-20 z-20
        flex items-center justify-center
        w-6 h-6 rounded-full
        bg-rose-600 text-white
        shadow-lg hover:bg-rose-700
        transition-all duration-300 ease-in-out
        hover:scale-110
        ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-0'}
      `}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? (
        <ChevronRightIcon className="w-4 h-4" />
      ) : (
        <ChevronLeftIcon className="w-4 h-4" />
      )}
    </button>
  );
}

// Sidebar Nav Item Component
interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function SidebarNavItem({ item, isActive, isCollapsed }: SidebarNavItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isCreateAction = item.href === '/admin/websites/create';
  const baseTextClass = isActive ? 'text-white' : isCreateAction ? 'text-slate-400' : 'text-slate-300';

  return (
    <li 
      className="relative"
      onMouseEnter={() => isCollapsed && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg
          transition-all duration-300 ease-in-out
          ${isActive
            ? 'bg-rose-600 text-white shadow-md'
            : isCreateAction
              ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }
          ${isCollapsed ? 'justify-center px-3' : ''}
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}>
          {item.icon}
        </span>
        <span
          className={`
            font-medium whitespace-nowrap overflow-hidden
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
            ${baseTextClass}
          `}
        >
          {item.name}
        </span>
      </Link>
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && showTooltip && (
        <div
          ref={tooltipRef}
          className="
            absolute left-full ml-2 top-1/2 -translate-y-1/2
            z-50 px-3 py-2 rounded-lg
            bg-slate-800 text-white text-sm
            shadow-xl whitespace-nowrap
            animate-fade-in
            pointer-events-none
          "
        >
          {item.name}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      )}
    </li>
  );
}

// Mobile Overlay Component
interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  return (
    <div
      className={`
        fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

// Main Admin Sidebar Component
interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onToggleMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session');
      document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Menu Button - Visible on small screens */}
      <button
        onClick={onToggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Open menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      <MobileOverlay isOpen={isMobileOpen} onClose={onToggleMobile} />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky lg:top-0 z-50
          bg-slate-900 h-screen flex flex-col
          text-white
          transition-all duration-300 ease-in-out
          shadow-xl
          ${isCollapsed ? 'w-20' : 'w-64'}
          -translate-x-full lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : ''}
        `}
        aria-label="Sidebar navigation"
      >
        {/* Toggle Button - Desktop only */}
        <div className="hidden lg:block">
          <SidebarToggle isCollapsed={isCollapsed} onToggle={onToggleCollapse} />
        </div>

        {/* Logo Section */}
        <div className={`p-6 border-b border-slate-800 transition-all duration-300 ${isCollapsed ? 'px-2 py-4' : ''}`}>
          <div className={`${isCollapsed ? 'text-center' : ''}`}>
            <h1 className={`font-bold text-white transition-all duration-300 ${isCollapsed ? 'text-lg' : 'text-xl'}`}>
              {isCollapsed ? 'KS' : 'KeyStory'}
            </h1>
            <p className={`text-sm text-slate-400 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
              Admin
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onToggleMobile}
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close menu"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <div key={item.name} className="space-y-1">
                  <SidebarNavItem
                    item={item}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                  />
                  {!isCollapsed && item.children?.length ? (
                    <ul className="ml-6 space-y-1">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href + '/');
                        return (
                          <SidebarNavItem
                            key={child.name}
                            item={child}
                            isActive={childActive}
                            isCollapsed={isCollapsed}
                          />
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t border-slate-800 transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-4 py-3 w-full rounded-lg
              text-slate-300 hover:bg-red-600 hover:text-white
              transition-all duration-300 ease-in-out
              ${isCollapsed ? 'justify-center px-3' : ''}
            `}
          >
            <LogoutIcon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`
                font-medium whitespace-nowrap overflow-hidden
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
              `}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

