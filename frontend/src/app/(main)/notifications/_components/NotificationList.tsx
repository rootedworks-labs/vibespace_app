"use client";

import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { Notification } from '@/lib/types';
import api, { fetcher } from '@/src/app/api'; // Make sure 'api' is imported
import NotificationCard from '@/src/app/(main)/notifications/_components/NotificationCard';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { useAuthStore } from '@/src/app/store/authStore';

export default function NotificationList() {
  const { accessToken } = useAuthStore();
  const { data: notifications, error, mutate } = useSWR<Notification[]>(
    accessToken ? '/notifications' : null,
    fetcher
  );
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    if (!socketRef.current) {
      const wsUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
        .replace(/^http/, 'ws') + `/?token=${accessToken}`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => console.log('WebSocket connected.');
      ws.onclose = () => {
        console.log('WebSocket disconnected.');
        socketRef.current = null;
      };
      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        socketRef.current = null;
      };
      ws.onmessage = (event) => {
        console.log('New notification received:', event.data);
        mutate(); 
      };
    }

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        console.log('Cleaning up and closing WebSocket...');
        socketRef.current.close();
      }
    };
  }, [accessToken, mutate]);

  // --- ADDED THIS USEEFFECT HOOK ---
  useEffect(() => {
    // Check if there are any unread notifications
    if (notifications && notifications.some(n => !n.is_read)) {
      // Use a short timeout to prevent marking as read instantly
      const timer = setTimeout(() => {
        api.patch('/notifications/read')
          .then(() => {
            // Optimistically update the UI without waiting for a re-fetch
            mutate(notifications.map(n => ({ ...n, is_read: true })), false);
          })
          .catch(err => console.error('Failed to mark notifications as read:', err));
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    }
  }, [notifications, mutate]);
  // --- END OF ADDITION ---

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
    <div className="flex flex-col space-y-4 py-4">
      {notifications.length === 0 ? (
        <div className="text-center text-neutral-500 p-4">You have no notifications yet.</div>
      ) : (
        notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))
      )}
    </div>
  );
}

