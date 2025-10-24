'use client';

import useSWR from 'swr';
import { Conversation, Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/Avatar";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { Button } from "@/src/app/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import api, { fetcher } from '@/src/app/api';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { useAuthStore } from '@/src/app/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react'; // 1. `useState` is already imported

interface ConversationViewProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ConversationView({ conversation, onBack }: ConversationViewProps) {
    const { user: currentUser, accessToken } = useAuthStore();
    const { data: messages, error, isLoading, mutate } = useSWR<Message[]>(
        `/conversations/${conversation.id}/messages`, 
        fetcher
    );
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<WebSocket | null>(null);

    // --- 2. ADD STATE FOR TYPING INDICATOR ---
    const [isTyping, setIsTyping] = useState(false);
    const typingIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // --- END ADDITION ---

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- 3. UPDATED WEBSOCKET USEEFFECT ---
    useEffect(() => {
      if (messages && messages.some(msg => !msg.read_at && msg.sender_id !== currentUser?.id)) {
        api.post(`/conversations/${conversation.id}/messages/read`).catch(err => {
          console.error("Failed to mark messages as read:", err);
        });
      }
    }, [messages, currentUser?.id, conversation.id]); // Depends only on messages

    // --- FIX 2: This hook ONLY handles the WebSocket connection and runs ONCE ---
    useEffect(() => {
      if (!accessToken) return;

      const wsUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/^http/, 'ws') + `/?token=${accessToken}`;
      socketRef.current = new WebSocket(wsUrl);
      const ws = socketRef.current;

      ws.onopen = () => console.log('WebSocket connected for messages.');
      ws.onclose = () => { socketRef.current = null; };
      ws.onerror = (err) => { console.error('WebSocket error:', err); socketRef.current = null; };

      ws.onmessage = (event) => {
        try {
          const incomingData = JSON.parse(event.data);
          const { type, payload } = incomingData;

          if (type === 'new_message' && payload.conversation_id === conversation.id) {
            setIsTyping(false); 
            if (typingIndicatorTimeoutRef.current) clearTimeout(typingIndicatorTimeoutRef.current);
            mutate();
          } else if (type === 'messages_read' && payload.conversation_id === conversation.id) {
            mutate();
          } else if (type === 'start_typing' && payload.conversation_id === conversation.id) {
            console.log('sender typing');
            setIsTyping(true);
            if (typingIndicatorTimeoutRef.current) clearTimeout(typingIndicatorTimeoutRef.current);
            typingIndicatorTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000); 
          } else if (type === 'stop_typing' && payload.conversation_id === conversation.id) {
            console.log('sender stopped typing')
            setIsTyping(false);
            if (typingIndicatorTimeoutRef.current) clearTimeout(typingIndicatorTimeoutRef.current);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
      
      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
          socketRef.current = null;
        }
      };
      // We pass an empty dependency array to ensure this hook runs ONLY ONCE
      // on mount, establishing a single, stable WebSocket connection.
    }, [accessToken, conversation.id, mutate]);

    const user = conversation.user;
    const name = user?.username || 'Deleted User';
    const avatarUrl = user?.profile_picture_url;

    return (
       // console.log(conversation),
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
                
                {/* --- 5. ADDED TYPING INDICATOR UI --- */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                    className="flex items-center gap-2 p-2"
                  >
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={avatarUrl || undefined} />
                        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {/* Pulsing dots animation */}
                    <div className="flex gap-1 items-center">
                        <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></span>
                    </div>
                  </motion.div>
                )}
                {/* --- END ADDITION --- */}

                <div ref={messagesEndRef} />
            </motion.div>

            {/* Input */}
            <div className="p-4 border-t">
                {/* --- 6. PASS SOCKET AND RECIPIENTID TO MESSAGEINPUT --- */}
                <MessageInput 
                  conversationId={conversation.id}
                  recipientId={conversation.user.id}
                  socket={socketRef.current}
                  onStartTyping={() => {}} // Props are required by the interface
                  onStopTyping={() => {}}  // but logic is handled by onChange
                />
                {/* --- END ADDITION --- */}
            </div>
        </div>
    );
}

