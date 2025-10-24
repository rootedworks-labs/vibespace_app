'use client';

import { useState } from 'react';
import { Button } from '@/src/app/components/ui/Button'; // Corrected import path
import api from '@/src/app/api'; // Added api client
import toast from 'react-hot-toast'; // Added toast for error
import { useAuthStore } from '@/src/app/store/authStore';
import { Spinner } from '@/src/app/components/ui/Spinner'; // Added Spinner import

interface FollowButtonProps {
  username: string; // Changed from userId to username to match your API route
  isFollowing: boolean;
}

export function FollowButton({ username, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error('Please log in to follow users.');
      return;
    }

    setIsLoading(true);
    const originalFollowState = isFollowing; // Store original state for revert on error

    // Optimistic UI update
    setIsFollowing(!isFollowing);

    try {
      if (originalFollowState) {
        // If currently following, send unfollow request
        await api.delete(`/users/${username}/follow`);
      } else {
        // If not following, send follow request
        await api.post(`/users/${username}/follow`);
      }
      // You can add SWR cache revalidation here if needed
      // mutate(`/api/users/${username}`);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      // Revert UI on error
      setIsFollowing(originalFollowState);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show follow button on your own profile
  if (user?.username === username) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      onClick={handleFollowToggle}
      disabled={isLoading}
      className="w-24" // Added a fixed width to prevent layout shift
    >
      {isLoading ? <Spinner className="h-4 w-4" /> : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
