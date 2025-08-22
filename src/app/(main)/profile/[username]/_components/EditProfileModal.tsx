// app/(main)/profile/[username]/_components/EditProfileModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
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

export function EditProfileModal({ user }: { user: any }) {
  const { mutate } = useSWRConfig();
  const { user: currentUser, login } = useAuthStore(); // Get the login function from the store
  const [open, setOpen] = useState(false);

  // State for form fields
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [website, setWebsite] = useState(user.website || '');

  // State for avatar upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.profile_picture_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset form when modal is opened
    if (open) {
      setUsername(user.username);
      setBio(user.bio || '');
      setWebsite(user.website || '');
      setAvatarPreview(user.profile_picture_url);
      setAvatarFile(null);
    }
  }, [open, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Create a temporary URL to preview the new image
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    let newAvatarUrl = user.profile_picture_url;

    // 1. Upload avatar if a new one is selected
    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      // The backend returns the new URL of the uploaded avatar
      const response = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      newAvatarUrl = response.data.profile_picture_url;
    }

    // 2. Update profile text fields
    await api.patch('/users/me', { username, bio, website });

    // 3. Update the global state with the new avatar URL
    if (currentUser) {
      const updatedUser = { ...currentUser, profile_picture_url: newAvatarUrl };
      const token = useAuthStore.getState().accessToken;
      if (token) {
        login(token, updatedUser);
      }
    }
    
    // 4. Tell SWR to re-fetch user data to update the UI across the app
    mutate(`/users/${username}`);
    setOpen(false); // Close the modal
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
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <AvatarImage src={avatarPreview ?? undefined} />
              <AvatarFallback className="text-3xl">{username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
            <Button variant="link" size="sm" onClick={() => fileInputRef.current?.click()}>
              Change Photo
            </Button>
          </div>
          <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <Textarea id="bio" placeholder="Your bio" value={bio} onChange={e => setBio(e.target.value)} />
          <Input id="website" placeholder="your.website" value={website} onChange={e => setWebsite(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </ModalContent>
    </Modal>
  );
}