'use client';

import { useState } from 'react';
import { Button } from '@/src/app/components/ui/Button'; // Corrected import path
import api from '@/src/app/api';
import toast from 'react-hot-toast';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
}

export function FollowButton({ userId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    const originalFollowState = isFollowing;

    // Optimistic UI update
    setIsFollowing(!isFollowing);

    try {
      if (originalFollowState) {
        // If currently following, send unfollow request
        await api.delete(`/api/users/${userId}/follow`);
      } else {
        // If not following, send follow request
        await api.post(`/api/users/${userId}/follow`);
      }
      // In a real app, you would likely revalidate SWR caches here
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      // Revert UI on error
      setIsFollowing(originalFollowState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      onClick={handleFollowToggle}
      disabled={isLoading}
    >
      {isLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}

