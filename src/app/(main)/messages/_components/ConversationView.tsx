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
    const { user: currentUser } = useAuthStore();
    const { data: messages, error, isLoading } = useSWR<Message[]>(`/conversations/${conversation.id}/messages`, fetcher);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
                
                {/* MODIFICATION: Wrap the message list in AnimatePresence */}
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

