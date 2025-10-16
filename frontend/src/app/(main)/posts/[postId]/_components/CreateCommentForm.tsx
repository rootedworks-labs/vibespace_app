'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import { Button } from '@/src/app/components/ui/Button';
import { Textarea } from '@/src/app/components/ui/TextArea';
import toast from 'react-hot-toast';

interface CreateCommentFormProps {
  postId: string;
}

export function CreateCommentForm({ postId }: CreateCommentFormProps) {
  const [content, setContent] = useState('');
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const toastId = toast.loading('Posting comment...');

    try {
      await api.post(`/posts/${postId}/comments`, { content });
      setContent('');
      // Re-fetch the comments to show the new one
      mutate(`/posts/${postId}/comments`);
      toast.success('Comment posted!', { id: toastId });
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast.error('Failed to post comment.', { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full"
      />
      <div className="flex justify-end mt-2">
        <Button type="submit" disabled={!content.trim()}>
          Post Comment
        </Button>
      </div>
    </form>
  );
}
