import { cn } from '@/lib/utils';
import  { VibeType }  from '@/src/app/components/prototypes/vibe-config';

interface ProfileAuraProps {
  dominantVibe: VibeType | null;
}

const vibeGradients: Record<VibeType, string> = {
  flow: 'from-vibe-flow to-transparent',
  joy: 'from-vibe-joy to-transparent',
  hype: 'from-vibe-hype to-transparent',
  warmth: 'from-vibe-warmth to-transparent',
  glow: 'from-vibe-glow to-transparent',
  love: 'from-vibe-love to-transparent',
  reflect: 'from-vibe-reflect to-transparent',
};

export function ProfileAura({ dominantVibe }: ProfileAuraProps) {
  if (!dominantVibe) return null;

  const gradientClass = vibeGradients[dominantVibe] || 'from-neutral-400/20 to-transparent';

  return (
    <div
      className={cn(
        'absolute inset-0 -z-10 rounded-full bg-gradient-to-br blur-2xl animate-pulse-slow',
        gradientClass
      )}
    />
  );
}
