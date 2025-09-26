import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/ai/flows/auth-flow';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ error: 'address required' }, { status: 400 });
    }
    const token = await getAuthToken({ address });
    return NextResponse.json({ token });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to issue token' }, { status: 500 });
  }
}