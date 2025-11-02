'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { fetcher } from '@/src/app/api';
import { ProfileHeader } from './_components/ProfileHeader';
import { UserPostFeed } from './_components/UserPostFeed';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { useAuthStore } from '@/src/app/store/authStore'; // 1. Import the auth store

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  // 2. Get the current user from the store
  const { user: loggedInUser } = useAuthStore();
  console.log('loggedInUser:', loggedInUser);

  // 3. Make the SWR key conditional on 'loggedInUser' being loaded.
  // SWR will not run the fetcher until the key is no longer null.
  // This waits for the auth store to rehydrate.
  const { data: profileUser, error } = useSWR(
    (username && loggedInUser) ? `/users/${username}` : null, 
    fetcher
  );

  if (error) {
    return <div className="text-center text-red-500 py-10">Failed to load profile. Please try again later.</div>;
  }

  // 4. Use the new variable name 'profileUser'
  if (!profileUser) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="h-10 w-10 text-brand-sage" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-1 space-y-8">
      {/* 5. Pass the fetched 'profileUser' to the header */}
      <ProfileHeader user={profileUser} />
      <UserPostFeed username={username} />
    </div>
  );
}
