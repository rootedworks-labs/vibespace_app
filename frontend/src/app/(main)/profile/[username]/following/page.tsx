'use client';

import { UserList } from '../_components/UserList';

export default function FollowingPage() {
  return (
    <UserList
      title="Following"
      apiEndpointFactory={(username) => `/users/${username}/following`}
      emptyMessage="Not following anyone yet."
    />
  );
}