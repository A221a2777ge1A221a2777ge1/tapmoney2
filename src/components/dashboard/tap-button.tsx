'use client';

import { useState, useTransition, useRef, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTonWallet } from '@tonconnect/ui-react';

export default function TapButton({ initialTaps }: { initialTaps: number }) {
  const [localTaps, setLocalTaps] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const wallet = useTonWallet();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleTap = (event: MouseEvent<HTMLButtonElement>) => {
    // Animation handling
    const button = buttonRef.current;
    if (button) {
      button.classList.remove('tap-ripple');
      // This is a reflow trick to restart the animation
      void button.offsetWidth; 
      button.classList.add('tap-ripple');
    }

    setLocalTaps((prev) => prev + 1);

    startTransition(async () => {
      if (!wallet || !wallet.account) {
         toast({
          variant: 'destructive',
          title: 'Wallet not connected',
          description: 'Connect your TON wallet to save taps.',
        })
        return;
      }
      try {
        const userId = wallet.account.address;
        const res = await fetch('/api/flows/user-taps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, taps: 1 }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await res.json();
      } catch (e) {
         toast({
          variant: 'destructive',
          title: 'Oh no! A slip of the tap.',
          description: "We couldn't save your last tap. Please try again.",
        })
        // Rollback local state on error
        setLocalTaps(taps => taps - 1);
      }
    });
  };

  const displayTaps = initialTaps + localTaps;

  return (
    <div className="relative flex flex-col items-center">
      <button
        ref={buttonRef}
        onClick={handleTap}
        disabled={isPending}
        className={cn(
          'relative z-10 flex size-52 md:size-64 items-center justify-center rounded-full bg-gradient-to-br from-accent via-orange-500 to-yellow-400 text-accent-foreground shadow-2xl transition-transform duration-150 ease-in-out active:scale-95'
        )}
      >
        <div className="text-center">
          <span className="text-5xl md:text-6xl font-bold tracking-tighter">
            {displayTaps.toLocaleString()}
          </span>
          <span className="mt-1 block text-lg font-medium">ET</span>
        </div>
      </button>
      <div className="absolute -bottom-8 h-16 w-4/5 rounded-full bg-black/20 blur-2xl"></div>
    </div>
  );
}
