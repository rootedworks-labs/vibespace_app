'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { useAuthStore } from '@/src/app/store/authStore';
import { LinkIcon } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';
import { FollowButton } from '@/src/app/components/FollowButton';
import { ProfileAura } from '@/src/app/components/prototypes/ProfileAura';
import { vibeConfig } from '@/src/app/components/prototypes/vibe-config';

// Define the shape of the user profile data based on your API
interface UserProfile {
  id: number;
  username: string;
  bio: string | null;
  website: string | null;
  profile_picture_url: string | null;
  following_count: number;
  followers_count: number;
  is_following: boolean;
  dominant_vibe: 'flow' | 'joy' | 'hype' | 'warmth' | 'glow' | 'reflect' | 'love' | null;
  vibe_counts: Partial<Record<'flow' | 'joy' | 'hype' | 'warmth' | 'glow' | 'reflect' | 'love', number>>;
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
        <div className="relative">
          <ProfileAura dominantVibe={user.dominant_vibe} />
          <Avatar key={user.profile_picture_url} className="h-32 w-32 border-4 border-background -mt-16 relative z-10">
            <AvatarImage src={user.profile_picture_url || undefined} />
            <AvatarFallback className="text-4xl">
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 pt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold font-heading">{user.username}</h1>
            {isOwnProfile ? (
              <EditProfileModal user={user} />
            ) : (
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
          <div className="mt-4 flex space-x-4 text-sm">
            <p><span className="font-bold">{user.following_count}</span> Following</p>
            <p><span className="font-bold">{user.followers_count}</span> Followers</p>
          </div>
          {user.vibe_counts && (
            <div className="mt-4 pt-4 border-t flex items-center gap-4 flex-wrap">
              {Object.entries(user.vibe_counts).map(([vibe, count]) => {
                const config = vibeConfig[vibe as keyof typeof vibeConfig];
                if (!config || count === 0) return null;
                const Icon = config.icon;
                return (
                  <div key={vibe} className="flex items-center gap-1.5 text-sm text-neutral-600" title={vibe}>
                    <Icon className={`h-5 w-5 ${config.textColor}`} />
                    <span className="font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
