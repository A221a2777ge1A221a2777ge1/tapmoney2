import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TapButton from '@/components/dashboard/tap-button';
import { MOCK_USER } from '@/lib/data';
import { Hand, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const user = MOCK_USER;

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 w-full max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ET</CardTitle>
            <Hand className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.et.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Keep tapping to climb the ranks!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +${user.weeklyGrowth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From your investments this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <TapButton initialTaps={user.et} />
      </div>
    </div>
  );
}
