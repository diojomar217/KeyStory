import { NextResponse } from 'next/server';
import { getBusinessContactSettings } from '@/lib/business-contact-settings';

export async function GET() {
  try {
    const settings = await getBusinessContactSettings();

    return NextResponse.json({
      businessName: settings.businessName,
      whatsappNumber: settings.whatsappNumber,
      messengerUsername: settings.messengerUsername,
      messengerUrl: settings.messengerUrl,
      shopeeStoreUrl: settings.shopeeStoreUrl,
      tiktokShopUrl: settings.tiktokShopUrl,
      lazadaStoreUrl: settings.lazadaStoreUrl,
      facebookPageUrl: settings.facebookPageUrl,
      instagramUrl: settings.instagramUrl,
    });
  } catch (error) {
    console.error('Error loading public business settings:', error);
    return NextResponse.json(
      { error: 'Failed to load business settings' },
      { status: 500 }
    );
  }
}
