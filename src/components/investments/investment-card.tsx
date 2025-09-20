import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Investment } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Building, Cpu, Landmark, Sprout, Tag } from 'lucide-react';

const sectorIcons = {
  Agriculture: <Sprout className="h-4 w-4" />,
  Technology: <Cpu className="h-4 w-4" />,
  'Real Estate': <Building className="h-4 w-4" />,
  Finance: <Landmark className="h-4 w-4" />,
  Other: <Tag className="h-4 w-4" />,
};

export default function InvestmentCard({ investment }: { investment: Investment }) {
  const placeholder = PlaceHolderImages.find((p) => p.id === investment.imageId);

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
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{investment.name}</CardTitle>
                <CardDescription>{investment.city}, {investment.country}</CardDescription>
            </div>
             <Badge variant="secondary" className="flex items-center gap-1.5 shrink-0">
                {sectorIcons[investment.sector]}
                {investment.sector}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {investment.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div>
            <p className="text-xs text-muted-foreground">Min. Investment</p>
            <p className="font-semibold">${investment.minInvestment.toLocaleString()}</p>
        </div>
        <Button>
          Invest Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
