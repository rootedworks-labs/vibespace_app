import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';
import { motion } from 'framer-motion';




interface MessageBubbleProps {
    message: Message;
    currentUserId?: number;
}

// Define the animation variants for the bubble
const bubbleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isCurrentUser = message.sender_id === currentUserId;

  return (
    // MODIFICATION: The main div is now a motion.div with animation properties
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
        <p className="break-words">{message.content}</p>
      </div>
    </motion.div>
  );
}
