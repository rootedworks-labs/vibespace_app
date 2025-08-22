'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Button } from '@/src/app/components/ui/Button';
import { useAuthStore } from '@/src/app/store/authStore';
import { LinkIcon } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';
import { FollowButton } from '@/src/app/components/FollowButton'; // Make sure FollowButton is created

// Define the shape of the user profile data based on your API
interface UserProfile {
  id: number;
  username: string;
  bio: string | null;
  website: string | null;
  profile_picture_url: string | null;
  following_count: number;
  followers_count: number;
  is_following: boolean; // Note: Changed from optional to required for the FollowButton
}

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="border bg-background rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-6">
        <Avatar key={user.profile_picture_url} className="h-32 w-32 border-4 border-background -mt-16">
          <AvatarImage src={user.profile_picture_url || undefined} />
          <AvatarFallback className="text-4xl">
            {user.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 pt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold font-heading">{user.username}</h1>
            {isOwnProfile ? (
              <EditProfileModal user={user} />
            ) : (
              // --- UPDATE THIS SECTION ---
              // Replace the static Button with the functional FollowButton component
              <FollowButton username={user.username} initialIsFollowing={user.is_following} />
            )}
          </div>
          <p className="mt-2 text-sm text-foreground/80">{user.bio || 'This user has not set a bio.'}</p>
          {user.website && (
            <a href={user.website} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline">
              <LinkIcon className="h-4 w-4" />
              {user.website.replace(/^(https?:\/\/)?(www\.)?/, '')}
            </a>
          )}
          {/* --- UPDATE THIS SECTION --- */}
          {/* Replace the hardcoded stats with dynamic data from the user prop */}
          <div className="mt-4 flex space-x-4 text-sm">
            <p><span className="font-bold">{user.following_count}</span> Following</p>
            <p><span className="font-bold">{user.followers_count}</span> Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
}