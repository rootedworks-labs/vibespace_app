'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import { Button } from './ui/Button';

interface FollowButtonProps {
  username: string;
  initialIsFollowing: boolean;
}

export function FollowButton({ username, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { mutate } = useSWRConfig();

  const handleToggleFollow = async () => {
    // Optimistic update for a fast UI response
    setIsFollowing(!isFollowing);

    try {
      if (isFollowing) {
        await api.delete(`/users/${username}/follow`);
      } else {
        await api.post(`/users/${username}/follow`);
      }
      // Re-fetch the profile data to update follow counts
      mutate(`/users/${username}`);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      // Revert the UI on error
      setIsFollowing(initialIsFollowing);
    }
  };

  return (
    <Button onClick={handleToggleFollow} variant={isFollowing ? 'secondary' : 'default'}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}