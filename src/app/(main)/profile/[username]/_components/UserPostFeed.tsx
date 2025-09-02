'use client';

import useSWR from 'swr';
import api from '@/src/app/api';
import { VibeCard } from '@/src/app/components/prototypes/VibeCard'; // Updated import
import { PostCardSkeleton } from '../../../_components/PostCardSkeleton';

const fetcher = (url: string) => api.get(url).then(res => res.data);

// Define a more accurate type for the Post object to match VibeCard props
interface Post {
  id: number;
  author: string;
  text: string;
  timeWindow: 'Morning' | 'Afternoon' | 'Evening';
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  vibeCounts: {
    flow?: number;
    joy?: number;
    hype?: number;
    warmth?: number;
    glow?: number;
    reflect?: number;
    love?: number;
  };
}

interface UserPostFeedProps {
  username: string;
}

export function UserPostFeed({ username }: UserPostFeedProps) {
  const { data: posts, error, isLoading } = useSWR<Post[]>(`/users/${username}/posts`, fetcher);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4 py-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (error || !posts) {
    return <div className="text-center p-8">Could not load posts.</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-12 border-t">
        <h3 className="font-bold font-heading">No Posts Yet</h3>
        <p className="mt-2 text-sm text-neutral-500">This user hasn't posted anything.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      {posts.map((post) => (
        <VibeCard key={post.id} {...post} />
      ))}
    </div>
  );
}
