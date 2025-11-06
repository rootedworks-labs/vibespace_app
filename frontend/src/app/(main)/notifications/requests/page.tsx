'use client';

import useSWR from 'swr';
import { fetcher } from '@/src/app/api';
import { UserProfile } from '@/src/app/(main)/profile/[username]/_components/ProfileHeader'; // Re-using this type
import { Spinner } from '@/src/app/components/ui/Spinner';
import { FollowRequestCard } from '../_components/FollowRequestCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FollowRequestsPage() {
  const { data: requests, error, isLoading, mutate } = useSWR<UserProfile[]>(
    '/follow-requests', // The new API endpoint
    fetcher
  );

  // This function will be passed to the card to optimistically remove it from the list
  const handleRequestOptimistic = (userId: number) => {
    if (!requests) return;
    // Filter out the user who was just handled
    const updatedRequests = requests.filter((user) => user.id !== userId);
    // Update the SWR cache without re-fetching
    mutate(updatedRequests, false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500">Failed to load requests.</p>;
    }
    if (!requests || requests.length === 0) {
      return <p className="text-center text-neutral-500 py-10">No pending follow requests.</p>;
    }
    return (
      <div className="border rounded-lg bg-white">
        {requests.map((user) => (
          <FollowRequestCard
            key={user.id}
            user={user}
            onHandleRequest={handleRequestOptimistic}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/notifications" className="p-2 rounded-full hover:bg-neutral-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-heading font-bold">Follow Requests</h1>
      </div>
      {renderContent()}
    </div>
  );
}
