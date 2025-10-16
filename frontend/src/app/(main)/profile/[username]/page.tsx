'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { fetcher } from '@/src/app/api';
import { ProfileHeader } from './_components/ProfileHeader';
import { UserPostFeed } from './_components/UserPostFeed';
import { Spinner } from '@/src/app/components/ui/Spinner';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  // Fetch the user's profile data from the correct endpoint
  const { data: user, error } = useSWR(username ? `/users/${username}` : null, fetcher);

  if (error) {
    return <div className="text-center text-red-500 py-10">Failed to load profile. Please try again later.</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="h-10 w-10 text-brand-sage" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <ProfileHeader user={user} />
      <UserPostFeed username={username} />
    </div>
  );
}

