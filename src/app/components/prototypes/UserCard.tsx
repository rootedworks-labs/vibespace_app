'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

// Define the shape of the user object for the card
interface User {
  username: string;
  bio?: string | null;
  profile_picture_url?: string | null;
  dominantVibe?: 'flow' | 'joy' | 'hype' | 'warmth' | 'glow' | 'reflect' | 'love' | null;
}

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  // Map dominant vibes to their corresponding CSS variable for the ring color
  const vibeRingColor = {
    flow: 'ring-[var(--color-vibe-flow)]',
    joy: 'ring-[var(--color-vibe-joy)]',
    hype: 'ring-[var(--color-vibe-hype)]',
    warmth: 'ring-[var(--color-vibe-warmth)]',
    glow: 'ring-[var(--color-vibe-glow)]',
    reflect: 'ring-[var(--color-vibe-reflect)]',
    love: 'ring-[var(--color-vibe-love)]',
  };

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 overflow-hidden shadow-lg">
      <div className="relative z-10 flex flex-col items-center text-center">
        <Avatar className={cn(
          "h-24 w-24",
          // Conditionally apply the ring if a dominant vibe exists
          user.dominantVibe && "ring-4",
          user.dominantVibe && vibeRingColor[user.dominantVibe]
        )}>
          <AvatarImage src={user.profile_picture_url ?? undefined} />
          <AvatarFallback className="text-3xl">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h3 className="mt-3 font-bold font-heading text-lg text-brand-deep-blue">{user.username}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2 h-10">
          {user.bio || 'A new member of the VibeSpace community.'}
        </p>
        <Button className="mt-4 w-full">Follow</Button>
      </div>
    </div>
  );
}
