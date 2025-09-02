'use client';

import useSWR from 'swr';
import api from '@/src/app/api';
import { VibeCard } from '@/src/app/components/prototypes/VibeCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { Users } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then(res => res.data);

// Define a more accurate type for the Post object based on our specs
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

// Define the TimeWindow type for the prop
type TimeWindow = 'Morning' | 'Afternoon' | 'Evening';

// Update the component to accept the timeWindow prop
export function PostFeed({ timeWindow }: { timeWindow: TimeWindow }) {
  // Update the SWR key to be dynamic based on the timeWindow
  const { data: posts, error, isLoading } = useSWR<Post[]>(`/feed?time_window=${timeWindow.toLowerCase()}`, fetcher);

  if (isLoading) {
    return (
      <div>
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (error) return <div>Failed to load feed.</div>;

  // Update the empty state message
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-12 border-t">
        <Users className="mx-auto h-12 w-12 text-neutral-400" />
        <h2 className="mt-4 text-xl font-bold font-heading">No vibes in this window yet.</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Come back later or be the first to post!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      {posts?.map((post) => (
        <VibeCard key={post.id} {...post} />
      ))}
    </div>
  );
}

