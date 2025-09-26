import type { NextRequest } from 'next/server';

export function requireAdmin(req: NextRequest) {
  const token = req.headers.get('x-admin-api-token');
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected || token !== expected) {
    throw new Error('UNAUTHORIZED');
  }
}

export function getAdminTonAddress(): string {
  const addr = process.env.ADMIN_TON_ADDRESS;
  if (!addr) throw new Error('ADMIN_TON_ADDRESS not set');
  return addr;
}