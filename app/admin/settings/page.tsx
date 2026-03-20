'use client';

import AdminHeader from '@/components/admin/AdminHeader';
import BusinessSettingsForm from '@/components/admin/BusinessSettingsForm';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Settings" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Settings</h2>
          
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="pb-6 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-4">Profile</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div>
                  <p className="font-medium text-slate-900">Admin</p>
                  <p className="text-sm text-slate-500">Administrator</p>
                </div>
              </div>
            </div>

            {/* Site Settings */}
            <div className="pb-6 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-4">Site Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Site Name</label>
                  <input 
                    type="text" 
                    defaultValue="KeyStory"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Admin Email</label>
                  <input 
                    type="email" 
                    defaultValue="admin@keystory.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className="pb-6 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-4">Business Contact Settings</h3>
              <div>
                <p className="text-sm text-slate-500">Manage your restore contact channels for archived/expired pages.</p>
                <div className="mt-4">
                  <BusinessSettingsForm />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-4">Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-700">Email notifications for new websites</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-700">Email notifications for deletions</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-xl hover:from-rose-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

