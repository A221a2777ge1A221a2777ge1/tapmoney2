import { NextRequest, NextResponse } from 'next/server';

// TON payout stub endpoint.
// In production, this should send a transfer from a custodial wallet managed on the server.
// This stub validates input and returns a queued response.
export async function POST(req: NextRequest) {
  try {
    const { toAddress, amount, comment } = await req.json();
    if (!toAddress || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    return NextResponse.json({
      status: 'queued',
      toAddress,
      amount,
      comment: comment ?? null,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}