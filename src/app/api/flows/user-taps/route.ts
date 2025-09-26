import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, taps } = await req.json();
    if (!userId || typeof taps !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    // Mock new total based on a fixed current value (replace with DB logic when available)
    const MOCK_CURRENT_ET = 12345;
    const newTotal = MOCK_CURRENT_ET + taps;
    return NextResponse.json({ newTotal });
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}