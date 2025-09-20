import PortfolioPositionCard from '@/components/portfolio/portfolio-position-card';
import { USER_PORTFOLIO } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PortfolioPage() {
  const totalInvested = USER_PORTFOLIO.reduce((acc, pos) => acc + pos.amountInvested, 0);
  const currentValue = USER_PORTFOLIO.reduce((acc, pos) => acc + pos.currentValue, 0);
  const totalReturn = currentValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-2xl font-bold">${currentValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Return</p>
              <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${totalReturn.toLocaleString()} ({returnPercentage.toFixed(2)}%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight font-headline mb-4">Your Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USER_PORTFOLIO.map((position) => (
            <PortfolioPositionCard key={position.id} position={position} />
          ))}
        </div>
      </div>
    </div>
  );
}
