
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, TrendingUp, Trophy } from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'EVANS TYCOON' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/investments', icon: Briefcase, label: 'Investments' },
  { href: '/portfolio', icon: TrendingUp, label: 'Portfolio' },
];

function BottomNavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground transition-colors',
              pathname.startsWith(item.href)
                ? 'text-primary'
                : 'hover:text-foreground'
            )}
          >
            <item.icon className="size-5" />
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeNavItem = navItems.find((item) =>
    pathname.startsWith(item.href)
  );
  const activeLabel = activeNavItem?.label;
  const isTycoonHome = activeNavItem?.href === '/dashboard';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4">
        <div className="flex-1 text-center">
          <h1 className={cn(
            "font-headline text-lg font-semibold md:text-xl",
            isTycoonHome && "text-3xl font-extrabold tracking-tight text-accent"
          )}>
            {activeLabel}
          </h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 pb-20 sm:p-6">
        {children}
      </main>
      <BottomNavBar />
    </>
  );
}
