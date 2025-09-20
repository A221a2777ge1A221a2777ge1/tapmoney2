'use client';

import { TonConnectButton } from '@tonconnect/ui-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-primary-foreground"
          >
            <path d="M19 12h-2a3 3 0 0 0-3-3V7a5 5 0 0 1 5 5Z" />
            <path d="M5 12h2a3 3 0 0 1 3-3V7a5 5 0 0 0-5 5Z" />
            <path d="M12 19v-2a3 3 0 0 0-3-3H7a5 5 0 0 0 5 5Z" />
            <path d="M12 5v2a3 3 0 0 1 3 3h2a5 5 0 0 0-5-5Z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
          Welcome to Evans Tycoon
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Tap your way to riches in the TON ecosystem.
          Connect your wallet to start your journey.
        </p>
        <div className="[&>button]:w-full [&>button]:bg-accent [&>button]:hover:bg-accent/90 [&>button]:text-accent-foreground [&>button]:h-12 [&>button]:px-8 [&>button]:text-lg">
          <TonConnectButton />
        </div>
      </div>
    </div>
  );
}
