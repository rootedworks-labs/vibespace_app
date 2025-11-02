'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VibeChannelFeed } from './_components/VibeChannelFeed';
import { vibeConfig, VibeType } from '@/src/app/components/prototypes/vibe-config';
import { cn } from '@/lib/utils';

export default function VibeChannelPage() {
  const params = useParams();
  const vibeType = params.vibeType as VibeType;

  // Find the configuration for the current vibe to get its icon and color
  const currentVibe = vibeConfig[vibeType];
  const Icon = currentVibe?.icon;

  return (
    <div className="container mx-auto max-w-2xl py-8 px-1">
        <div className="mb-6">
            <Link href="/feed" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-brand-deep-blue transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
            </Link>
        </div>

      <div className="flex items-center gap-4 mb-8">
        {Icon && (
          <div className={cn('p-3 rounded-full bg-white/50 shadow-md border border-white/30')}>
             <Icon className={cn('h-8 w-8', currentVibe.textColor)} />
          </div>
        )}
        <h1 className="text-4xl font-bold font-heading capitalize text-brand-deep-blue">
          {vibeType} Channel
        </h1>
      </div>
      
      <VibeChannelFeed vibeType={vibeType} />
    </div>
  );
}

