import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { EnergyStream } from './EnergyStream';

type VibeCounts = {
  flow?: number;
  joy?: number;
  hype?: number;
  warmth?: number;
  glow?: number;
  reflect?: number;
  love?: number;
};

interface VibeCardProps {
  author: string;
  timeWindow: 'Morning' | 'Afternoon' | 'Evening';
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  vibeCounts: VibeCounts;
}

// Helper to get the gradient based on the time window
const getWindowGradient = (window: VibeCardProps['timeWindow']) => {
  switch (window) {
    case 'Morning':
      return 'from-brand-sand/50 to-brand-sage/20';
    case 'Afternoon':
      return 'from-brand-terracotta/30 to-brand-sand/30';
    case 'Evening':
      return 'from-brand-deep-blue/40 to-brand-terracotta/20';
    default:
      return 'from-neutral-100 to-neutral-50';
  }
};

export function VibeCard({ author, timeWindow, text, mediaUrl, mediaType, vibeCounts }: VibeCardProps) {
  const gradient = getWindowGradient(timeWindow);

  return (
    <div
      className={`
       w-[28rem] rounded-2xl shadow-lg 
        bg-gradient-to-br ${gradient}
        border border-white/50 overflow-hidden
      `}
    >
      {/* Header remains the same */}
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40" />
            <AvatarFallback>{author.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold font-heading">{author}</p>
            <p className="text-sm text-neutral-500">{timeWindow} Vibe</p>
          </div>
        </div>
      </div>

      {/* Conditionally render media or text */}
      {mediaUrl && mediaType === 'image' && (
        <img src={mediaUrl} alt={`Vibe from ${author}`} className="w-full h-auto object-cover" />
      )}
      {mediaUrl && mediaType === 'video' && (
        <video src={mediaUrl} controls autoPlay muted loop className="w-full h-auto" />
      )}
      
      {text && (
        <div className="px-6">
          <p className="text-foreground/90">{text}</p>
        </div>
      )}

      {/* Footer remains the same */}
      <div className="p-6 mt-2">
        <div className="border-t border-black/10 pt-4">
          <EnergyStream vibeCounts={vibeCounts} />
        </div>
      </div>
    </div>
  );
}