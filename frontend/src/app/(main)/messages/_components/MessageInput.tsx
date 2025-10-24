'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/src/app/api';
import toast from 'react-hot-toast';
import { Button } from "@/src/app/components/ui/Button";
import { Send, Paperclip } from "lucide-react";
import { useState, useRef } from 'react';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { cn } from '@/lib/utils';

const messageSchema = z.object({
  content: z.string(),
});

interface MessageInputProps {
  conversationId: number;
  // --- ADDED THESE PROPS ---
  recipientId: string | number; // Required to send the typing event
  socket: WebSocket | null;     // The active WebSocket connection
  onStartTyping: () => void;  // Keep props, even if logic is handled here
  onStopTyping: () => void;   // Keep props, even if logic is handled here
  // --- END ADDITION ---
}

const isGifUrl = (url: string): boolean => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:gif)/i.test(url.trim());
};

export function MessageInput({ conversationId, recipientId, socket, onStartTyping, onStopTyping }: MessageInputProps) {
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: '' },
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // --- ADDED: Ref to manage typing timeout ---
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // --- ADDED: Helper to send WebSocket messages ---
    const sendWebSocketMessage = (type: string, payload: any) => {
        
      if (socket?.readyState === WebSocket.OPEN) {
        //console.log('sending', type, payload);
        socket.send(JSON.stringify({ type, payload }));
      }
    };

    const sendMessage = async (messageData: { content?: string; media_url?: string; media_type?: string }) => {
        await api.post(`/conversations/${conversationId}/messages`, messageData);
    };

    const onTextSubmit = async (values: z.infer<typeof messageSchema>) => {
        // --- ADDED: Stop typing when message is sent ---
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        sendWebSocketMessage('stop_typing', { conversationId, recipientId });
        // --- END ADDITION ---

        const content = values.content.trim();
        if (!content) return;
        form.reset();

        try {
            if (isGifUrl(content)) {
                await sendMessage({ media_url: content, media_type: 'image/gif' });
            } else {
                await sendMessage({ content: content });
            }
        } catch (error) {
            toast.error("Failed to send message.");
            form.setValue('content', content);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            const { url } = response.data;
            await sendMessage({ media_url: url, media_type: file.type.startsWith('image/') ? 'image' : 'other' });

        } catch (error) {
            toast.error('File upload failed. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
        }
    };

    // --- ADDED: Handler for text input changes ---
    const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        // Send the start_typing event
        sendWebSocketMessage('start_typing', { conversationId, recipientId });

        // Clear any existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set a new timeout to send 'stop_typing' after 2 seconds
        typingTimeoutRef.current = setTimeout(() => {
            sendWebSocketMessage('stop_typing', { conversationId, recipientId });
        }, 2000); // 2 seconds of inactivity
        
        // Manually update react-hook-form state
        form.setValue('content', event.target.value);
    };
    // --- END ADDITION ---

    return (
        
        <>
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
            />
            <form onSubmit={form.handleSubmit(onTextSubmit)} className="flex items-center gap-2 p-2 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-[var(--color-brand-sand)] dark:bg-neutral-900">
                <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full h-11 w-11 p-0 flex-shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? <Spinner className="h-5 w-5" /> : <Paperclip size={20} />}
                </Button>

                <input 
                    // --- MODIFIED: Use value/onChange to capture typing ---
                    value={form.watch('content')}
                    onChange={handleTyping}
                    // --- END MODIFICATION ---
                    type="text"
                    placeholder="Type your message..."
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-full border border-neutral-300/50 dark:border-neutral-700/50",
                      "bg-white/70 dark:bg-neutral-800/50",
                      "focus:ring-2 focus:ring-[var(--color-brand-sage)] focus:outline-none",
                      "placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm"
                    )}
                    autoComplete="off"
                    disabled={isUploading}
                />
                <Button type="submit" className="rounded-full h-11 w-11 p-0 flex-shrink-0" disabled={form.formState.isSubmitting || isUploading}>
                    <Send size={18} />
                </Button>
            </form>
        </>
    );
}
