import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { PortfolioPosition } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

export default function PortfolioPositionCard({ position }: { position: PortfolioPosition }) {
  const { investment, amountInvested, currentValue } = position;
  const placeholder = PlaceHolderImages.find((p) => p.id === investment.imageId);

  const profitLoss = currentValue - amountInvested;
  const returnPercentage = (profitLoss / amountInvested) * 100;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        {placeholder && (
          <div className="aspect-video relative w-full overflow-hidden rounded-md mb-4">
            <Image
              src={placeholder.imageUrl}
              alt={investment.name}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
          </div>
        )}
        <CardTitle>{investment.name}</CardTitle>
        <CardDescription>
          {investment.sector} in {investment.city}, {investment.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Amount Invested</p>
          <p className="font-semibold">${amountInvested.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current Value</p>
          <p className="font-semibold">${currentValue.toLocaleString()}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Badge
          variant={returnPercentage >= 0 ? 'default' : 'destructive'}
          className={returnPercentage >= 0 ? 'bg-green-600/20 text-green-400 border-green-600/30' : ''}
        >
          <ArrowUpRight className="h-4 w-4 mr-1" />
          {returnPercentage.toFixed(2)}% Return
        </Badge>
      </CardFooter>
    </Card>
  );
}
