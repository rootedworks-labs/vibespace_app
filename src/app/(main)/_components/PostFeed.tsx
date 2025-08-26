'use client';

import useSWR from 'swr';
import api from '@/src/app/api';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { Users } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function PostFeed() {
  const { data: posts, error, isLoading } = useSWR('/posts', fetcher);

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
        <h2 className="mt-4 text-xl font-bold font-heading">Your Feed is Empty</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Follow other users to see their posts here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts?.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}