import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

try { admin.initializeApp(); } catch {}
const db = admin.firestore();

// HTTP-triggered stub to aggregate all users' tap shard totals into leaderboard collection.
export const aggregateOnce = functions.https.onRequest(async (req, res) => {
  try {
    const usersSnap = await db.collection('users').get();
    let count = 0;
    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const shardsSnap = await db.collection('users').doc(userId).collection('tapShards').get();
      let total = 0;
      shardsSnap.forEach((d) => {
        const data = d.data();
        if (typeof data?.count === 'number') total += data.count;
      });
      await db.collection('leaderboard').doc(userId).set({ total, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      count++;
    }

    // Compute top 300 by total
    const lbSnap = await db.collection('leaderboard').get();
    const entries: Array<{ userId: string; total: number }> = [];
    lbSnap.forEach((doc) => {
      const data = doc.data();
      const total = typeof data?.total === 'number' ? data.total : 0;
      entries.push({ userId: doc.id, total });
    });
    entries.sort((a, b) => b.total - a.total);
    const top = entries.slice(0, 300);
    await db.collection('leaderboardTop').doc('current').set({ updatedAt: admin.firestore.FieldValue.serverTimestamp(), top }, { merge: true });

    res.json({ ok: true, updated: count, topCount: top.length });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'aggregation failed' });
  }
});

// Scheduled stub (every 5 minutes) to aggregate
export const aggregateScheduled = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  const usersSnap = await db.collection('users').get();
  for (const userDoc of usersSnap.docs) {
    const userId = userDoc.id;
    const shardsSnap = await db.collection('users').doc(userId).collection('tapShards').get();
    let total = 0;
    shardsSnap.forEach((d) => {
      const data = d.data();
      if (typeof data?.count === 'number') total += data.count;
    });
    await db.collection('leaderboard').doc(userId).set({ total, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  }
  const lbSnap = await db.collection('leaderboard').get();
  const entries: Array<{ userId: string; total: number }> = [];
  lbSnap.forEach((doc) => {
    const data = doc.data();
    const total = typeof data?.total === 'number' ? data.total : 0;
    entries.push({ userId: doc.id, total });
  });
  entries.sort((a, b) => b.total - a.total);
  const top = entries.slice(0, 300);
  await db.collection('leaderboardTop').doc('current').set({ updatedAt: admin.firestore.FieldValue.serverTimestamp(), top }, { merge: true });
});
