import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationListItem({ conversation, isSelected, onClick }: ConversationListItemProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center w-full text-left p-4 gap-4 border-b hover:bg-black/5 transition-colors",
        isSelected && "bg-brand-sage/10"
      )}
    >
      <Avatar>
        <AvatarImage src={conversation.user.profile_picture_url || undefined} />
        <AvatarFallback>{conversation.user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-bold truncate">{conversation.user.username}</p>
          <p className="text-xs text-neutral-500 flex-shrink-0">{conversation.timestamp}</p>
        </div>
        <p className="text-sm text-neutral-600 truncate">{conversation.lastMessage}</p>
      </div>
    </button>
  );
}
