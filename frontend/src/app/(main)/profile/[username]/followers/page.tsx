'use client';

import { UserList } from '../_components/UserList';

export default function FollowersPage() {
  return (
    <UserList
      title="Followers"
      apiEndpointFactory={(username) => `/users/${username}/followers`}
      emptyMessage="No followers yet."
    />
  );
}