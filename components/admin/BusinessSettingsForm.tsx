'use client';

import { useEffect, useState } from 'react';
import { BusinessContactSettings } from '@/lib/business-contact-settings';

const INITIAL_STATE: BusinessContactSettings = {
  whatsappNumber: null,
  messengerUsername: null,
  messengerUrl: null,
  supportEmail: null,
  businessName: null,
  restorePriceLabel: 'Restore for only ₱49',
  shopeeStoreUrl: 'https://shopee.ph/',
  tiktokShopUrl: 'https://www.tiktok.com/',
  lazadaStoreUrl: 'https://www.lazada.com.ph/',
  facebookPageUrl: null,
  instagramUrl: null,
  supportMessageTemplate: null,
  analyticsEnabled: true,
};

export default function BusinessSettingsForm() {
  const [settings, setSettings] = useState<BusinessContactSettings>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/business-settings', { method: 'GET' });
        const data = await res.json();
        setSettings({ ...INITIAL_STATE, ...data });
      } catch (err) {
        console.error('Error loading settings', err);
        setStatus('Unable to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: keyof BusinessContactSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value || null }));
  };

  const handleBoolChange = (key: keyof BusinessContactSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/business-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const details = (errorBody as any).details || (errorBody as any).error || 'Save failed';
        throw new Error(details);
      }

      setStatus('Settings saved successfully.');
    } catch (err) {
      console.error('Failed to save settings', err);
      setStatus(`Failed to save settings: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Business Contact Settings</h2>

        {loading ? (
          <p className="text-sm text-slate-500">Loading settings…</p>
        ) : (
          <form onSubmit={save} className="space-y-4">
            {status && <p className="text-sm text-rose-600">{status}</p>}

            <div>
              <label className="block text-sm text-slate-600 mb-1">Business Name</label>
              <input
                value={settings.businessName ?? ''}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">WhatsApp Number</label>
              <input
                value={settings.whatsappNumber ?? ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="639XXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Messenger Username</label>
              <input
                value={settings.messengerUsername ?? ''}
                onChange={(e) => handleChange('messengerUsername', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="page.username"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Messenger URL</label>
              <input
                value={settings.messengerUrl ?? ''}
                onChange={(e) => handleChange('messengerUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="https://m.me/page.username"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail ?? ''}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="support@company.com"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Restore Price Label</label>
              <input
                value={settings.restorePriceLabel ?? ''}
                onChange={(e) => handleChange('restorePriceLabel', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Restore for only ₱49"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Shopee Store URL</label>
              <input
                value={settings.shopeeStoreUrl ?? ''}
                onChange={(e) => handleChange('shopeeStoreUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="https://shopee.ph/your-store"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">TikTok Shop URL</label>
              <input
                value={settings.tiktokShopUrl ?? ''}
                onChange={(e) => handleChange('tiktokShopUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="https://www.tiktok.com/@your-store"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Lazada Store URL</label>
              <input
                value={settings.lazadaStoreUrl ?? ''}
                onChange={(e) => handleChange('lazadaStoreUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="https://www.lazada.com.ph/shop/your-store"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Facebook Page URL</label>
              <input
                value={settings.facebookPageUrl ?? ''}
                onChange={(e) => handleChange('facebookPageUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="https://facebook.com/your-page"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Instagram URL</label>
              <input
                value={settings.instagramUrl ?? ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="https://instagram.com/your-profile"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Support Message Template</label>
              <input
                value={settings.supportMessageTemplate ?? ''}
                onChange={(e) => handleChange('supportMessageTemplate', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Hi! I want to restore my website (slug: {slug})"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!settings.analyticsEnabled}
                  onChange={(e) => handleBoolChange('analyticsEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-slate-700">Enable Web Analytics (global)</span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-xl hover:from-rose-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Contact Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
