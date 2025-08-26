'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { cn } from '@/lib/utils';
import { Flame, Droplets, Sparkles } from 'lucide-react';

// --- Sub-component for the Aura ---
interface ProfileAuraProps {
  dominantVibe: 'fire' | 'flow' | 'magic' | null;
}

function ProfileAura({ dominantVibe }: ProfileAuraProps) {
  const auraClasses = {
    fire: 'from-aura-fire-start to-aura-fire-end',
    flow: 'from-aura-flow-start to-aura-flow-end',
    magic: 'from-aura-magic-start to-aura-magic-end',
  };

  if (!dominantVibe) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 rounded-full bg-gradient-to-br blur-2xl',
        'animate-[pulse-aura_5s_ease-in-out_infinite]',
        auraClasses[dominantVibe]
      )}
    />
  );
}


// --- Main Profile Page Prototype Component ---
interface ProfilePagePrototypeProps {
  username: string;
  bio: string;
  dominantVibe: 'fire' | 'flow' | 'magic' | null;
  vibeText: string;
}

export function ProfilePagePrototype({ username, bio, dominantVibe, vibeText }: ProfilePagePrototypeProps) {
  const vibeIcon = {
    fire: <Flame className="h-5 w-5 text-aura-fire-start" />,
    flow: <Droplets className="h-5 w-5 text-aura-flow-start" />,
    magic: <Sparkles className="h-5 w-5 text-aura-magic-start" />,
  };

  return (
    <div className="flex flex-col items-center text-center p-8">
      <div className="relative">
        <ProfileAura dominantVibe={dominantVibe} />
        <Avatar className="h-32 w-32 border-4 border-white relative z-10">
          <AvatarImage src="https://placehold.co/128x128" />
          <AvatarFallback className="text-4xl">{username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <h1 className="mt-4 text-3xl font-bold font-heading">{username}</h1>
      
      {dominantVibe && (
        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500">
          {vibeIcon[dominantVibe]}
          <span>{vibeText}</span>
        </div>
      )}

      <p className="mt-4 max-w-md text-foreground/80">{bio}</p>
    </div>
  );
}