'use client';

import useSWR from 'swr';
import api from '@/src/app/api';
import { PostCard } from '../../../_components/PostCard';
import { PostCardSkeleton } from '../../../_components/PostCardSkeleton';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface UserPostFeedProps {
  username: string;
}

export function UserPostFeed({ username }: UserPostFeedProps) {
  // Use the new endpoint for the SWR key
  const { data: posts, error, isLoading } = useSWR(`/users/${username}/posts`, fetcher);

  if (isLoading) {
    return (
      <div>
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
    <div>
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}