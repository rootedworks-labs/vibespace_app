'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';
import toast from 'react-hot-toast';

import { Button } from "@/src/app/components/ui/Button";
import { Send } from "lucide-react";

const messageSchema = z.object({
  content: z.string().min(1, "Message can't be empty"),
});

interface MessageInputProps {
  conversationId: number;
}

export function MessageInput({ conversationId }: MessageInputProps) {
    const { mutate } = useSWRConfig();
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: '' },
    });

    const onSubmit = async (values: z.infer<typeof messageSchema>) => {
        const tempId = Date.now(); // Create a temporary ID for the optimistic update
        const originalContent = values.content;
        form.reset();

        try {
            // Optimistically update the UI with the new message
            mutate(`/conversations/${conversationId}/messages`, async (currentMessages: any[] = []) => {
                // The API should return the new message object upon creation
                const newMessage = await api.post(`/conversations/${conversationId}/messages`, { content: originalContent });
                return [...currentMessages, newMessage.data];
            }, false);
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
            // Optionally, you could add logic here to revert the optimistic update on failure
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <input 
                {...form.register('content')}
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-full border bg-transparent focus:ring-2 focus:ring-brand-sage focus:outline-none"
                autoComplete="off"
            />
            <Button type="submit" className="rounded-full h-12 w-12 p-0 flex-shrink-0" disabled={form.formState.isSubmitting}>
                <Send size={20} />
            </Button>
        </form>
    );
}

