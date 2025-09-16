import { cn } from '@/lib/utils';
import { vibeConfig } from './vibe-config';

type DominantVibe = keyof typeof vibeConfig | null;

interface ProfileAuraProps {
  dominantVibe: DominantVibe;
  size?: 'sm' | 'default' | 'lg';
}

const auraGradients: Record<keyof typeof vibeConfig, string> = {
  flow: 'from-vibe-flow/40 to-transparent',
  joy: 'from-vibe-joy/40 to-transparent',
  hype: 'from-vibe-hype/40 to-transparent',
  warmth: 'from-vibe-warmth/40 to-transparent',
  glow: 'from-vibe-glow/40 to-transparent',
  reflect: 'from-vibe-reflect/40 to-transparent',
  love: 'from-vibe-love/40 to-transparent', // Corrected typo from v-love
};

const sizeClasses = {
  sm: 'blur-lg',
  default: 'blur-2xl',
  lg: 'blur-3xl',
};


export function ProfileAura({ dominantVibe, size = 'default' }: ProfileAuraProps) {
  if (!dominantVibe) return null;
  
  const gradientClass = auraGradients[dominantVibe] || 'from-neutral-400/20 to-transparent';
  const blurClass = sizeClasses[size];

  return (
    <div
      className={cn(
        'absolute inset-0 -z-10 rounded-full bg-gradient-to-br',
        'animate-pulse-slow', // Use the new, slower animation class
        gradientClass,
        blurClass
      )}
    />
  );
}
