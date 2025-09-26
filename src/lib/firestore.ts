import { app } from '@/lib/firebase';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  increment as fsIncrement,
  collection,
  getDocs,
} from 'firebase/firestore';

export const db = getFirestore(app);

// Number of shards to reduce contention on hot counters.
const DEFAULT_SHARDS = 20;

export async function addTapsToShard(userId: string, taps: number, shardCount: number = DEFAULT_SHARDS) {
  if (taps <= 0) return;
  const shardIndex = Math.floor(Math.random() * shardCount);
  const shardRef = doc(db, 'users', userId, 'tapShards', String(shardIndex));
  // Ensure anchor user doc exists for aggregation listing
  await setDoc(doc(db, 'users', userId), { exists: true }, { merge: true });
  // Ensure shard doc exists then increment
  await setDoc(shardRef, { count: 0 }, { merge: true });
  await updateDoc(shardRef, { count: fsIncrement(taps) });
}

export async function sumUserTaps(userId: string): Promise<number> {
  const shardsCol = collection(db, 'users', userId, 'tapShards');
  const snap = await getDocs(shardsCol);
  let total = 0;
  snap.forEach((d) => {
    const data = d.data() as any;
    if (typeof data?.count === 'number') total += data.count;
  });
  return total;
}