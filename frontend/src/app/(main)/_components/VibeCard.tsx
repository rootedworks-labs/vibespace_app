'use client';

import { useState, useEffect, useRef } from 'react';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import toast from 'react-hot-toast';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { EnergyStream } from './EnergyStream';
import { VibeSelector } from './VibeSelector';
import { Button } from '@/src/app/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/app/components/ui/Popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/app/components/ui/DropdownMenu';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/src/app/store/authStore';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { getProxiedMediaUrl } from '@/lib/mediaUtils';
import Image from 'next/image'; // 1. Import Next.js Image component
import { LinkPreview } from '@/lib/types';
import { LinkPreviewCard } from '@/src/app/components/LinkPreviewCard';



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
  created_at: string;
  link_preview_data: LinkPreview | null;
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

const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " m";
    if (seconds < 10) return "Just now";
    return Math.floor(seconds) + "s";
};

export function VibeCard({ id, user_id, author, timeWindow, text, media_url, media_type, vibeCounts, userVibe, comment_count, created_at, link_preview_data }: VibeCardProps) {
  const gradient = getWindowGradient(timeWindow);
  const glow = getGlowClass(timeWindow);
  const [localVibeCounts, setLocalVibeCounts] = useState(vibeCounts);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentUserVibe, setCurrentUserVibe] = useState<string | null>(userVibe || null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const [isEditingText, setIsEditingText] = useState(false);
  const [currentText, setCurrentText] = useState(text); // Holds the displayed text
  const [editedText, setEditedText] = useState(text || ''); // Holds text for the textarea
  const [isSaving, setIsSaving] = useState(false);

  const { user: currentUser } = useAuthStore();
  const { mutate } = useSWRConfig();
  const isAuthor = currentUser?.id === user_id;

  useEffect(() => {
    setLocalVibeCounts(vibeCounts);
    setCurrentUserVibe(userVibe || null);
    setCurrentText(text);
    setEditedText(text || '');
    }, [id, vibeCounts, userVibe]);
  
    useEffect(() => {
    // Check if the text element is overflowing its clamped height
    if (textRef.current) {
      // We check if the scrollHeight (the total height of the text)
      // is greater than the clientHeight (the visible height of the element)
      const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight;
      if (isOverflowing) {
        setNeedsExpansion(true);
      }
    }
  }, [text]); // Only run this check when the text content changes

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

    const handleSaveEdit = async () => {
    if (editedText === currentText) {
      setIsEditingText(false);
      return;
    }

    setIsSaving(true);
    try {
      // Assuming the API endpoint is /posts/:id and accepts a 'text' field
      await api.patch(`/posts/${id}`, { content: editedText });
      setCurrentText(editedText); // Update local displayed text
      setIsEditingText(false);
      toast.success("Vibe text updated!");
      mutate(`/api/feed?time_window=${timeWindow.toLowerCase()}`);
    } catch (error) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingText(false);
    setEditedText(currentText || ''); // Reset textarea to original text
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
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
            <Link 
            href={`/profile/${author.name}`} 
            onClick={stopPropagation} 
            className="rounded-full transition-all duration-200 hover:opacity-80"
          >
            <Avatar>
              <AvatarImage src={getProxiedMediaUrl(author.avatarUrl)} /> 
              <AvatarFallback>{author.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            </Link>
            <Link 
              href={`/profile/${author.name}`} 
              onClick={stopPropagation} 
              className="group"
            >
            <div>
              <p className="font-bold font-heading">{author.name}</p>
              <p className="text-sm text-neutral-500">{timeSince(created_at)}</p>
            </div>
            </Link>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditingText(true)} className="cursor-pointer">
                  Edit VibeCard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 cursor-pointer">
                  Delete VibeCard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Link href={`/posts/${id}`} className="cursor-pointer block">
        {media_url && media_type === 'image' && (
          // 5. ADDED max-h-96 to constrain image height
          <img src={getProxiedMediaUrl(media_url) || '/placeholder.png'} alt={`Vibe from ${author.name}`} className="w-full max-h-96 h-auto object-cover" />
        )}
        {media_url && media_type === 'video' && (
          // 6. ADDED max-h-96 to constrain video height
          <video src={getProxiedMediaUrl(media_url) || '/placeholder.png'} controls autoPlay muted loop className="w-full max-h-96 h-auto" />
        )}
      </Link>

      {!isEditingText && !media_url && link_preview_data && (
        <div className="px-4 pb-2" onClick={(e) => e.stopPropagation()}>
          <LinkPreviewCard data={link_preview_data} />
        </div>
      )}
      
        {/* --- END OF MEDIA BLOCK --- */}
    {(text || isEditingText) && ( // Show this section if text exists OR we are editing
        <div className={cn(
          "px-6 pt-4 pb-2",
          !isExpanded && !isEditingText && "min-h-[3.75rem]" 
        )}>
          {isEditingText ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full rounded-md border border-brand-deep-blue/50 bg-white/50 p-2 text-foreground/90 focus:outline-none focus:ring-2 focus:ring-brand-deep-blue"
                rows={4}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <> 
              {/* This is your original display logic */}
              <p 
                ref={textRef}
                className={cn(
                  "text-foreground/90",
                  !isExpanded && "line-clamp-3" // Uses line-clamp to limit text to 3 lines
                )}
              >
                {currentText}
              </p>
              {needsExpansion && !isEditingText && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm font-semibold text-brand-deep-blue/80 hover:text-brand-deep-blue mt-1"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 mt-2">
        <div className="border-t border-black/10 pt-4 flex items-center justify-between">
          <EnergyStream vibeCounts={localVibeCounts} />
          
          <div className="flex items-center gap-1">
            <Link href={`/posts/${id}`} className="flex items-center gap-2 text-neutral-500 hover:text-brand-deep-blue transition-colors">
              <MessageCircle className="h-6 w-6" />
              <span className="font-semibold">{comment_count}</span>
            </Link>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Icon icon="ph:spiral-light" className="h-6 w-6" />
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
