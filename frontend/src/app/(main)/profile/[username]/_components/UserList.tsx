'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/src/app/api';
import { UserCard } from '@/src/app/components/UserCard';
import { UserProfile } from './ProfileHeader'; // Import your type

// Define the props our new component will accept
interface UserListProps {
  title: string;
  apiEndpointFactory: (username: string) => string;
  emptyMessage: string;
}

export function UserList({ title, apiEndpointFactory, emptyMessage }: UserListProps) {
  const params = useParams();
  const username = params.username as string;

  // Use the props to build the SWR key
  const { data: users, error, isLoading } = useSWR<UserProfile[]>(
    username ? apiEndpointFactory(username) : null,
    fetcher
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 1. Use the title prop */}
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Failed to load users.</p>}

      {/* 2. Use the emptyMessage prop */}
      {users && users.length === 0 && <p>{emptyMessage}</p>}
      
      {/* 3. The rendering logic is the same */}
      {users && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard 
              key={user.id} 
              // --- FIX: Ensure the passed object matches the 'User' type ---
              // You might need to adjust this mapping based on the exact
              // differences between UserProfile and the User type UserCard expects.
              // Here, we provide a default for is_following_viewer.
              user={{
                
                username: user.username,
                
                profile_picture_url: user.profile_picture_url,

                is_following_viewer: user.is_following_viewer ?? false, 
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}