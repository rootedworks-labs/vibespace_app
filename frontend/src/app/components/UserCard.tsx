import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { FollowButton } from './FollowButton';
import { Card, CardContent } from './ui/Card';
import Link from 'next/link';

interface User {
  username: string;
  profile_picture_url?: string | null;
  is_following_viewer: boolean;
}

export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <Link href={`/profile/${user.username}`} className="flex items-center gap-4 group">
          <Avatar>
            <AvatarImage src={user.profile_picture_url ?? undefined} />
            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="font-bold group-hover:underline">{user.username}</p>
        </Link>
        <FollowButton 
          
          username={user.username} 
          isFollowing={user.is_following_viewer} // <-- Make sure this line exists
        />
      </CardContent>
    </Card>
  );
}