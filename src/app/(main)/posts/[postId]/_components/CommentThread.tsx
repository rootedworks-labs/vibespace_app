'use client';

import useSWR from 'swr';
import api from '@/src/app/api';
import { Comment } from './Comment';
import { Spinner } from '@/src/app/components/ui/Spinner';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface CommentThreadProps {
  postId: string;
}

export function CommentThread({ postId }: CommentThreadProps) {
  const { data: comments, error, isLoading } = useSWR(`/posts/${postId}/comments`, fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-gray-500">Could not load comments.</div>;
  }

  return (
    <div className="space-y-4">
      {comments && comments.length > 0 ? (
        comments.map((comment: any) => (
          <Comment key={comment.id} comment={comment} />
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">No comments yet.</p>
      )}
    </div>
  );
}
