import { Waves, Sun, Heart, Moon, Droplets, Flame, Sparkles, Smile } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Define the available vibes with their corresponding icon and color
export const allVibes = {
  flow: { icon: Waves, color: 'text-vibe-flow', hoverColor: 'hover:bg-vibe-flow/10' },
  joy: { icon: Smile, color: 'text-vibe-joy', hoverColor: 'hover:bg-vibe-joy/10' },
  hype: { icon: Flame, color: 'text-vibe-hype', hoverColor: 'hover:bg-vibe-hype/10' },
  warmth: { icon: Sun, color: 'text-vibe-warmth', hoverColor: 'hover:bg-vibe-warmth/10' },
  glow: { icon: Sparkles, color: 'text-vibe-glow', hoverColor: 'hover:bg-vibe-glow/10' },
  reflect: { icon: Moon, color: 'text-vibe-reflect', hoverColor: 'hover:bg-vibe-reflect/10' },
  love: { icon: Heart, color: 'text-vibe-love', hoverColor: 'hover:bg-vibe-love/10' },
};

// Define variants for the icon size using class-variance-authority
const iconVariants = cva('', {
  variants: {
    size: {
      default: 'h-6 w-6',
      sm: 'h-5 w-5',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

// Define the props for the component
interface VibeSelectorProps extends VariantProps<typeof iconVariants> {
  onVibeSelect: (vibeType: string) => void;
  /**
   * An array of vibe keys to display. If not provided, all vibes will be shown.
   */
  vibesToShow?: (keyof typeof allVibes)[];
}

export function VibeSelector({ onVibeSelect, size, vibesToShow }: VibeSelectorProps) {
  const vibesToRender = vibesToShow
    ? vibesToShow.map(key => ({ type: key, ...allVibes[key] }))
    : Object.entries(allVibes).map(([type, props]) => ({ type, ...props }));

  return (
    <div className="flex items-center space-x-1 bg-background p-1.5 rounded-full border shadow-lg">
      {vibesToRender.map(({ type, icon: Icon, color, hoverColor }) => (
        <Button
          key={type}
          variant="ghost"
          size="sm"
          className={cn(
            'p-2 h-auto rounded-full transition-transform duration-200 ease-in-out hover:scale-125',
            color,
            hoverColor
          )}
          onClick={() => onVibeSelect(type)}
        >
          <Icon className={cn(iconVariants({ size }))} />
        </Button>
      ))}
    </div>
  );
}