'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Card } from '@/src/app/components/ui/Card';
import { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';

// A simple utility to format time since the notification was created
const timeSince = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
};

const getNotificationLink = (notification: Notification): string => {
  if (notification.type === 'FOLLOW') {
    return `/profile/${notification.actor.username}`;
  }
  if (notification.post_id) {
    return `/posts/${notification.post_id}`;
  }
  return '#';
};


const NotificationCard = ({ notification }: { notification: Notification }) => {
  const getMessage = () => {
    switch (notification.type) {
      case 'VIBE':
        return 'vibed with your post.';
      case 'COMMENT':
        return 'commented on your post.';
      case 'FOLLOW':
        return 'started following you.';
      default:
        return '';
    }
  };

  return (
    <Link href={getNotificationLink(notification)}>
      <Card className={cn(
        "p-4 flex items-center space-x-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
        !notification.read && "bg-brand-sand/30 dark:bg-brand-sand/10"
      )}>
        <Avatar>
          <AvatarImage src={notification.actor.profile_picture_url || ''} alt={notification.actor.username} />
          <AvatarFallback>{notification.actor.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p>
            <span className="font-bold">{notification.actor.username}</span> {getMessage()}
          </p>
          <p className="text-sm text-gray-500">{timeSince(notification.created_at)}</p>
        </div>
        {!notification.read && (
          <div className="w-3 h-3 bg-brand-terracotta rounded-full" />
        )}
      </Card>
    </Link>
  );
};

export default NotificationCard;

