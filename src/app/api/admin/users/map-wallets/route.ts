import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { setMappings, type UserWalletMapping } from '@/lib/store/userWallets';

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const mappings: UserWalletMapping[] = body?.mappings || [];
    if (!Array.isArray(mappings) || mappings.length === 0) {
      return NextResponse.json({ error: 'mappings array required' }, { status: 400 });
    }
    const valid = mappings.filter(m => typeof m?.userId === 'string' && typeof m?.address === 'string');
    if (valid.length === 0) {
      return NextResponse.json({ error: 'no valid mappings' }, { status: 400 });
    }
    setMappings(valid);
    return NextResponse.json({ status: 'ok', count: valid.length });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}