'use client';

import { TonConnectUIProvider, useTonWallet } from '@tonconnect/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getAuthToken } from '@/ai/flows/auth-flow';

const manifestUrl = 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json';

function AuthHandler({ children }: { children: React.ReactNode }) {
  const wallet = useTonWallet();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'pending' | 'signedIn' | 'signedOut'>('pending');

  useEffect(() => {
    const auth = getAuth(app);
    
    // This effect handles the Firebase sign-in logic when the wallet connects.
    const handleWalletChange = async () => {
      if (wallet && wallet.account && authStatus === 'signedOut') {
        try {
          // Prevent re-running sign-in attempts if one is already in progress
          setAuthStatus('pending');
          const customToken = await getAuthToken({ address: wallet.account.address });
          await signInWithCustomToken(auth, customToken);
          // onAuthStateChanged will handle the redirect
        } catch (error) {
          console.error('Firebase sign-in error:', error);
          setAuthStatus('signedOut'); // Reset status on error
          // Handle error, e.g., show a toast message to the user
        }
      }
    };
    handleWalletChange();

  }, [wallet, authStatus]);


  useEffect(() => {
    const auth = getAuth(app);

    // This effect only handles auth state changes and routing.
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setAuthStatus('signedIn');
        router.replace('/dashboard');
      } else {
        setAuthStatus('signedOut');
        if (!wallet || !wallet.account) {
            router.replace('/login');
        }
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
