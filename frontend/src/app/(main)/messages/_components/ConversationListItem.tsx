import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/Avatar';
import { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationListItem({ conversation, isSelected, onClick }: ConversationListItemProps) {
  // Safely handle cases where the user may have been deleted.
  const user = conversation.user;
  const name = user?.username || 'Deleted User';
  const avatarUrl = user?.profile_picture_url;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full text-left p-4 gap-4", // Removed border-b
        "hover:bg-white/50 dark:hover:bg-neutral-800/30 transition-colors rounded-lg", // Added soft hover and rounded-lg
        isSelected && "bg-[var(--color-brand-terracotta)]/20", // Use terracotta for selected
        !user && "opacity-50" // Visually indicate a deleted user
      )}
      disabled={!user} // Disable clicking on conversations with deleted users
    >
      <Avatar>
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-bold truncate">{name}</p>
          {/* Ensure timestamp is displayed correctly */}
          <p className="text-xs text-neutral-500 flex-shrink-0">{conversation.timestamp || ''}</p>
        </div>
        {/* Ensure last message is displayed */}
        <p className="text-sm text-neutral-500 truncate">{conversation.lastMessage || ''}</p>
      </div>
    </button>
  );
}