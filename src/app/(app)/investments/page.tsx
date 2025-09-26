'use client';

import InvestmentCard from '@/components/investments/investment-card';
import InvestmentFilters from '@/components/investments/investment-filters';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import type { Investment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function InvestmentSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvestments() {
      try {
        setLoading(true);
        const res = await fetch('/api/flows/investments', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setInvestments(data.investments as Investment[]);
      } catch (error) {
        console.error('Failed to load investments:', error);
        // Handle error, e.g., show a toast
      } finally {
        setLoading(false);
      }
    }
    loadInvestments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">
          Explore and invest in a curated list of opportunities across Africa.
          Use the filters to find investments that match your interests.
        </p>
      </div>
      <InvestmentFilters />
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
            Array.from({length: 6}).map((_, i) => <InvestmentSkeleton key={i} />)
        ) : (
            investments.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
            ))
        )}
      </div>
    </div>
  );
}
