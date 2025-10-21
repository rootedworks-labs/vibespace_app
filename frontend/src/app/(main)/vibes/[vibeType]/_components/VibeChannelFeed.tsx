'use client';

import useSWR from 'swr';
import { fetcher } from '@/src/app/api';
import { PostCard, Post } from '@/src/app/(main)/_components/PostCard'; // Import the Post type from PostCard
import { Spinner } from '@/src/app/components/ui/Spinner';
import { PostCardSkeleton } from '@/src/app/(main)/_components/PostCardSkeleton';

interface VibeChannelFeedProps {
  vibeType: string;
}

export function VibeChannelFeed({ vibeType }: VibeChannelFeedProps) {
  // Use the imported Post type for SWR
  const { data: posts, error } = useSWR<Post[]>(`/posts/channel/${vibeType}`, fetcher);

  if (error) {
    return <p className="text-center text-red-500">Failed to load posts for this vibe.</p>;
  }

  if (!posts) {
    return (
      <div className="space-y-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-neutral-500 py-8">
          No vibes have been shared in this channel yet.
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}

