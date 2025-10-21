"use client";

import { useEffect, useRef } from 'react'; // 1. Import useRef
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
    fetcher
  );

  // 2. Use a ref to hold the socket instance. This is the key fix.
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    // 3. Only connect if the socket doesn't already exist in the ref.
    // This prevents the connect/disconnect cycle in React's Strict Mode.
    if (!socketRef.current) {
      // Use the original URL format for your 'ws' library
      const wsUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
        .replace(/^http/, 'ws') + `/?token=${accessToken}`;
      
      console.log(`Attempting to connect WebSocket to: ${wsUrl}`);
      
      socketRef.current = new WebSocket(wsUrl);
      const ws = socketRef.current;

      ws.onopen = () => console.log('WebSocket connected.');
      
      ws.onclose = () => {
        console.log('WebSocket disconnected.');
        socketRef.current = null; // Clear ref on close to allow reconnection on next render
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        socketRef.current = null; // Clear ref on error
      };

      ws.onmessage = (event) => {
        console.log('New notification received:', event.data);
        // Re-fetch the notification list to get the latest data
        mutate(); 
      };
    }

    // 4. The cleanup function runs when the component unmounts.
    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        console.log('Cleaning up and closing WebSocket...');
        socketRef.current.close();
      }
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
        <div className="text-center text-neutral-500 p-4">You have no notifications yet.</div>
      ) : (
        notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))
      )}
    </div>
  );
}

