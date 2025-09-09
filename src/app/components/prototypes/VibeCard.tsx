'use client';

import { useState, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import toast from 'react-hot-toast';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { EnergyStream } from './EnergyStream';
import { VibeSelector } from './VibeSelector';
import { Button } from '../ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';


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
  id: number;
  author: {
      name: string;
      avatarUrl?: string;
  };
  timeWindow: 'Morning' | 'Afternoon' | 'Evening';
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  vibeCounts: VibeCounts;
  userVibe?: string | null; // ADDED: The user's current vibe on this post
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

const getGlowClass = (window: VibeCardProps['timeWindow']) => {
    switch (window) {
        case 'Morning':
            return 'vibe-glow-sage';
        case 'Afternoon':
            return 'vibe-glow-terracotta';
        case 'Evening':
            return 'vibe-glow-deep-blue';
        default:
            return '';
    }
}

export function VibeCard({ id, author, timeWindow, text, mediaUrl, mediaType, vibeCounts, userVibe }: VibeCardProps) {
  const gradient = getWindowGradient(timeWindow);
  const glow = getGlowClass(timeWindow);
  const [localVibeCounts, setLocalVibeCounts] = useState(vibeCounts);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // MODIFIED: Initialize state with the userVibe prop
  const [currentUserVibe, setCurrentUserVibe] = useState<string | null>(userVibe || null);

  const { mutate } = useSWRConfig();

  // MODIFIED: Sync state when props change
  useEffect(() => {
    setLocalVibeCounts(vibeCounts);
    setCurrentUserVibe(userVibe || null);
  }, [id, vibeCounts, userVibe]); 

  const handleVibeSelect = async (vibeType: string) => {
    const originalVibeCounts = { ...localVibeCounts };
    const originalUserVibe = currentUserVibe;

    // Optimistic UI Update
    setLocalVibeCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      if (currentUserVibe) {
        newCounts[currentUserVibe as keyof VibeCounts] = (newCounts[currentUserVibe as keyof VibeCounts] || 1) - 1;
      }
      if (currentUserVibe !== vibeType) {
        newCounts[vibeType as keyof VibeCounts] = (newCounts[vibeType as keyof VibeCounts] || 0) + 1;
        setCurrentUserVibe(vibeType);
      } else {
        setCurrentUserVibe(null);
      }
      return newCounts;
    });
    setIsPopoverOpen(false);

    // API Call
    // try {
    //   if (originalUserVibe === vibeType) {
    //     // User is removing their vibe
    //     await api.delete(`/posts/${id}/vibe`);
    //   } else {
    //     // User is adding or changing their vibe
    //     await api.post(`/posts/${id}/vibe`, { vibe_type: vibeType });
    //   }
    //   // Revalidate the feed to get the latest data from the server
    //   mutate('/feed');
    // } catch (error) {
    //   toast.error("Could not save your vibe. Please try again.");
    //   // Revert the UI on error
    //   setLocalVibeCounts(originalVibeCounts);
    //   setCurrentUserVibe(originalUserVibe);
    // }
  };

  return (
    <div
      className={cn(
       'w-[28rem] rounded-2xl shadow-lg bg-gradient-to-br border border-white/50 overflow-hidden',
        gradient,
        glow
      )}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={author.avatarUrl} /> 
            <AvatarFallback>{author.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold font-heading">{author.name}</p>
            <p className="text-sm text-neutral-500">{timeWindow} Vibe</p>
          </div>
        </div>
      </div>

      {/* Media or Text Content */}
      {mediaUrl && mediaType === 'image' && (
        <img src={mediaUrl} alt={`Vibe from ${author.name}`} className="w-full h-auto object-cover" />
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
              <VibeSelector onVibeSelect={handleVibeSelect} timeWindow={timeWindow}/>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

