import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pass = body?.pass;
  const expected = process.env.ADMIN_UI_PASS;
  if (!expected || pass !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', '1', { httpOnly: true, sameSite: 'lax', path: '/' });
  return res;
}