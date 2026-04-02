import { supabase } from '@/lib/supabase';

export type IdempotencyReplay = {
  statusCode: number;
  response: Record<string, unknown>;
};

const TABLE = 'api_idempotency_keys';

const isMissingTableError = (error: any): boolean => {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('relation') && message.includes('does not exist');
};

export async function getIdempotencyReplay(
  scope: string,
  key: string,
  requestHash: string,
): Promise<IdempotencyReplay | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('request_hash, status_code, response_json')
      .eq('scope', scope)
      .eq('idempotency_key', key)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    if (data.request_hash !== requestHash) {
      throw new Error('Idempotency key reuse with a different payload is not allowed');
    }

    return {
      statusCode: Number(data.status_code || 200),
      response: (data.response_json || {}) as Record<string, unknown>,
    };
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

export async function saveIdempotencyResult(
  scope: string,
  key: string,
  requestHash: string,
  statusCode: number,
  response: Record<string, unknown>,
): Promise<void> {
  try {
    const payload = {
      scope,
      idempotency_key: key,
      request_hash: requestHash,
      status_code: statusCode,
      response_json: response,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'scope,idempotency_key' });

    if (error) throw error;
  } catch (error) {
    if (isMissingTableError(error)) return;
    throw error;
  }
}
