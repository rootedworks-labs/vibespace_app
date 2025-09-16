import { Conversation } from '@/lib/types';
import { ConversationListItem } from './ConversationListItem';
import { Search } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: number;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, selectedConversationId, onSelectConversation }: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold font-heading">Messages</h2>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 rounded-full border bg-transparent focus:ring-2 focus:ring-brand-sage focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map(convo => (
          <ConversationListItem 
            key={convo.id}
            conversation={convo}
            isSelected={convo.id === selectedConversationId}
            onClick={() => onSelectConversation(convo)}
          />
        ))}
      </div>
    </div>
  );
}
