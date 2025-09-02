'use client';

import useSWR from 'swr';
import api from '@/src/app/api';
import { VibeCard } from '@/src/app/components/prototypes/VibeCard';
import { PostCardSkeleton } from '../../../_components/PostCardSkeleton';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface VibeChannelFeedProps {
  vibeType: string;
}

export function VibeChannelFeed({ vibeType }: VibeChannelFeedProps) {
  // We'll use the /posts endpoint with a query parameter as defined in the spec
  const { data: posts, error, isLoading } = useSWR(`/posts?vibe_channel_tag=${vibeType}`, fetcher);

  if (isLoading) {
    return (
      <div>
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8">Could not load this Vibe Channel.</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-12">
        <h3 className="font-bold font-heading">This Channel is Quiet</h3>
        <p className="mt-2 text-sm text-neutral-500">Be the first to post in the #{vibeType} channel!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {posts.map((post: any) => (
        <VibeCard key={post.id} {...post} />
      ))}
    </div>
  );
}
