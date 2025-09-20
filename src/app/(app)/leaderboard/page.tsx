import LeaderboardList from "@/components/leaderboard/leaderboard-list";
import { LEADERBOARD_USERS, MOCK_USER } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export default function LeaderboardPage() {
  // Add the current user to the list if they aren't in the top 50
  const users = [...LEADERBOARD_USERS];
  if (!users.find(u => u.id === MOCK_USER.id)) {
    users.push(MOCK_USER);
  }
  users.sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Leaderboard</h2>
        <p className="text-muted-foreground">
          See who is leading the Evans Tycoon empire! The top 300 users are ranked here.
        </p>
      </div>
      <Separator />
      <LeaderboardList users={users} currentUser={MOCK_USER} />
    </div>
  );
}
