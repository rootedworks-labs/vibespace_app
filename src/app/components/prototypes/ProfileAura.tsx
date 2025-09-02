'use client';

import { cn } from '@/lib/utils';

interface ProfileAuraProps {
  dominantVibe: 'flow' | 'joy' | 'hype' | 'warmth' | 'glow' | 'reflect' | 'love' | null;
}

export function ProfileAura({ dominantVibe }: ProfileAuraProps) {
  const auraClasses = {
    flow: 'from-aura-flow-start to-aura-flow-end',
    joy: 'from-aura-joy-start to-aura-joy-end',
    hype: 'from-aura-hype-start to-aura-hype-end',
    warmth: 'from-aura-warmth-start to-aura-warmth-end',
    glow: 'from-aura-glow-start to-aura-glow-end',
    reflect: 'from-aura-reflect-start to-aura-reflect-end',
    love: 'from-aura-love-start to-aura-love-end',
  };

  if (!dominantVibe) {
    return null;
  }

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