'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import Link from 'next/link';

// Define the shape of a comment object
interface CommentData {
  id: number;
  content: string;
  created_at: string;
  sender_id: number;
  sender_username: string;
  // You can add profile picture URL here when the API supports it
}

interface CommentProps {
  comment: CommentData;
}

export function Comment({ comment }: CommentProps) {
  return (
    <div className="flex space-x-4">
      <Avatar>
        {/* Add AvatarImage when available from API */}
        <AvatarFallback>{comment.sender_username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Link href={`/profile/${comment.sender_username}`} className="font-bold hover:underline">
            {comment.sender_username}
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