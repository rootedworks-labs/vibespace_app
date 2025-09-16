import { cn } from '@/lib/utils';

interface Message {
    id: number;
    text: string;
    isCurrentUser: boolean;
    timestamp: string;
}

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={cn(
        "flex items-end gap-2",
        message.isCurrentUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-xs md:max-w-md p-3 rounded-2xl",
        message.isCurrentUser 
          ? "bg-brand-sage text-white rounded-br-none" 
          : "bg-white border rounded-bl-none"
      )}>
        <p>{message.text}</p>
      </div>
    </div>
  );
}
