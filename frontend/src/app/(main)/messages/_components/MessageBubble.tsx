import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MessageBubbleProps {
    message: Message;
    currentUserId?: number;
}

const bubbleVariants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
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
        "max-w-xs md:max-w-sm",
        "shadow-md overflow-hidden",
        isCurrentUser
          ? "bg-[var(--color-brand-sage)] text-white rounded-t-2xl rounded-bl-2xl"
          : "bg-white dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-t-2xl rounded-br-2xl",
        message.media_url && !message.content ? "p-1.5" : "px-4 py-3"
      )}>

        {message.media_url && (
            // --- FIX: Replaced w-full with a fixed width (w-64) and used aspect-square ---
            // This forces the container to be a consistent size, fixing the collapse issue.
            <div 
              className="relative w-64 aspect-square cursor-pointer"
              onClick={() => window.open(message.media_url, '_blank')}
            >
                <Image
                    src={message.media_url}
                    alt="Message attachment"
                    fill
                    style={{ objectFit: 'cover' }}
                    // Updated sizes to reflect the new fixed width
                    sizes="256px"
                />
            </div>
        )}
        
        {message.content && (
            <p className={cn("break-words text-sm", message.media_url ? "p-3" : "")}>
                {message.content}
            </p>
        )}
      </div>
    </motion.div>
  );
}

