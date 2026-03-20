'use server';

import { NextResponse } from 'next/server';
import { getBusinessContactSettings, upsertBusinessContactSettings } from '@/lib/business-contact-settings';

export async function GET() {
  try {
    const settings = await getBusinessContactSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch business settings', error);
    return NextResponse.json({ error: 'Unable to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await upsertBusinessContactSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to save business settings', error);
    return NextResponse.json({ error: 'Unable to save settings', details: (error as Error).message || 'unknown' }, { status: 500 });
  }
}
