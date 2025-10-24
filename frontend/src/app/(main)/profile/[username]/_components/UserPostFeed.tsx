'use client';

import useSWR from 'swr';
import { fetcher } from '@/src/app/api';
import { Post } from '@/src/app/(main)/_components/PostCard'; // Use the canonical Post type
import { VibeCard } from '@/src/app/components/prototypes/VibeCard';
import { PostCardSkeleton } from '@/src/app/(main)/_components/PostCardSkeleton';
import { getTimeWindow } from '@/lib/utils';
import { VibeType } from '@/src/app/components/prototypes/vibe-config';

// Define VibeCounts to match the VibeCard's expected props
type VibeCounts = Partial<Record<VibeType, number>>;

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
    return <div className="text-center p-8">Could not load this user's posts.</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-12 border-t">
        <h3 className="font-bold font-heading">No Posts Yet</h3>
        <p className="mt-2 text-sm text-neutral-500">This user hasn't shared any vibes.</p>
      </div>
    );
  }

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

