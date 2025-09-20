'use client';

import type { User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useState, useTransition } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

const PAGE_SIZE = 10;

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="relative">
        <Crown className="size-8 text-yellow-400 fill-yellow-400" />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">1</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="relative">
        <Medal className="size-7 text-gray-400 fill-gray-400" />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="relative">
        <Trophy className="size-6 text-orange-400 fill-orange-400" />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">3</span>
      </div>
    );
  }
  return <div className="text-lg font-bold text-muted-foreground">#{rank}</div>;
}

export default function LeaderboardList({ users, currentUser }: { users: User[], currentUser: User }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, startRefresh] = useTransition();

  const totalPages = Math.ceil(users.length / PAGE_SIZE);

  const handleRefresh = () => {
    startRefresh(async () => {
      // In a real app, this would re-fetch data from the server.
      await new Promise(resolve => setTimeout(resolve, 750));
    });
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Top Tycoons</h3>
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                <span className="sr-only">Refresh</span>
            </Button>
        </div>
        <div className="space-y-2">
            {currentUsers.map((user) => (
            <Card
                key={user.id}
                className={cn(
                'transition-all',
                user.id === currentUser.id && 'border-primary ring-2 ring-primary'
                )}
            >
                <CardContent className="p-3 flex items-center gap-4">
                <div className="w-10 flex items-center justify-center">
                    {user.rank ? <RankBadge rank={user.rank} /> : <div className="text-lg font-bold text-muted-foreground">--</div>}
                </div>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.id}`} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.et.toLocaleString()} ET</p>
                </div>
                </CardContent>
            </Card>
            ))}
      </div>
      <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
    </div>
  );
}
