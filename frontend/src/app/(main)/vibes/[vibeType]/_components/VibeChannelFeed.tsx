'use client';

import useSWR from 'swr';
import { fetcher } from '@/src/app/api';
// 1. Import VibeCard and its related types
import { VibeCard } from '@/src/app/(main)/_components/VibeCard';
import { VibeType } from '@/src/app/components/prototypes/vibe-config';
// 2. Keep the Post type, as this is what your API returns
import { Post } from '@/lib/types'; 
import { Spinner } from '@/src/app/components/ui/Spinner';
import { PostCardSkeleton } from '@/src/app/(main)/_components/PostCardSkeleton';
import { getTimeWindow } from '@/lib/utils';


interface VibeChannelFeedProps {
  vibeType: string;
}

// 3. Define a type for the posts your API returns (which includes time_window)
//    This extends the 'Post' type you were already using.
interface VibePost extends Post {
  time_window: 'Morning' | 'Afternoon' | 'Evening';
}

export function VibeChannelFeed({ vibeType }: VibeChannelFeedProps) {
  // Use the new VibePost type for SWR
  const { data: posts, error } = useSWR<VibePost[]>(`/vibes/${vibeType}`, fetcher);

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
    <div className="flex flex-col items-center space-y-4 py-4">
      {posts.length === 0 ? (
        <p className="text-center text-neutral-500 py-8">
          No vibes have been shared in this channel yet.
        </p>
      ) : (
        // 4. Map 'posts' array to the props required by VibeCard
        posts.map((post) => (
          <VibeCard
            key={post.id}
            id={post.id}
            user_id={post.user_id}
            author={{
              name: post.username,
              avatarUrl: post.profile_picture_url ?? undefined
            }}
            timeWindow={getTimeWindow(post.created_at)} // Pass the time_window from the post
            text={post.content}
            media_url={post.media_url ?? undefined}
            media_type={post.media_type as 'image' | 'video' | undefined}
            vibeCounts={post.vibe_counts} // Cast to VibeCounts
            userVibe={post.user_vibe}
            comment_count={post.comment_count}
            created_at={post.created_at}
          />
        ))
      )}
    </div>
  );
}
