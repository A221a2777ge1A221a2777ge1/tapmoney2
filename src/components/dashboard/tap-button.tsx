'use client';

import { useEffect, useRef, useState, useTransition, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTonWallet } from '@tonconnect/ui-react';
import { addTapsToShard } from '@/lib/firestore';

export default function TapButton({ initialTaps }: { initialTaps: number }) {
  const [localTaps, setLocalTaps] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const wallet = useTonWallet();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Batch flush state
  const pendingRef = useRef(0);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleFlush = () => {
    if (flushTimerRef.current) return; // already scheduled
    flushTimerRef.current = setTimeout(async () => {
      flushTimerRef.current = null;
      const count = pendingRef.current;
      if (count <= 0) return;
      pendingRef.current = 0;
      startTransition(async () => {
        if (!wallet || !wallet.account) {
          toast({
            variant: 'destructive',
            title: 'Wallet not connected',
            description: 'Connect your TON wallet to save taps.',
          });
          // roll back visual count if we never saved any taps (optional: keep optimistic)
          setLocalTaps((t) => Math.max(0, t - count));
          return;
        }
        try {
          const userId = wallet.account.address;
          await addTapsToShard(userId, count);
        } catch (e) {
          toast({
            variant: 'destructive',
            title: 'Oh no! A slip of the tap.',
            description: "We couldn't save some taps. Please try again.",
          });
          // Rollback local state on error
          setLocalTaps((t) => Math.max(0, t - count));
        }
      });
    }, 500); // debounce window
  };

  // Flush on unmount, unload, or when the page goes to background (visibility change)
  useEffect(() => {
    const flushNow = () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      const count = pendingRef.current;
      if (count <= 0) return;
      pendingRef.current = 0;
      // Fire and forget; don't block unload
      (async () => {
        if (!wallet || !wallet.account) {
          setLocalTaps((t) => Math.max(0, t - count));
          return;
        }
        try {
          const userId = wallet.account.address;
          // Write directly to Firestore shard (client SDK) for low latency and reduced server hops
          await addTapsToShard(userId, count);
        } catch {
          setLocalTaps((t) => Math.max(0, t - count));
        }
      })();
    };

    const beforeUnload = () => flushNow();
    const visibilityHandler = () => {
      if (document.hidden) flushNow();
    };

    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('visibilitychange', visibilityHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('visibilitychange', visibilityHandler);
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, [wallet]);

  const handleTap = (event: MouseEvent<HTMLButtonElement>) => {
    // Animation handling
    const button = buttonRef.current;
    if (button) {
      button.classList.remove('tap-ripple');
      // This is a reflow trick to restart the animation
      void button.offsetWidth;
      button.classList.add('tap-ripple');
    }

    // Optimistically update UI
    setLocalTaps((prev) => prev + 1);

    // Queue for batched flush
    pendingRef.current += 1;
    scheduleFlush();
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
