'use server';

import { supabase } from './supabase';

export type BusinessContactSettings = {
  whatsappNumber: string | null;
  messengerUsername: string | null;
  messengerUrl: string | null;
  supportEmail: string | null;
  businessName: string | null;
  restorePriceLabel: string | null;
  facebookPageUrl: string | null;
  instagramUrl: string | null;
  supportMessageTemplate: string | null;
};

const envSettings: BusinessContactSettings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
  messengerUsername: process.env.NEXT_PUBLIC_MESSENGER_USERNAME || null,
  messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL || null,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || null,
  businessName: process.env.NEXT_PUBLIC_BUSINESS_DISPLAY_NAME || null,
  restorePriceLabel: process.env.NEXT_PUBLIC_RESTORE_PRICE_LABEL || 'Restore for only ₱49',
  facebookPageUrl: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL || null,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  supportMessageTemplate: process.env.NEXT_PUBLIC_SUPPORT_MESSAGE_TEMPLATE || null,
};

let inMemoryFallback: BusinessContactSettings | null = null;

export async function getBusinessContactSettings(): Promise<BusinessContactSettings> {
  // Prefer database-backed setting when available.
  let fallback = { ...envSettings, ...(inMemoryFallback || {}) };

  try {
    const { data, error } = await supabase
      .from('business_settings')
      .select(
        'whatsapp_number, messenger_username, messenger_url, support_email, business_name, restore_price_label, facebook_page_url, instagram_url, support_message_template'
      )
      .single();

    if (!error && data) {
      const settings: BusinessContactSettings = {
        whatsappNumber: data.whatsapp_number || fallback.whatsappNumber,
        messengerUsername: data.messenger_username || fallback.messengerUsername,
        messengerUrl: data.messenger_url || fallback.messengerUrl,
        supportEmail: data.support_email || fallback.supportEmail,
        businessName: data.business_name || fallback.businessName,
        restorePriceLabel: data.restore_price_label || fallback.restorePriceLabel,
        facebookPageUrl: data.facebook_page_url || fallback.facebookPageUrl,
        instagramUrl: data.instagram_url || fallback.instagramUrl,
        supportMessageTemplate: data.support_message_template || fallback.supportMessageTemplate,
      };

      return { ...settings, ...(inMemoryFallback || {}) };
    }

    // fallback to env-based settings if DB row missing or table absent
  } catch (error) {
    console.warn('Unable to load business contact settings from database, using env/fallback settings.', error);
    if (inMemoryFallback) {
      return { ...fallback, ...inMemoryFallback };
    }
  }

  return fallback;
}

export async function upsertBusinessContactSettings(settings: Partial<BusinessContactSettings>) {
  const payload = {
    whatsapp_number: settings.whatsappNumber || null,
    messenger_username: settings.messengerUsername || null,
    messenger_url: settings.messengerUrl || null,
    support_email: settings.supportEmail || null,
    business_name: settings.businessName || null,
    restore_price_label: settings.restorePriceLabel || null,
    facebook_page_url: settings.facebookPageUrl || null,
    instagram_url: settings.instagramUrl || null,
    support_message_template: settings.supportMessageTemplate || null,
  };

  try {
    const { data, error } = await supabase
      .from('business_settings')
      .upsert(payload, { onConflict: 'id' })
      .single();

    if (error) {
      throw error;
    }

    inMemoryFallback = {
      ...inMemoryFallback,
      whatsappNumber: payload.whatsapp_number,
      messengerUsername: payload.messenger_username,
      messengerUrl: payload.messenger_url,
      supportEmail: payload.support_email,
      businessName: payload.business_name,
      restorePriceLabel: payload.restore_price_label,
      facebookPageUrl: payload.facebook_page_url,
      instagramUrl: payload.instagram_url,
      supportMessageTemplate: payload.support_message_template,
    };

    return data;
  } catch (error) {
    console.error('Failed to upsert business contact settings, using in-memory fallback', error);

    inMemoryFallback = {
      ...inMemoryFallback,
      whatsappNumber: payload.whatsapp_number,
      messengerUsername: payload.messenger_username,
      messengerUrl: payload.messenger_url,
      supportEmail: payload.support_email,
      businessName: payload.business_name,
      restorePriceLabel: payload.restore_price_label,
      facebookPageUrl: payload.facebook_page_url,
      instagramUrl: payload.instagram_url,
      supportMessageTemplate: payload.support_message_template,
    };

    return inMemoryFallback;
  }
}


