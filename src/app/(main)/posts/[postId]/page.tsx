'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import api from '@/src/app/api';
import { PostCard } from '../../_components/PostCard';
import { PostCardSkeleton } from '../../_components/PostCardSkeleton';
import { Navbar } from '@/src/app/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function SinglePostPage() {
  const params = useParams();
  const postId = params.postId as string;

  // Fetch a single post using the existing backend endpoint
  const { data: post, error, isLoading } = useSWR(`/posts/${postId}`, fetcher);

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-2xl">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Link>
        </div>

        {isLoading && <PostCardSkeleton />}
        {error && <div className="p-8 text-center">Post not found or could not be loaded.</div>}
        {post && <PostCard post={post} />}
        
        {/* A placeholder for the comment section */}
        <div className="p-4 border-t">
          <h3 className="font-bold font-heading">Comments</h3>
          <p className="mt-2 text-sm text-neutral-500">Comments will appear here.</p>
        </div>
      </div>
    </>
  );
}