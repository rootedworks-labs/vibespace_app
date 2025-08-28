import { Waves, Sun, Heart, Moon, Droplets, Flame, Sparkles, Smile } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { vibeConfig } from './vibe-config';

// Define the available vibes with their corresponding icon and color


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
  vibesToShow?: (keyof typeof vibeConfig)[];
}

export function VibeSelector({ onVibeSelect, size, vibesToShow }: VibeSelectorProps) {
  const vibesToRender = vibesToShow
    ? vibesToShow.map(key => ({ type: key, ...vibeConfig[key] }))
    : Object.entries(vibeConfig).map(([type, props]) => ({ type, ...props }));

  return (
    <div className="flex items-center space-x-1 bg-background p-1.5 rounded-full border shadow-lg">
      {vibesToRender.map(({ type, icon: Icon, textColor, hoverColor }) => (
        <Button
          key={type}
          variant="ghost"
          size="sm"
          className={cn(
            'p-2 h-auto rounded-full transition-transform duration-200 ease-in-out hover:scale-125',
            textColor,
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