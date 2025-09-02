'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import api from '@/src/app/api';
import { VibeCard } from '@/src/app/components/prototypes/VibeCard'; // Updated import
import { PostCardSkeleton } from '../../_components/PostCardSkeleton';
import { Navbar } from '@/src/app/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CommentThread } from './_components/CommentThread';
import { CreateCommentForm } from './_components/CreateCommentForm';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Define the Post type to match the VibeCard's props
interface Post {
  id: number;
  author: string;
  text: string;
  timeWindow: 'Morning' | 'Afternoon' | 'Evening';
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  vibeCounts: {
    flow?: number;
    joy?: number;
    hype?: number;
    warmth?: number;
    glow?: number;
    reflect?: number;
    love?: number;
  };
}

export default function SinglePostPage() {
  const params = useParams();
  const postId = params.postId as string;

  const { data: post, error, isLoading } = useSWR<Post>(`/posts/${postId}`, fetcher);

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
        
        {post && (
          <div className="flex justify-center py-4">
            <VibeCard {...post} />
          </div>
        )}
        
        {/* Render the comment section */}
        {post && (
          <>
            <CreateCommentForm postId={postId} />
            <CommentThread postId={postId} />
          </>
        )}
      </div>
    </>
  );
}

