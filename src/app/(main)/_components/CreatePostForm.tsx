'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import { Button } from '@/src/app/components/ui/Button';
import { Textarea } from '@/src/app/components/ui/TextArea'; // We'll create this next
import { useAuthStore } from '@/src/app/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';

export function CreatePostForm() {
  const [content, setContent] = useState('');
  const { user } = useAuthStore();
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      // Your backend expects { content, is_public }
      await api.post('/posts', { content });
      setContent(''); // Clear the textarea
      // Tell SWR to re-fetch the posts feed so the new post appears
      mutate('/posts');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 border-b">
      <div className="flex space-x-4">
        <Avatar>
          <AvatarImage src={user.profile_picture_url ?? undefined} />
          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmit} className="w-full">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-lg border-none focus:ring-0 resize-none p-0"
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" disabled={!content.trim()}>Post</Button>
          </div>
        </form>
      </div>
    </div>
  );
}