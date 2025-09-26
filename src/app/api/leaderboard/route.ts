import { NextResponse } from 'next/server';
import { app } from '@/lib/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(app);

export async function GET() {
  try {
    const ref = doc(db, 'leaderboardTop', 'current');
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : { top: [], updatedAt: null };
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res;
  } catch (e) {
    return NextResponse.json({ top: [], updatedAt: null }, { status: 200 });
  }
}