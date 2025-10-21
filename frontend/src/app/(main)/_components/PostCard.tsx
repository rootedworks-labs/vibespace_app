'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Card } from '@/src/app/components/ui/Card';
import { MessageCircle, Repeat, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component for optimization

export interface Post {
  id: number;
  user_id: number;
  username: string;
  profile_picture_url: string | null;
  content: string;
  created_at: string;
  vibe_counts: Record<string, number>;
  comment_count: number;
  user_vibe: string | null;
  // --- ADD THESE ---
  media_url?: string | null;
  media_type?: string | null; // e.g., 'image', 'video'
  // --- END ADD ---
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    // Use the specific Card component for styling consistency
    <Card className="p-4 flex flex-col space-y-3"> {/* Changed layout slightly */}
      {/* User Info Header */}
      <div className="flex space-x-3">
        <Link href={`/profile/${post.username}`}>
            <Avatar>
            <AvatarImage src={post.profile_picture_url || undefined} />
            <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </Link>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <Link href={`/profile/${post.username}`} className="font-bold hover:underline text-sm">
              {post.username}
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          {/* Post Content Text */}
          <p className="text-sm">{post.content}</p>
        </div>
      </div>

      {/* --- ADD CONDITIONAL MEDIA RENDERING --- */}
      {post.media_url && post.media_type === 'image' && (
        <div className="relative aspect-video rounded-lg overflow-hidden mt-2"> {/* aspect-video for 16:9 */}
          <Image
            src={post.media_url}
            alt={`Post media by ${post.username}`}
            fill // Use fill for responsive images with a sized parent
            style={{ objectFit: 'cover' }} // Cover ensures the image fills the container
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
          />
        </div>
      )}
      {/* Add similar logic here for video if needed */}
      {/* --- END MEDIA RENDERING --- */}

      {/* Action Bar */}
      <div className="flex items-center space-x-8 pt-2">
        <div className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.comment_count}</span>
        </div>
        <div className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400">
          <Repeat className="h-4 w-4" />
          {/* Placeholder for revibes */}
          <span className="text-xs">0</span>
        </div>
        <div className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400">
          <Heart className="h-4 w-4" />
          <span className="text-xs">{Object.values(post.vibe_counts || {}).reduce((a, b) => a + b, 0)}</span>
        </div>
        {/* You'll likely want to add your VibeSelector component here too */}
      </div>
    </Card>
  );
}