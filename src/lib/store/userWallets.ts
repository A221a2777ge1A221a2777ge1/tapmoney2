import fs from 'fs';
import path from 'path';

export type UserWalletMapping = { userId: string; address: string };

type StoreShape = Record<string, string>; // userId -> address

function dataDir() {
  return path.join(process.cwd(), '.data');
}

function storePath() {
  return path.join(dataDir(), 'user-wallets.json');
}

function ensureStore() {
  const dir = dataDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = storePath();
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}), 'utf8');
}

export function getAllMappings(): StoreShape {
  ensureStore();
  const raw = fs.readFileSync(storePath(), 'utf8');
  try {
    return JSON.parse(raw) as StoreShape;
  } catch {
    return {};
  }
}

export function setMappings(mappings: UserWalletMapping[]) {
  ensureStore();
  const existing = getAllMappings();
  for (const m of mappings) {
    if (!m.userId || !m.address) continue;
    existing[m.userId] = m.address;
  }
  fs.writeFileSync(storePath(), JSON.stringify(existing, null, 2), 'utf8');
}

export function getWalletForUser(userId: string): string | undefined {
  const all = getAllMappings();
  return all[userId];
}