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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/DropdownMenu';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/src/app/store/authStore';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // 1. Import Next.js Image component


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
  user_id: number; 
  author: {
      name: string;
      avatarUrl?: string;
  };
  timeWindow: 'Morning' | 'Afternoon' | 'Evening';
  text?: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  vibeCounts: VibeCounts;
  userVibe?: string | null;
  comment_count: number;
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

export function VibeCard({ id, user_id, author, timeWindow, text, media_url, media_type, vibeCounts, userVibe, comment_count }: VibeCardProps) {
  const gradient = getWindowGradient(timeWindow);
  const glow = getGlowClass(timeWindow);
  const [localVibeCounts, setLocalVibeCounts] = useState(vibeCounts);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentUserVibe, setCurrentUserVibe] = useState<string | null>(userVibe || null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user: currentUser } = useAuthStore();
  const { mutate } = useSWRConfig();
  const isAuthor = currentUser?.id === user_id;

  useEffect(() => {
    setLocalVibeCounts(vibeCounts);
    setCurrentUserVibe(userVibe || null);
  }, [id, vibeCounts, userVibe]); 

  const handleVibeSelect = async (vibeType: string) => {
    const originalVibeCounts = { ...localVibeCounts };
    const originalUserVibe = currentUserVibe;

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

    try {
      if (originalUserVibe === vibeType) {
        // CORRECTED: Changed 'vibe' to 'vibes'
        await api.delete(`/posts/${id}/vibes`);
      } else {
        // CORRECTED: Changed 'vibe' to 'vibes'
        await api.post(`/posts/${id}/vibes`, { vibeType: vibeType });
      }
      mutate(`/api/feed?time_window=${timeWindow.toLowerCase()}`);
    } catch (error) {
      toast.error("Could not save your vibe. Please try again.");
      setLocalVibeCounts(originalVibeCounts);
      setCurrentUserVibe(originalUserVibe);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Your vibe has been deleted.');
      mutate(`/feed?time_window=${timeWindow.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to delete vibe. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
       'w-full max-w-[28rem] mx-2 rounded-2xl shadow-lg bg-gradient-to-br border border-white/50 overflow-hidden',
        gradient,
        glow,
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between space-x-4">
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
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 cursor-pointer">
                  Delete Vibe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Link href={`/posts/${id}`} className="cursor-pointer block">
        {/* --- 2. MEDIA RENDERING BLOCK (UPDATED) --- */}
        {media_url && media_type === 'image' && (
          <div className="relative aspect-video max-h-96 w-full overflow-hidden">
            <Image
              src={media_url}
              alt={`Vibe from ${author.name}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        {media_url && media_type === 'video' && (
          <video src={media_url} controls autoPlay muted loop className="w-full h-auto max-h-96 block" />
        )}
        {/* --- END OF MEDIA BLOCK --- */}
        {text && (
          <div className="px-6">
            <p className="text-foreground/90">{text}</p>
          </div>
        )}
      </Link>

      {/* Footer */}
      <div className="p-6 mt-2">
        <div className="border-t border-black/10 pt-4 flex items-center justify-between">
          <EnergyStream vibeCounts={localVibeCounts} />
          
          <div className="flex items-center gap-4">
            <Link href={`/posts/${id}`} className="flex items-center gap-2 text-neutral-500 hover:text-brand-deep-blue transition-colors">
              <MessageCircle className="h-6 w-6" />
              <span className="font-semibold">{comment_count}</span>
            </Link>

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
    </div>
  );
}
