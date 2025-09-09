"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/src/app/store/authStore';
import api from '@/src/app/api';
import toast from 'react-hot-toast';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Button } from '@/src/app/components/ui/Button';
import { Card } from '@/src/app/components/ui/Card';
import { Textarea } from '@/src/app/components/ui/TextArea';
import { FileUploader } from '@/src/app/components/FileUploader';
import { VibeChannelSelector, VibeType } from './VibeChannelSelector';
import { ConsentModal } from '@/src/app/components/ConsentModal';
import { Image as ImageIcon, X } from 'lucide-react';

const postSchema = z.object({
  text: z.string().min(1, "Post can't be empty").max(280, "Post can't exceed 280 characters"),
  vibeChannel: z.string().nullable(),
});

type PostFormData = z.infer<typeof postSchema>;

export function CreatePostForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [needsConsent, setNeedsConsent] = useState(false); // State to control the modal

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { text: '', vibeChannel: null },
  });

  const { formState: { isSubmitting }, watch, setValue } = form;
  const textValue = watch('text');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };
  
  const removeFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const attemptSubmit = async () => {
    const data = form.getValues();
    const formData = new FormData();
    formData.append('text', data.text);
    if (data.vibeChannel) formData.append('vibe_channel_tag', data.vibeChannel);
    if (file) formData.append('media', file);

    try {
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Your vibe has been shared!');
      router.push('/feed');
      router.refresh();
    } catch (error: any) {
      if (error.response?.data?.error === 'Consent required for this action') {
        setNeedsConsent(true);
      } else {
        toast.error('Something went wrong. Please try again.');
        console.error('Failed to create post:', error);
      }
    }
  };

  const onConsentGranted = () => {
    setNeedsConsent(false);
    attemptSubmit(); // Retry the submission after consent.
  };

  const SubmitButton = () => (
    <Button type="submit" disabled={isSubmitting || !textValue.trim()}>
      {isSubmitting ? 'Sharing...' : 'Share Vibe'}
    </Button>
  );

  return (
    <Card className="p-4 sm:p-6 max-w-2xl mx-auto">
      <form onSubmit={form.handleSubmit(attemptSubmit)} className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={user?.profile_picture_url || undefined} />
            <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <Textarea
              {...form.register('text')}
              placeholder="Share your energy..."
              className="w-full text-lg border-none focus:ring-0 resize-none p-0"
              rows={4}
            />
            {preview && (
              <div className="mt-4 relative">
                <img src={preview} alt="Preview" className="rounded-lg w-full h-auto" />
                <Button 
                  type="button"
                  variant="destructive" 
                  size="sm"
                  className="absolute top-2 right-2 rounded-full h-8 w-8 p-0"
                  onClick={removeFile}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {form.formState.errors.text && <p className="text-sm text-red-500">{form.formState.errors.text.message}</p>}

        <VibeChannelSelector 
          onVibeSelect={(vibe) => setValue('vibeChannel', vibe)} 
        />
        
        <div className="flex justify-between items-center pt-2 border-t">
          <FileUploader onFileSelect={handleFileSelect}>
            <button type="button" className="text-brand-sage hover:text-brand-sage/80 transition-colors">
              <ImageIcon size={24} />
            </button>
          </FileUploader>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">
              {textValue.length} / 280
            </span>
            {needsConsent ? (
              <ConsentModal
                consentType="file_upload"
                title="Permission to Upload"
                description="To upload files, VibeSpace needs your consent to store your content. This helps us manage your data responsibly."
                onConsentGranted={onConsentGranted}
              >
                <SubmitButton />
              </ConsentModal>
            ) : (
              <SubmitButton />
            )}
          </div>
        </div>
      </form>
    </Card>
  );
}

