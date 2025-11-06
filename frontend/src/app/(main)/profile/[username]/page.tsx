'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { fetcher } from '@/src/app/api';
import { ProfileHeader, UserProfile } from './_components/ProfileHeader'; // 1. Import UserProfile type
import { UserPostFeed } from './_components/UserPostFeed';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { useAuthStore } from '@/src/app/store/authStore';
import { PrivateProfileMessage } from './_components/PrivateProfileMessage'; // 2. Import the new component

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const { user: loggedInUser } = useAuthStore();

  // Fetch the user's profile data
  // We are assuming this endpoint returns data even for private profiles (e.g., name, bio, privacy status)
  // as per the spec, so ProfileHeader can render.
  const { data: profileUser, error } = useSWR<UserProfile>(
    (username && loggedInUser) ? `/users/${username}` : null, 
    fetcher
  );

  if (error) {
    // This error might be a 404 (User Not Found)
    return <div className="text-center text-red-500 py-10">Failed to load profile. Please try again later.</div>;
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="h-10 w-10 text-brand-sage" />
      </div>
    );
  }

  // --- 3. PRIVACY LOGIC (from Spec 5.3) ---
  
  // Check if the logged-in user is the owner of this profile
  const isOwner = loggedInUser?.id.toString() === profileUser.id.toString();

  // Check if the viewer is authorized to see the feed
  // They are authorized if:
  // 1. The profile is 'public'
  // 2. They are the owner
  // 3. They are an approved follower (profileUser.is_following is true)
  const isAuthorizedToViewFeed = 
    profileUser.account_privacy === 'public' || 
    isOwner || 
    profileUser.is_following;

  // --- END PRIVACY LOGIC ---

  return (
    <div className="flex-1">
      {/* ProfileHeader always renders, as specified */}
      <ProfileHeader user={profileUser} />

      {/* Conditionally render the post feed or the private message */}
      {isAuthorizedToViewFeed ? (
        <UserPostFeed username={username} />
      ) : (
        <PrivateProfileMessage />
      )}
    </div>
  );
}
