// src/app/components/prototypes/VibeCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { EnergyStream } from './EnergyStream';
import { VibeSelector } from './VibeSelector';
import { Button } from '../ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { Icon } from '@iconify/react';

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
  const [localVibeCounts, setLocalVibeCounts] = useState(vibeCounts);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // --- THIS IS THE FIX ---
  // 1. Add state to track the current user's selected vibe for this card
  const [currentUserVibe, setCurrentUserVibe] = useState<string | null>(null);

  useEffect(() => {
    setLocalVibeCounts(vibeCounts);
    setCurrentUserVibe(null); // Reset user's vibe when props change
  }, [vibeCounts]);

  // 2. Update the handler with more complete logic
  const handleVibeSelect = (vibeType: string) => {
    setLocalVibeCounts(prevCounts => {
      const newCounts = { ...prevCounts };

      // If there was a previous vibe, decrement its count
      if (currentUserVibe) {
        newCounts[currentUserVibe as keyof VibeCounts] = (newCounts[currentUserVibe as keyof VibeCounts] || 1) - 1;
      }

      // If the user is selecting a new vibe (not just un-vibing)
      if (currentUserVibe !== vibeType) {
        newCounts[vibeType as keyof VibeCounts] = (newCounts[vibeType as keyof VibeCounts] || 0) + 1;
        setCurrentUserVibe(vibeType);
      } else {
        // If they clicked the same vibe again, they are un-vibing
        setCurrentUserVibe(null);
      }
      
      return newCounts;
    });
    setIsPopoverOpen(false);
  };
  // --- END FIX ---

  return (
    <div
      className={`
       w-[28rem] rounded-2xl shadow-lg 
        bg-gradient-to-br ${gradient}
        border border-white/50 overflow-hidden
      `}
    >
      {/* Header */}
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

      {/* Media or Text Content */}
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

      {/* Footer with EnergyStream and VibeSelector */}
      <div className="p-6 mt-2">
        <div className="border-t border-black/10 pt-4 flex items-center justify-between">
          <EnergyStream vibeCounts={localVibeCounts} />
          
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="rounded-full">
                <Icon icon="ph:spiral-light" className="h-7 w-7" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-none bg-transparent">
              <VibeSelector onVibeSelect={handleVibeSelect} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
