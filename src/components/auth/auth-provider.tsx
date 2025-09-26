'use client';

import { TonConnectUIProvider, useTonWallet } from '@tonconnect/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { app } from '@/lib/firebase';

const manifestUrl = 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json';

function AuthHandler({ children }: { children: React.ReactNode }) {
  const wallet = useTonWallet();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'pending' | 'signedIn' | 'signedOut'>('pending');

  useEffect(() => {
    const auth = getAuth(app);

    // Attempt Firebase sign-in when a wallet connects (best effort, non-blocking)
    const handleWalletChange = async () => {
      if (wallet && wallet.account && authStatus === 'signedOut') {
        try {
          setAuthStatus('pending');
          const res = await fetch('/api/flows/auth-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: wallet.account.address }),
          });
          if (res.ok) {
            const { token } = await res.json();
            await signInWithCustomToken(auth, token);
          } else {
            // Proceed without Firebase user in demo mode
            setAuthStatus('signedIn');
          }
        } catch (error) {
          console.error('Firebase sign-in error (continuing in demo mode):', error);
          setAuthStatus('signedIn');
        }
      }
    };
    handleWalletChange();
  }, [wallet, authStatus]);


  useEffect(() => {
    const auth = getAuth(app);

    // Handle auth state changes and routing. Wallet presence is sufficient for demo mode.
    const unsubscribe = auth.onAuthStateChanged(user => {
      const hasWallet = !!wallet && !!wallet.account;
      if (user || hasWallet) {
        setAuthStatus('signedIn');
        router.replace('/dashboard');
      } else {
        setAuthStatus('signedOut');
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router, wallet]);


  // While pending, we can show a loader or nothing to prevent content flicker
  if (authStatus === 'pending') {
    return null; // Or a full-page loading spinner
  }

  return <>{children}</>;
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
        <AuthHandler>
            {children}
        </AuthHandler>
    </TonConnectUIProvider>
  );
}
