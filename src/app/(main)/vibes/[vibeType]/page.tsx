'use client';

import { useParams } from 'next/navigation';
import { VibeChannelFeed } from './_components/VibeChannelFeed';
import { vibeConfig } from '@/src/app/components/prototypes/vibe-config';
import { Navbar } from '@/src/app/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VibeChannelPage() {
  const params = useParams();
  const vibeType = params.vibeType as string;

  // Capitalize the first letter for display
  const vibeName = vibeType.charAt(0).toUpperCase() + vibeType.slice(1);
  const VibeIcon = vibeConfig[vibeType as keyof typeof vibeConfig]?.icon;

  return (
    <>
        <Navbar />
        <div className="container mx-auto max-w-2xl">
            <div className="p-4 border-b">
                <Link href="/" className="flex items-center gap-2 text-sm font-bold hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
            <div className="p-4 border-b flex items-center space-x-3">
                {VibeIcon && <VibeIcon className="h-8 w-8" />}
                <h1 className="text-3xl font-heading font-bold">{vibeName} Channel</h1>
            </div>
            <VibeChannelFeed vibeType={vibeType} />
        </div>
    </>
  );
}