'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [topN, setTopN] = useState('300');
  const [plan, setPlan] = useState<any | null>(null);
  const [transfersJson, setTransfersJson] = useState('');
  const [execResult, setExecResult] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  const preview = async () => {
    setBusy(true);
    setPlan(null);
    try {
      const res = await fetch('/api/admin/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-token': token,
        },
        body: JSON.stringify({ totalAmount: Number(totalAmount), topN: Number(topN) || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setPlan(data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  const executePayouts = async () => {
    setBusy(true);
    setExecResult(null);
    try {
      let transfers: any;
      try { transfers = JSON.parse(transfersJson || '[]'); } catch { throw new Error('Invalid transfers JSON'); }
      const res = await fetch('/api/admin/execute-payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-token': token,
        },
        body: JSON.stringify({ transfers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setExecResult(data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Admin Controls</h2>
        <p className="text-muted-foreground">Preview and execute TON payouts. Provide your admin token for each action.</p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Preview Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input type="password" placeholder="Admin token" value={token} onChange={e => setToken(e.target.value)} />
            <Input type="number" placeholder="Total amount" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
            <Input type="number" placeholder="Top N (default 300)" value={topN} onChange={e => setTopN(e.target.value)} />
            <Button onClick={preview} disabled={busy}>Preview</Button>
          </div>
          {plan && (
            <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-96">{JSON.stringify(plan, null, 2)}</pre>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Execute Payouts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Provide an array of transfers: [{'{'} toAddress, amount, comment? {'}'}]</p>
          <Textarea rows={10} placeholder='[
  {"toAddress":"EQ...","amount":10,"comment":"weekly"}
]' value={transfersJson} onChange={e => setTransfersJson(e.target.value)} />
          <div className="flex gap-3">
            <Input type="password" placeholder="Admin token" value={token} onChange={e => setToken(e.target.value)} />
            <Button onClick={executePayouts} disabled={busy}>Execute</Button>
          </div>
          {execResult && (
            <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-96">{JSON.stringify(execResult, null, 2)}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}