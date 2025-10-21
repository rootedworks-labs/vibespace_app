'use client';

import useSWR from 'swr';
import { Conversation, Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/Avatar";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { Button } from "@/src/app/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { fetcher } from '@/src/app/api';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { useAuthStore } from '@/src/app/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ConversationViewProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ConversationView({ conversation, onBack }: ConversationViewProps) {
    const { user: currentUser, accessToken } = useAuthStore(); // 1. Get accessToken
    const { data: messages, error, isLoading, mutate } = useSWR<Message[]>(
      `/conversations/${conversation.id}/messages`, 
      fetcher
    );
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // 2. Add a ref to hold the stable WebSocket instance
    const socketRef = useRef<WebSocket | null>(null);

    // Effect for scrolling down when new messages appear
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 3. Add a new useEffect to manage the WebSocket connection using the 'ws' library pattern
    useEffect(() => {
      if (!accessToken) return;
  
      // Connect only if the socket isn't already created in the ref
      if (!socketRef.current) {
        const wsUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
          .replace(/^http/, 'ws') + `/?token=${accessToken}`;
        
        console.log(`Attempting to connect WebSocket for messages: ${wsUrl}`);
        
        socketRef.current = new WebSocket(wsUrl);
        const ws = socketRef.current;
  
        ws.onopen = () => console.log('WebSocket connected for messages.');
        
        ws.onclose = () => {
          console.log('WebSocket disconnected for messages.');
          socketRef.current = null;
        };
  
        ws.onerror = (err) => {
          console.error('WebSocket error in messages:', err);
          socketRef.current = null;
        };
  
        // 4. Listen for incoming messages
        ws.onmessage = (event) => {
          try {
            const incomingData = JSON.parse(event.data);

            // Check if the incoming data is a new message object
            if (incomingData && incomingData.type === 'new_message') {
                const newMessage: Message = incomingData.payload;
                console.log('New message received via WebSocket:', newMessage);
                
                // Only update if the message belongs to the currently viewed conversation
                if (newMessage.conversation_id === conversation.id) {
                  // Use mutate to re-fetch the message list, which will update the UI
                  mutate();
                }
            }
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };
      }
  
      // The cleanup function runs when the component unmounts
      return () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          console.log('Cleaning up and disconnecting messages socket...');
          socketRef.current.close();
          socketRef.current = null;
        }
      };
    }, [accessToken, conversation.id, mutate]);


    // Safely handle cases where the user may have been deleted.
    const user = conversation.user;
    const name = user?.username || 'Deleted User';
    const avatarUrl = user?.profile_picture_url;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center p-4 border-b gap-4 bg-white/30">
                <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 p-0" onClick={onBack}>
                    <ArrowLeft size={20} />
                </Button>
                <Avatar>
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{name}</h3>
            </div>

            {/* Messages */}
            <motion.div layout className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-br from-brand-sand/20 via-white to-white">
                {isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <Spinner />
                    </div>
                )}
                {error && <p className="text-center text-red-500">Failed to load messages.</p>}
                
                <AnimatePresence>
                    {messages?.map(msg => (
                        <MessageBubble key={msg.id} message={msg} currentUserId={currentUser?.id} />
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </motion.div>

            {/* Input */}
            <div className="p-4 border-t">
                <MessageInput conversationId={conversation.id} />
            </div>
        </div>
    );
}

