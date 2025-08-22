'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import api from '@/src/app/api';
import { ProfileHeader } from './_components/ProfileHeader';
import { Spinner } from '@/src/app/components/ui/Spinner';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  // We need an endpoint to fetch a user's public profile by username
  // Let's assume it's GET /users/{username}
  const { data: user, error, isLoading } = useSWR(`/users/${username}`, fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <Spinner />
      </div>
    );
  }

  if (error || !user) {
    return <div className="text-center mt-8">User not found.</div>;
  }

  return (
    <div>
      {/* A placeholder for a cover image */}
      <div className="h-48 bg-neutral-200" /> 
      <div className="container mx-auto -mt-16 relative z-10">
        <ProfileHeader user={user} />
        {/* The user's posts would be rendered here */}
      </div>
    </div>
  );
}