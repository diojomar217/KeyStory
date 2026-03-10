'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Initialize sidebar state from localStorage
  useEffect(() => {
    const storedCollapsed = localStorage.getItem('admin_sidebar_collapsed');
    if (storedCollapsed !== null) {
      setIsCollapsed(JSON.parse(storedCollapsed));
    }
  }, []);

  // Persist collapse state to localStorage
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(newState));
  };

  // Mobile sidebar toggle
  const handleToggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('admin_session');
        if (!session && pathname !== '/admin/login') {
          router.push('/admin/login');
        } else {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  // If on login page, don't show sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-100">
      {/* Sidebar - Fixed position on desktop, hidden when printing */}
      <div className="print:hidden flex-shrink-0">
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          isMobileOpen={isMobileOpen}
          onToggleMobile={handleToggleMobile}
        />
      </div>
      
      {/* Main Content Area - Scrollable */}
      <main 
        className={`
          flex-1 overflow-y-auto p-4 lg:p-8
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

