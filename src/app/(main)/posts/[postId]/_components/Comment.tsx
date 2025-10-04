'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import Link from 'next/link';

// MODIFICATION: Updated to match the API response
interface CommentData {
  id: number;
  content: string;
  created_at: string;
  username: string | null; // Changed from sender_username
  profile_picture_url?: string | null; // Changed from sender_profile_picture_url
}

export interface CommentProps {
  comment: CommentData;
}

export function Comment({ comment }: CommentProps) {
  // MODIFICATION: Use the correct property name from the API
  const authorName = comment.username || 'Anonymous';

  return (
    <div className="flex space-x-4">
      <Avatar>
        <AvatarImage src={comment.profile_picture_url || undefined} />
        <AvatarFallback>{authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Link href={`/profile/${authorName}`} className="font-bold hover:underline">
            {authorName}
          </Link>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-gray-800">{comment.content}</p>
      </div>
    </div>
  );
}

