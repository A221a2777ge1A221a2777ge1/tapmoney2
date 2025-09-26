import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { TonPayoutClient } from '@/lib/ton/client';

/**
 * Execute payouts (admin-only).
 * Body: { transfers: Array<{ toAddress: string; amount: number; comment?: string }> }
 */
export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const transfers: Array<{ toAddress: string; amount: number; comment?: string }> = body?.transfers || [];

    if (!Array.isArray(transfers) || transfers.length === 0) {
      return NextResponse.json({ error: 'No transfers provided' }, { status: 400 });
    }

    const client = new TonPayoutClient();
    const results = [] as any[];

    for (const t of transfers) {
      if (!t?.toAddress || typeof t?.amount !== 'number' || t.amount <= 0) {
        results.push({ ...t, status: 'skipped', error: 'Invalid transfer' });
        continue;
      }
      const res = await client.send(t.toAddress, t.amount, t.comment);
      results.push(res);
    }

    return NextResponse.json({ results });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}