'use client';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  action?: {
    label: string;
    href: string;
  };
}

export default function DashboardStatCard({
  title,
  value,
  icon,
  iconBgColor = 'bg-rose-100',
  iconColor = 'text-rose-600',
  trend,
  action,
}: DashboardStatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          )}
          
          {action && (
            <a
              href={action.href}
              className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
            >
              {action.label}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}
        </div>
        
        <div className={`w-14 h-14 rounded-2xl ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Predefined stat card variants
export function TotalWebsitesCard({ count }: { count: number }) {
  return (
    <DashboardStatCard
      title="Total Websites"
      value={count}
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      }
      iconBgColor="bg-gradient-to-br from-rose-100 to-pink-100"
      iconColor="text-rose-600"
    />
  );
}

export function WebsitesThisMonthCard({ count }: { count: number }) {
  return (
    <DashboardStatCard
      title="Created This Month"
      value={count}
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      iconBgColor="bg-gradient-to-br from-blue-100 to-indigo-100"
      iconColor="text-blue-600"
    />
  );
}

export function PublishedWebsitesCard({ count }: { count: number }) {
  return (
    <DashboardStatCard
      title="Published Websites"
      value={count}
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      }
      iconBgColor="bg-gradient-to-br from-lime-100 to-emerald-100"
      iconColor="text-emerald-600"
    />
  );
}

// QuickActionsCard is no longer used in the dashboard
export function QuickActionsCard() {
  return (
    <DashboardStatCard
      title="Quick Actions"
      value="Create"
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      }
      iconBgColor="bg-gradient-to-br from-emerald-100 to-teal-100"
      iconColor="text-emerald-600"
      action={{
        label: 'Create New Website',
        href: '/admin/websites/create',
      }}
    />
  );
}

