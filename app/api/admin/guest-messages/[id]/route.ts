import { NextRequest, NextResponse } from 'next/server';

import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import { deleteGuestMessage } from '@/lib/db/guestMessages';
import { captureError } from '@/lib/reliability/monitoring';
import { recordAdminAudit } from '@/lib/reliability/audit';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  const body = await req.json();
  const status = (body.status || '').toString().trim();

  if (!['approved', 'pending', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('guest_messages')
    .update({ status })
    .eq('id', id)
    .select('id, site_id, name, status')
    .single();

  if (error) {
    await captureError('admin-guest-message-patch', error, { id, status });
    await recordAdminAudit(req, {
      action: 'admin.guest_message.update_status',
      targetType: 'guest_message',
      targetId: id,
      success: false,
      details: { status, error: error.message },
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await recordAdminAudit(req, {
    action: 'admin.guest_message.update_status',
    targetType: 'guest_message',
    targetId: id,
    success: true,
    details: {
      site_id: data?.site_id || null,
      name: data?.name || null,
      status,
    },
  });

  return NextResponse.json({ success: true, message: data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  try {
    const { data: existingMessage, error: existingMessageError } = await supabase
      .from('guest_messages')
      .select('id, site_id, name, status')
      .eq('id', id)
      .maybeSingle();

    if (existingMessageError) {
      await captureError('admin-guest-message-delete-lookup', existingMessageError, { id });
    }

    await deleteGuestMessage(id);

    await recordAdminAudit(req, {
      action: 'admin.guest_message.delete',
      targetType: 'guest_message',
      targetId: id,
      success: true,
      details: {
        site_id: existingMessage?.site_id || null,
        name: existingMessage?.name || null,
        previous_status: existingMessage?.status || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    await captureError('admin-guest-message-delete', error, { id });
    await recordAdminAudit(req, {
      action: 'admin.guest_message.delete',
      targetType: 'guest_message',
      targetId: id,
      success: false,
      details: { error: (error as Error).message },
    });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
