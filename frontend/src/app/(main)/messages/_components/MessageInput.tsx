'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/src/app/api';
import toast from 'react-hot-toast';
import { Button } from "@/src/app/components/ui/Button";
import { Send, Paperclip } from "lucide-react"; // Import Paperclip
import { useState, useRef } from 'react'; // Import hooks
import { Spinner } from '@/src/app/components/ui/Spinner';
import { cn } from '@/lib/utils';

const messageSchema = z.object({
  content: z.string(), // Content is now optional for image-only messages
});

interface MessageInputProps {
  conversationId: number;
}

// --- NEW: Regular expression to detect if a string is a GIF URL ---
const isGifUrl = (url: string) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:gif)/i.test(url.trim());
};
// --- END NEW ---

export function MessageInput({ conversationId }: MessageInputProps) {
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: '' },
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reusable function to send a message payload to the backend
    const sendMessage = async (messageData: { content?: string; media_url?: string; media_type?: string }) => {
        await api.post(`/conversations/${conversationId}/messages`, messageData);
    };

    // Handles sending of text messages
    const onTextSubmit = async (values: z.infer<typeof messageSchema>) => {
        const content = values.content.trim();
        if (!content) return; // Don't send empty messages

        form.reset();

        try {
            // --- MODIFICATION: Check if the content is a GIF link ---
            if (isGifUrl(content)) {
                // If it is, send it as a media message
                await sendMessage({ media_url: content, media_type: 'image/gif' });
            } else {
                // Otherwise, send it as a normal text message
                await sendMessage({ content: content });
            }
            // --- END MODIFICATION ---
        } catch (error) {
            toast.error("Failed to send message.");
            form.setValue('content', content); // Restore content on error
        }
    };

    // Handles file selection and upload
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/uploads', formData);
            const { url } = response.data; // Assumes your API returns { url: '...' }
            await sendMessage({ media_url: url, media_type: file.type });
        } catch (error) {
            toast.error('File upload failed.');
        } finally {
            setIsUploading(false);
            // Clear the file input value so the same file can be selected again
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };

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
                    {...form.register('content')}
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

