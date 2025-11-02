import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCheck } from 'lucide-react'; // 1. Import an icon for the read receipt
import { LinkPreviewCard } from '@/src/app/components/LinkPreviewCard';
import { LinkPreview } from '@/lib/types';


interface MessageBubbleProps {
    message: Message;
    currentUserId?: number;
}

const bubbleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

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
    if (seconds < 10) return "Just now";
    return Math.floor(seconds) + "s";
};

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isCurrentUser = message.sender_id === currentUserId;

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      layout
      className={cn(
        "flex items-end gap-2",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-xs md:max-w-md px-4 py-3",
        isCurrentUser 
          ? "bg-brand-sage text-white rounded-t-2xl rounded-bl-2xl" 
          : "bg-white border rounded-t-2xl rounded-br-2xl"
      )}>

        {message.media_url && (
            <div 
              className="relative w-64 aspect-square cursor-pointer"
              onClick={() => window.open(message.media_url, '_blank')}
            >
                <Image
                    src={message.media_url}
                    alt="Message attachment"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="256px"
                />
            </div>
        )}

        {/* This part remains unchanged */}
        <p className="break-words">{message.content}</p>

        {/* --- 7. Render LinkPreviewCard --- */}
        {/* Show preview if NO media and data exists */}
        {!message.media_url && message.link_preview_data && (
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <LinkPreviewCard data={message.link_preview_data as LinkPreview} />
          </div>
        )}

        {/* --- 2. ADDED THE READ INDICATOR LOGIC HERE --- */}
        <div className="flex items-center justify-end text-xs mt-2">
            <span className={cn(isCurrentUser ? "text-white/70" : "text-neutral-400")}>
                {timeSince(message.created_at)}
            </span>
            {isCurrentUser && message.read_at && (
                <CheckCheck className="h-4 w-4 text-white/80 ml-1.5" />
            )}
        </div>
        {/* --- END OF CHANGE --- */}
      </div>
    </motion.div>
  );
}

