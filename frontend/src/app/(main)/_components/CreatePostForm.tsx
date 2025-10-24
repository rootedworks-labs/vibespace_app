'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/src/app/store/authStore';
import api from '@/src/app/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Textarea } from '@/src/app/components/ui/TextArea';
import { Button } from '@/src/app/components/ui/Button';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { VibeChannelSelector } from './VibeChannelSelector';
import { VibeType } from '@/src/app/components/prototypes/vibe-config';
import { Paperclip, X } from 'lucide-react';
import Image from 'next/image'; // Use Next.js Image for preview

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [vibeChannelTag, setVibeChannelTag] = useState<VibeType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!content && !mediaFile) {
      toast.error("Your post can't be empty.");
      return;
    }

    setIsSubmitting(true);
    let mediaUrl = null;
    let mediaType = null;

    // 1. Upload media if it exists
    if (mediaFile) {
      try {
        const formData = new FormData();
        formData.append('file', mediaFile);
        const response = await api.post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        mediaUrl = response.data.url;
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
      } catch (error) {
        toast.error('Failed to upload media. Please try again.');
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Create the post
    try {
      await api.post('/posts', {
        content: content,
        media_url: mediaUrl,
        media_type: mediaType,
        vibe_channel_tag: vibeChannelTag,
      });
      
      toast.success('Vibe posted!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-heading font-bold text-brand-deep-blue">Create a new Vibe</h1>
      <div className="flex gap-4">
        {/* User Avatar */}
        <Avatar className="hidden sm:block">
          <AvatarImage src={user?.profile_picture_url || undefined} />
          <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        {/* Text Area */}
        <Textarea
          placeholder="What's on your mind? Share your energy..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 min-h-[120px] bg-white/50 dark:bg-neutral-800/50 border-neutral-200/50 focus-visible:ring-brand-sage"
        />
      </div>

      {/* Media Preview */}
      {mediaPreview && (
        <div className="relative w-full max-w-md ml-auto rounded-lg overflow-hidden border border-neutral-200/50">
          <Image
            src={mediaPreview}
            alt="Media preview"
            width={500}
            height={300}
            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 rounded-full h-8 w-8"
            onClick={removeMedia}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Form Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*"
          />
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5 text-neutral-500" />
          </Button>

          {/* Vibe Channel Selector */}
          <VibeChannelSelector
            
            onVibeSelect={setVibeChannelTag}
          />
        </div>
        
        {/* Post Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="bg-brand-sage hover:bg-brand-sage/90 text-white w-24"
        >
          {isSubmitting ? <Spinner className="h-4 w-4" /> : 'Post Vibe'}
        </Button>
      </div>
    </div>
  );
}
