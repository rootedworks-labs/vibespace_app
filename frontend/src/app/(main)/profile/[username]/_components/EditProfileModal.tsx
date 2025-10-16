// app/(main)/profile/[username]/_components/EditProfileModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import toast from 'react-hot-toast';

import { Button } from '@/src/app/components/ui/Button';
import { Input } from '@/src/app/components/ui/Input';
import { Textarea } from '@/src/app/components/ui/TextArea';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/src/app/components/ui/Modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { useAuthStore } from '@/src/app/store/authStore';

// 1. Update the validation schema to use 'website_url'
const profileFormSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  bio: z.string().max(200, { message: 'Bio cannot exceed 200 characters.' }).nullable(),
  website_url: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')).nullable(),
});

export function EditProfileModal({ user }: { user: any }) {
  const { mutate } = useSWRConfig();
  const { user: currentUser, login } = useAuthStore();
  const [open, setOpen] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.profile_picture_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Set up react-hook-form with the updated schema and default values
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user.username || '',
      bio: user.bio || '',
      website_url: user.website_url || '',
    },
  });
  
  const { isSubmitting, errors } = form.formState;

  useEffect(() => {
    if (open) {
      form.reset({
        username: user.username || '',
        bio: user.bio || '',
        website_url: user.website_url || '',
      });
      setAvatarPreview(user.profile_picture_url);
      setAvatarFile(null);
    }
  }, [open, user, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // The 'values' object passed to onSubmit will now have the correct shape
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    const toastId = toast.loading('Updating profile...');
    let newAvatarUrl = user.profile_picture_url;

    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const response = await api.post('/users/me/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newAvatarUrl = response.data.profile_picture_url;
      }

      // The 'values' object now correctly contains 'website_url' for the API call
      await api.patch('/users/me', values);

      if (currentUser) {
        const updatedUser = { ...currentUser, profile_picture_url: newAvatarUrl, username: values.username || currentUser.username };
        const token = useAuthStore.getState().accessToken;
        if (token) {
          login(token, updatedUser);
        }
      }
      
      mutate(`/users/${user.username}`);
      toast.success('Profile updated!', { id: toastId });
      setOpen(false);
    } catch (error) {
      toast.error('Failed to update profile.', { id: toastId });
      console.error('Profile update failed:', error);
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit Your Profile</ModalTitle>
        </ModalHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <AvatarImage src={avatarPreview ?? undefined} />
                <AvatarFallback className="text-3xl">{form.getValues('username')?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
            </div>
            <div className="space-y-1">
              <label htmlFor="username">Username</label>
              <Input id="username" {...form.register('username')} />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="bio">Bio</label>
              <Textarea id="bio" {...form.register('bio')} />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
            </div>
            {/* 3. Update the JSX to register 'website_url' */}
            <div className="space-y-1">
              <label htmlFor="website_url">Website</label>
              <Input id="website_url" placeholder="https://your.website" {...form.register('website_url')} />
              {errors.website_url && <p className="text-sm text-red-500">{errors.website_url.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}

