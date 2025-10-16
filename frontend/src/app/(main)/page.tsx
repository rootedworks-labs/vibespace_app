'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/src/app/store/authStore';
import { Button } from '@/src/app/components/ui/Button';
import Image from 'next/image';
import { Spinner } from '@/src/app/components/ui/Spinner';

export default function LandingPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/feed');
    } else {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner className="h-10 w-10 text-brand-sage" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center max-w-md">
        <Image 
          src="/vibespace-logo-transparent-hardmask.png" 
          alt="VibeSpace Logo" 
          width={120} 
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">Welcome to VibeSpace</h1>
        <p className="text-lg text-neutral-500 mb-8">No algorithms, just energy.</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

