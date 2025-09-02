'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import { Button } from '@/src/app/components/ui/Button';
import { Textarea } from '@/src/app/components/ui/TextArea';
import { useAuthStore } from '@/src/app/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import toast from 'react-hot-toast';
import { VibeSelector } from '@/src/app/components/prototypes/VibeSelector';
import { vibeConfig } from '@/src/app/components/prototypes/vibe-config';

export function CreatePostForm() {
  const [content, setContent] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const toastId = toast.loading('Creating post...');

    try {
      // The backend will need to be updated to accept `vibe_channel_tag`
      await api.post('/posts', { content, vibe_channel_tag: selectedVibe });
      setContent('');
      setSelectedVibe(null);
      mutate('/posts');
      toast.success('Post created successfully!', { id: toastId });

    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post.', { id: toastId });
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
          <div className="mt-4 flex justify-between items-center">
            <div>
                <VibeSelector 
                    onVibeSelect={(vibe) => setSelectedVibe(vibe === selectedVibe ? null : vibe)} 
                    size="sm"
                />
                {selectedVibe && <p className="text-xs mt-1 text-gray-500">Posting to #{selectedVibe} channel</p>}
            </div>
            <Button type="submit" disabled={!content.trim()}>Post</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
