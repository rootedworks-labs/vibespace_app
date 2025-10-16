"use client";

import { useEffect } from 'react';
import useSWR from 'swr';
import { Notification } from '@/lib/types';
import { fetcher } from '@/src/app/api';
import NotificationCard from '@/src/app/(main)/notifications/_components/NotificationCard';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { useAuthStore } from '@/src/app/store/authStore';

export default function NotificationList() {
  const { accessToken } = useAuthStore();
  const { data: notifications, error, mutate } = useSWR<Notification[]>(
    accessToken ? '/notifications' : null,
    fetcher // Use the permanent, global fetcher
  );

  useEffect(() => {
    if (!accessToken) return;

    // Updated WebSocket URL to match the backend documentation
    const wsUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
      .replace('http', 'ws') + `/notifications/ws?token=${accessToken}`;
      
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('WebSocket connected');
    ws.onclose = () => console.log('WebSocket disconnected');
    ws.onerror = (err) => console.error('WebSocket error:', err);

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      mutate((currentNotifications = []) => [newNotification, ...currentNotifications], false);
    };

    return () => {
      ws.close();
    };
  }, [accessToken, mutate]);

  if (error) return <div className="text-center text-red-500">Failed to load notifications.</div>;
  if (!notifications) return (
    <div className="flex justify-center items-center h-40">
      <Spinner className="h-8 w-8 text-brand-sage" />
    </div>
  );

  if (!Array.isArray(notifications)) {
    console.error("Expected notifications to be an array, but received:", notifications);
    return <div className="text-center text-red-500">Received invalid data format.</div>;
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-neutral-500">You have no notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))
      )}
    </div>
  );
}

