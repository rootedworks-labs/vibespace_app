import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import { useAuthStore } from '../../store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Button } from '@/src/app/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/src/app/components/ui/Card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/app/components/ui/DropdownMenu';
import { Heart, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

// Define the shape of a post object based on your API
interface Post {
  id: number;
  user_id: number; // Check for ownership
  username: string;
  profile_picture_url: string | null;
  content: string;
  created_at: string;
  like_count: number;
  has_liked: boolean;
}

export function PostCard({ post }: { post: Post }) {
  const { mutate } = useSWRConfig();
  const { user: currentUser } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLikeToggle = async () => {
    // Optimistically update the UI
    mutate(
      '/posts',
      (currentPosts: Post[] | undefined) => {
        if (!currentPosts) return [];
        return currentPosts.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              has_liked: !p.has_liked,
              like_count: p.has_liked ? p.like_count - 1 : p.like_count + 1,
            };
          }
          return p;
        });
      },
      false // Prevent revalidation immediately
    );

    // Send the request to the backend
    try {
      if (post.has_liked) {
        await api.delete(`/posts/${post.id}/like`);
      } else {
        await api.post(`/posts/${post.id}/like`);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // If the request fails, revalidate to get the correct state from the server
      mutate('/posts');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${post.id}`);
      mutate('/posts');
    } catch (error) {
      console.error('Failed to delete post:', error);
      setIsDeleting(false);
    }
  };

  const isAuthor = currentUser?.id === post.user_id;

  return (
    <Card className={`rounded-none border-x-0 border-t-0 border-b ${isDeleting ? 'opacity-50' : ''}`}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.profile_picture_url ?? undefined} />
              <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{post.username}</p>
              <p className="text-sm text-neutral-500">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 cursor-pointer">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-foreground/90">{post.content}</p>
        <div className="flex items-center mt-4">
          <Button variant="ghost" size="sm" onClick={handleLikeToggle} className="flex items-center gap-2 text-neutral-500 hover:text-red-500">
            <Heart className={`h-4 w-4 ${post.has_liked ? 'fill-red-500 text-red-500' : ''}`} />
            {post.like_count}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}