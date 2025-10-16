'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Card } from '@/src/app/components/ui/Card';
import { MessageCircle, Repeat, Heart } from 'lucide-react';
import Link from 'next/link';

// This is the interface that needs to be updated and exported.
export interface Post {
  id: number;
  user_id: number;
  username: string;
  profile_picture_url: string | null;
  content: string;
  created_at: string;
  vibe_counts: Record<string, number>; // ADDED: To hold vibe data
  comment_count: number;
  user_vibe: string | null; // ADDED: To hold the current user's vibe
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="p-4">
      <div className="flex space-x-3">
        <Avatar>
          <AvatarImage src={post.profile_picture_url || undefined} />
          <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <Link href={`/profile/${post.username}`} className="font-bold hover:underline">
              {post.username}
            </Link>
            <p className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm">{post.content}</p>
          <div className="flex items-center space-x-8 pt-2">
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comment_count}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Repeat className="h-4 w-4" />
              {/* Placeholder for revibes */}
              <span>0</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Heart className="h-4 w-4" />
              {/* A simple sum of all vibe counts */}
              <span>{Object.values(post.vibe_counts || {}).reduce((a, b) => a + b, 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

