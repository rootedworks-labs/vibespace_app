'use client';

import useSWR from 'swr';
import { fetcher } from '@/src/app/api';
import { Post } from '@/lib/types'; // Use the canonical Post type
import { VibeCard } from '@/src/app/(main)/_components/VibeCard';
import { PostCardSkeleton } from '@/src/app/(main)/_components/PostCardSkeleton';
import { getTimeWindow } from '@/lib/utils';
import { VibeType } from '@/src/app/components/prototypes/vibe-config';
import { useAuthStore } from '@/src/app/store/authStore';
import { shallow } from 'zustand/shallow';

// Define VibeCounts to match the VibeCard's expected props
type VibeCounts = Partial<Record<VibeType, number>>;

interface UserPostFeedProps {
  username: string;
}

export function UserPostFeed({ username }: UserPostFeedProps) {
  // 1. Get the 'accessToken' directly from the store.
  // We'll also still use 'isCheckingAuth' to prevent a flash of the "no posts" message
  // before hydration has a chance to run.
  const { accessToken, isCheckingAuth } = useAuthStore((state) => ({
    accessToken: state.accessToken,
    isCheckingAuth: state.isChecking,
  }));

  // 2. Make the SWR key conditional on 'accessToken' existing (or being null).
  // SWR will use the accessToken value as part of its key.
  // It will NOT fetch if the key is `null`.
  // When 'accessToken' loads (from null to "your-token"), SWR will automatically refetch.
  // This guarantees the interceptor will have the token.
  const { data: posts, error, isLoading } = useSWR<Post[]>(
    // The key is now an array. SWR will pass only the URL part to the fetcher.
    // If accessToken is null (during hydration or if logged out), the key is null, and no fetch occurs.
    accessToken ? [`/users/${username}/posts`, accessToken] : null,
    ([url]) => fetcher(url) // SWR fetcher will only receive the URL
  );

  // 3. Show loading skeleton if SWR is loading OR if auth is still checking
  if (isLoading || isCheckingAuth) {
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
        console.log(post.username),
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
          created_at={post.created_at}
          link_preview_data={post.link_preview_data}
          
        />
            ))}
    </div>
  );
}

