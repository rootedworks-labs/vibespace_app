'use client';

import { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ConversationView } from './ConversationView';
import { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

// Dummy Data for UI development, now with user IDs
const dummyConversations: Conversation[] = [
  { id: 1, user: { id: '99', username: 'VibeSpace', profile_picture_url: '/vibespace-logo-transparent-hardmask.png' }, lastMessage: 'Welcome to VibeSpace messaging!', timestamp: '10:42 AM' },
  { id: 2, user: { id: '101', username: 'Jane Doe', profile_picture_url: 'https://github.com/shadcn.png' }, lastMessage: 'Hey, saw your post, love the energy!', timestamp: '9:15 AM' },
  { id: 3, user: { id: '102', username: 'Sam', profile_picture_url: null }, lastMessage: 'Let\'s collaborate on a project.', timestamp: 'Yesterday' },
];

export function MessagesLayout() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="flex h-[calc(100vh-80px)] border rounded-2xl bg-white/50 backdrop-blur-lg shadow-lg overflow-hidden">
      {/* Conversation List - hidden on mobile when a conversation is selected */}
      <div className={cn(
        "w-full md:w-1/3 border-r",
        selectedConversation && "hidden md:block"
      )}>
        <ConversationList 
          conversations={dummyConversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={setSelectedConversation}
        />
      </div>

      {/* Conversation View - shown on mobile only when a conversation is selected */}
      <div className={cn(
        "w-full md:w-2/3 flex flex-col",
        !selectedConversation && "hidden md:flex"
      )}>
        {selectedConversation ? (
          <ConversationView 
            conversation={selectedConversation} 
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="flex-1 items-center justify-center text-neutral-500 hidden md:flex">
            <p>Select a conversation to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}

