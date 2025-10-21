'use client';

import useSWR from 'swr';
import { fetcher } from '@/src/app/api';
import { Post } from './PostCard'; 
import { VibeCard } from '@/src/app/components/prototypes/VibeCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { Users } from 'lucide-react';
import { getTimeWindow } from '@/lib/utils';
import { VibeType } from '@/src/app/components/prototypes/vibe-config';

type TimeWindow = 'Morning' | 'Afternoon' | 'Evening';

// Define a more specific type for VibeCounts to match VibeCardProps
type VibeCounts = Partial<Record<VibeType, number>>;

export function PostFeed({ timeWindow }: { timeWindow: TimeWindow }) {
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
  console.log("Posts data received by feed:", posts);
  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      {posts?.map((post) => (
        <VibeCard 
          key={post.id}
          id={post.id}
          user_id={post.user_id}
          author={{ 
            name: post.username, 
            avatarUrl: post.profile_picture_url || undefined 
          }}
          text={post.content}
          timeWindow={getTimeWindow(post.created_at)}
          vibeCounts={post.vibe_counts as VibeCounts}
          comment_count={post.comment_count}
          // The VibeCard does not use userVibe, so we omit it.
          // The card handles its own internal vibe state.
          media_url={post.media_url || undefined}
          media_type={post.media_type as 'image' | 'video' | undefined}
        />
      ))}
    </div>
  );
}

