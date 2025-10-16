import { cn } from '@/lib/utils';
import { vibeConfig } from './vibe-config';

type DominantVibe = keyof typeof vibeConfig | null;

interface ProfileAuraProps {
  dominantVibe: DominantVibe;
  size?: 'sm' | 'default' | 'lg';
}

const auraGradients: Record<keyof typeof vibeConfig, string> = {
  flow: 'from-vibe-flow to-transparent',
  joy: 'from-vibe-joy to-transparent',
  hype: 'from-vibe-hype to-transparent',
  warmth: 'from-vibe-warmth to-transparent',
  glow: 'from-vibe-glow to-transparent',
  reflect: 'from-vibe-reflect to-transparent',
  love: 'from-vibe-love to-transparent', // Corrected typo from v-love
};

// const auraGradients: Record<string, string> = {
//   flow: 'from-[rgb(var(--color-vibe-flow))] to-transparent',
//   joy: 'from-[rgb(var(--color-vibe-joy))]/60 to-transparent',
//   hype: 'from-[rgb(var(--color-vibe-hype))]/60 to-transparent',
//   warmth: 'from-[rgb(var(--color-vibe-warmth))]/60 to-transparent',
//   glow: 'from-[rgb(var(--color-vibe-glow))]/60 to-transparent',
//   love: 'from-[rgb(var(--color-vibe-love))]/60 to-transparent',
//   reflect: 'from-[rgb(var(--color-vibe-reflect))]/60 to-transparent',
// };
const sizeClasses = {
  sm: 'blur-md',
  default: 'blur-2xl',
  lg: 'blur-3xl',
};


export function ProfileAura({ dominantVibe, size = 'sm' }: ProfileAuraProps) {
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
