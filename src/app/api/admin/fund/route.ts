import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getAdminTonAddress } from '@/lib/admin';

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const { amount } = await req.json();
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    const adminAddress = getAdminTonAddress();
    // Stub: this acknowledges funding intent; real funding is an on-chain transfer into adminAddress.
    return NextResponse.json({ status: 'acknowledged', adminAddress, amount });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}