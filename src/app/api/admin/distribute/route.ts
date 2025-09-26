import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { LEADERBOARD_USERS } from '@/lib/data';
import { getWalletForUser } from '@/lib/store/userWallets';

/**
 * Admin-only distribution plan generator.
 * Input: { totalAmount: number, topN?: number }
 * Output: { perUserAmount, count, topNUsed, transfers: [{ userId, rank, amount }] }
 */
export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const totalAmount = Number(body?.totalAmount);
    const topN = typeof body?.topN === 'number' ? body.topN : 300;
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid totalAmount' }, { status: 400 });
    }

    const ranked = LEADERBOARD_USERS
      .filter(u => typeof u.rank === 'number' && (u.rank as number) > 0)
      .sort((a, b) => (a.rank! - b.rank!));
    const eligible = ranked.slice(0, Math.min(topN, ranked.length));
    const count = eligible.length;
    if (count === 0) {
      return NextResponse.json({ error: 'No eligible ranked users' }, { status: 400 });
    }

    const perUserAmount = totalAmount / count;
    const transfers = eligible.map(u => ({ userId: u.id, rank: u.rank!, amount: perUserAmount }));

    // Resolve addresses from mapping store
    const resolved = [] as Array<{ userId: string; rank: number; amount: number; toAddress: string }>
    const unresolved = [] as string[];
    for (const t of transfers) {
      const addr = getWalletForUser(t.userId);
      if (addr) resolved.push({ ...t, toAddress: addr }); else unresolved.push(t.userId);
    }

    return NextResponse.json({ perUserAmount, count, topNUsed: Math.min(topN, ranked.length), transfers: resolved, unresolved });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}