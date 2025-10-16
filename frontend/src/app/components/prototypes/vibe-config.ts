// src/app/components/prototypes/vibe-config.ts
import { Waves, Sun, Heart, Moon, Flame, Sparkles, Smile } from 'lucide-react';

// This is now the single source of truth for all vibe definitions.
export const vibeConfig = {
  flow: { 
    icon: Waves, 
    textColor: 'text-vibe-flow', 
    hoverColor: 'hover:bg-vibe-flow/10',
    dotColor: 'bg-vibe-flow' 
  },
  joy: { 
    icon: Smile, 
    textColor: 'text-vibe-joy', 
    hoverColor: 'hover:bg-vibe-joy/10',
    dotColor: 'bg-vibe-joy'
  },
  hype: { 
    icon: Flame, 
    textColor: 'text-vibe-hype', 
    hoverColor: 'hover:bg-vibe-hype/10',
    dotColor: 'bg-vibe-hype'
  },
  warmth: { 
    icon: Sun, 
    textColor: 'text-vibe-warmth', 
    hoverColor: 'hover:bg-vibe-warmth/10',
    dotColor: 'bg-vibe-warmth'
  },
  glow: { 
    icon: Sparkles, 
    textColor: 'text-vibe-glow', 
    hoverColor: 'hover:bg-vibe-glow/10',
    dotColor: 'bg-vibe-glow'
  },
  reflect: { 
    icon: Moon, 
    textColor: 'text-vibe-reflect', 
    hoverColor: 'hover:bg-vibe-reflect/10',
    dotColor: 'bg-vibe-reflect'
  },
  love: { 
    icon: Heart, 
    textColor: 'text-vibe-love', 
    hoverColor: 'hover:bg-vibe-love/10',
    dotColor: 'bg-vibe-love'
  },
};

// Add this line to create and export the VibeType from the keys of the config object.
export type VibeType = keyof typeof vibeConfig;

