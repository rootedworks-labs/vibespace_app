'use client';

import useSWR from 'swr';
import api from '@/src/app/api';
import { PostCard } from './PostCard';
import { Spinner } from '@/src/app/components/ui/Spinner';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function PostFeed() {
  const { data: posts, error, isLoading } = useSWR('/posts', fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <Spinner />
      </div>
    );
  }

  if (error) return <div>Failed to load feed.</div>;

  return (
    <div>
      {posts?.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}