import { NextResponse } from 'next/server';
import { INVESTMENT_OPPORTUNITIES } from '@/lib/data';

export async function GET() {
  const res = NextResponse.json({ investments: INVESTMENT_OPPORTUNITIES });
  // Allow client/proxy caching to reduce repeated calls
  res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
  return res;
}
