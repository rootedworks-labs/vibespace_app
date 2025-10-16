'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { Spinner } from './ui/Spinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  
  // This state is crucial to handle the initial render before the store is rehydrated
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // We get the persisted state here
    const state = useAuthStore.getState();

    // If there's no user or token after the store has rehydrated, redirect to login
    if (!state.user || !state.accessToken) {
      router.push('/login');
    } else {
      // If the user is logged in, allow the component to render
      setIsAuthChecked(true);
    }
  }, [router]);

  // While we're checking for the user, show a loading spinner
  if (!isAuthChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // If the user is authenticated, render the actual page content
  return <>{children}</>;
}