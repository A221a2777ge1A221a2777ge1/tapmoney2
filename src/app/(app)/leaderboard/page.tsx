'use client';

import LeaderboardList from "@/components/leaderboard/leaderboard-list";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { MOCK_USER } from "@/lib/data";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [updatedAt, setUpdatedAt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (cancelled) return;
        const top: { userId: string; total: number }[] = Array.isArray(data?.top) ? data.top : [];
        const mapped: User[] = top.map((t, i) => ({
          id: t.userId,
          name: t.userId,
          et: t.total,
          rank: i + 1,
          weeklyGrowth: 0,
        }));
        setUsers(mapped);
        setUpdatedAt(data?.updatedAt ?? null);
      } catch (e) {
        // fallback: empty list
        setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const formatUpdated = (val: any) => {
    if (!val) return 'unknown';
    if (typeof val === 'string') {
      const d = new Date(val);
      return isNaN(d.getTime()) ? 'unknown' : d.toLocaleString();
    }
    if (typeof val === 'object' && val?.seconds) {
      const d = new Date(val.seconds * 1000);
      return d.toLocaleString();
    }
    return 'unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Leaderboard</h2>
        <p className="text-muted-foreground">
          See who is leading the Evans Tycoon empire! The top 300 users are ranked here.
        </p>
        <p className="text-xs text-muted-foreground mt-1">Last updated: {formatUpdated(updatedAt)}</p>
      </div>
      <Separator />
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <LeaderboardList users={users} currentUser={MOCK_USER} />
      )}
    </div>
  );
}
