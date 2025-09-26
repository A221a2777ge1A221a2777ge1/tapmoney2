'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pass }),
      });
      if (!res.ok) throw new Error('Invalid passphrase');
      window.location.href = '/admin';
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <Input type="password" placeholder="Admin passphrase" value={pass} onChange={e => setPass(e.target.value)} />
        <Button onClick={submit} disabled={busy}>Sign in</Button>
      </div>
    </div>
  );
}