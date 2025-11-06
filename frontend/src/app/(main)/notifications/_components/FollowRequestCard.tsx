'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Button } from '@/src/app/components/ui/Button';
import { UserProfile } from '@/src/app/(main)/profile/[username]/_components/ProfileHeader'; // Re-using this type
import { approveFollowRequest, denyFollowRequest } from '@/src/app/api';
import toast from 'react-hot-toast';

interface FollowRequestCardProps {
  user: UserProfile; // Using UserProfile as it has the fields we need
  onHandleRequest: (userId: number) => void; // Function to remove this card from the list
}

export function FollowRequestCard({ user, onHandleRequest }: FollowRequestCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveFollowRequest(user.id);
      toast.success(`Approved ${user.username}'s request.`);
      onHandleRequest(user.id); // Remove from list
    } catch (err) {
      toast.error('Failed to approve request.');
      setIsLoading(false);
    }
  };

  const handleDeny = async () => {
    setIsLoading(true);
    try {
      await denyFollowRequest(user.id);
      toast.success(`Denied ${user.username}'s request.`);
      onHandleRequest(user.id); // Remove from list
    } catch (err) {
      toast.error('Failed to deny request.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Link href={`/profile/${user.username}`}>
        <div className="flex items-center gap-3 group">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profile_picture_url || ''} alt={user.username} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold group-hover:underline">{user.username}</span>
            <span className="text-sm text-neutral-500">{user.username}</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="bg-brand-sage hover:bg-brand-sage-dark text-white"
          onClick={handleApprove}
          disabled={isLoading}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-neutral-100"
          onClick={handleDeny}
          disabled={isLoading}
        >
          Deny
        </Button>
      </div>
    </div>
  );
}
