import { Waves, Sun, Heart, Moon, Droplets, Flame, Sparkles, Smile } from 'lucide-react';
import { Button } from '@/src/app/components/ui/Button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { vibeConfig } from '@/src/app/components/prototypes/vibe-config';

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
  timeWindow?: 'Morning' | 'Afternoon' | 'Evening';
  /**
   * An array of vibe keys to display. If not provided, all vibes will be shown.
   */
  vibesToShow?: (keyof typeof vibeConfig)[];
}

const getSelectorGradient = (window?: VibeSelectorProps['timeWindow']) => {
  switch (window) {
    // case 'Morning':
    //   // Darker, cooler contrast to the light Morning card
    //   return 'from-brand-deep-blue/80 to-brand-sage/60';
    // case 'Afternoon':
    //   // Cooler contrast to the warm Afternoon card
    //   return 'from-brand-sage/80 to-brand-deep-blue/60';
    // case 'Evening':
    //   // Lighter contrast to the dark Evening card
    //   return 'from-brand-sand/80 to-brand-terracotta/60';
    default:
      // Default style if no timeWindow is provided
      return 'from-brand-sand/70 to-brand-sage/20';
  }
};

export function VibeSelector({ onVibeSelect, size, vibesToShow, timeWindow }: VibeSelectorProps) {
  const vibesToRender = vibesToShow
    ? vibesToShow.map(key => ({ type: key, ...vibeConfig[key] }))
    : Object.entries(vibeConfig).map(([type, props]) => ({ type, ...props }));
  const gradientClass = getSelectorGradient(timeWindow);

  return (
    <div className={cn(
        "flex items-center space-x-1 bg-gradient-to-br backdrop-blur-lg p-1.5 rounded-full border border-white/50 shadow-md",
        gradientClass
    )}>
      {vibesToRender.map(({ type, icon: Icon, textColor, hoverColor }) => (
        <Button
          key={type}
          type="button"
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