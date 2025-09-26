import { config } from 'dotenv';
config();

import { LEADERBOARD_USERS } from '@/lib/data';
import { getWalletForUser } from '@/lib/store/userWallets';

function parseEnvNumber(name: string, def?: number): number {
  const raw = process.env[name];
  if (!raw || raw.trim() === '') {
    if (def !== undefined) return def;
    throw new Error(`Missing required env: ${name}`);
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`Invalid number for ${name}`);
  return n;
}

async function main() {
  const totalAmount = parseEnvNumber('TOTAL_AMOUNT');
  const topN = parseEnvNumber('TOP_N', 300);

  const ranked = LEADERBOARD_USERS
    .filter(u => typeof u.rank === 'number' && (u.rank as number) > 0)
    .sort((a, b) => (a.rank! - b.rank!));
  const eligible = ranked.slice(0, Math.min(topN, ranked.length));
  const count = eligible.length;
  if (count === 0) throw new Error('No eligible ranked users');

  const perUserAmount = totalAmount / count;
  const transfers = eligible.map(u => ({ userId: u.id, rank: u.rank!, amount: perUserAmount }));

  const resolved = [] as Array<{ userId: string; rank: number; amount: number; toAddress: string }>;
  const unresolved = [] as string[];
  for (const t of transfers) {
    const addr = getWalletForUser(t.userId);
    if (addr) resolved.push({ ...t, toAddress: addr }); else unresolved.push(t.userId);
  }

  const plan = { perUserAmount, count, topNUsed: Math.min(topN, ranked.length), transfers: resolved, unresolved };
  console.log(JSON.stringify(plan, null, 2));
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
