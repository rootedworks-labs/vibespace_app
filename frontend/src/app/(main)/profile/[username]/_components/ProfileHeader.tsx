'use client';

import { useAuthStore } from '@/src/app/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Button } from '@/src/app/components/ui/Button';
import { ProfileAura } from '@/src/app/components/prototypes/ProfileAura'; // Using your existing prototype
import { VibeType } from '@/src/app/components/prototypes/vibe-config';
import { FollowButton } from '@/src/app/components/FollowButton';

// This defines the complete user profile data the header now expects.
export interface UserProfile {
  id: number;
  username: string;
  bio: string | null;
  profile_picture_url: string | null;
  post_count: number;
  followers_count: number;
  following_count: number;
  dominant_vibe: VibeType | null;
  is_following: boolean;
}

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: currentUser } = useAuthStore();
  const isCurrentUser = currentUser?.id === user.id;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-white/50 dark:bg-neutral-800/20 backdrop-blur-lg p-6 md:p-8 border border-white/30 shadow-lg">
      <div className="relative">
        <ProfileAura dominantVibe={user.dominant_vibe} />
        <Avatar className="h-28 w-28 border-4 border-white shadow-md">
          <AvatarImage src={user.profile_picture_url || undefined} />
          <AvatarFallback className="text-4xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading text-brand-deep-blue">{user.username}</h1>
        {user.bio && <p className="mt-2 max-w-md text-neutral-600">{user.bio}</p>}
      </div>

      <div className="flex items-center gap-8 text-center">
        <div>
          <p className="text-2xl font-bold text-brand-deep-blue">1</p>
          <p className="text-sm text-neutral-500">Posts</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-brand-deep-blue">{user.followers_count}</p>
          <p className="text-sm text-neutral-500">Followers</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-brand-deep-blue">{user.following_count}</p>
          <p className="text-sm text-neutral-500">Following</p>
        </div>
      </div>
      
      {isCurrentUser ? (
        <Button variant="outline">Edit Profile</Button>
      ) : (
        <FollowButton userId={user.id} isFollowing={user.is_following} />
      )}
    </div>
  );
}

