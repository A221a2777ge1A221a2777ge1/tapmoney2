import { NextResponse } from 'next/server';
import { INVESTMENT_OPPORTUNITIES } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ investments: INVESTMENT_OPPORTUNITIES });
}