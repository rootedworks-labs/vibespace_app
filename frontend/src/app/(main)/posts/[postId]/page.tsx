'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { fetcher } from '@/src/app/api';
import { Post } from '@/src/app/(main)/_components/PostCard'; // Use the canonical Post type
import { VibeCard } from '@/src/app/components/prototypes/VibeCard';
import { PostCardSkeleton } from '@/src/app/(main)/_components/PostCardSkeleton';
import { getTimeWindow } from '@/lib/utils';
import { VibeType } from '@/src/app/components/prototypes/vibe-config';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CommentThread } from './_components/CommentThread';
import { CreateCommentForm } from './_components/CreateCommentForm';

// Define VibeCounts to match the VibeCard's expected props
type VibeCounts = Partial<Record<VibeType, number>>;

export default function SinglePostPage() {
  const params = useParams();
  const postId = params.postId as string;

  const { data: post, error, isLoading } = useSWR<Post>(postId ? `/posts/${postId}` : null, fetcher);

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-4">
        <Link href="/feed" className="flex items-center gap-2 text-sm font-bold hover:underline text-neutral-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>
      </div>

      {isLoading && <PostCardSkeleton />}
      {error && <div className="p-8 text-center text-red-500">Post not found or could not be loaded.</div>}
      
      {post && (
        <div className="flex flex-col items-center space-y-8">
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
            userVibe={post.user_vibe as VibeType | undefined}
            comment_count={post.comment_count}
            media_url={post.media_url || undefined}
            media_type={post.media_type as 'image' | 'video' | undefined}
          />
          <div className="w-full border-t pt-8">
            <h2 className="text-2xl font-bold font-heading mb-4">Vibes & Replies</h2>
            <CreateCommentForm postId={post.id.toString()} />
            <CommentThread postId={post.id.toString()} />
          </div>
        </div>
      )}
    </div>
  );
}

