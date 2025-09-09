import { cn } from '@/lib/utils';
import  { VibeType }  from '@/src/app/components/prototypes/vibe-config';

interface ProfileAuraProps {
  dominantVibe: VibeType | null;
}

const vibeGradients: Record<VibeType, string> = {
  flow: 'from-vibe-flow/40 to-transparent',
  joy: 'from-vibe-joy/40 to-transparent',
  hype: 'from-vibe-hype/40 to-transparent',
  warmth: 'from-vibe-warmth/40 to-transparent',
  glow: 'from-vibe-glow/40 to-transparent',
  love: 'from-vibe-love/40 to-transparent',
  reflect: 'from-vibe-reflect/40 to-transparent',
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
