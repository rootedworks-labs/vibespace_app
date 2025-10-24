'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { ConversationList } from './ConversationList';
import { ConversationView } from './ConversationView';
import { Conversation } from '@/lib/types';
import { fetcher } from '@/src/app/api';
import { cn } from '@/lib/utils';
import { Spinner } from '@/src/app/components/ui/Spinner';

interface ApiConversation{
  id: number;
  participant_id: number;
  participant_username: string;
  participant_avatar: string | null;
}

export function MessagesLayout() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const { data: apiConversations, error, isLoading } = useSWR<ApiConversation[]>('/conversations', fetcher);

  const conversations: Conversation[] | undefined = apiConversations?.map(convo => ({
    id: convo.id,
    user: {
      id: convo.participant_id.toString(), // Assuming participant ID is the same as conversation ID for now
      username: convo.participant_username,
      profile_picture_url: convo.participant_avatar,
    },
    // NOTE: Your API does not yet provide these fields. Using placeholders for now.
    lastMessage: '...', 
    timestamp: '...'
  }));
  // Automatically select the first conversation once data loads


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="h-10 w-10 text-brand-sage" />
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Failed to load conversations.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-80px)] border rounded-2xl bg-white/50 backdrop-blur-lg shadow-lg overflow-hidden">
      <div className={cn("w-full md:w-1/3 border-r", selectedConversation && "hidden md:block")}>
        <ConversationList 
          conversations={conversations || []}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={setSelectedConversation}
        />
      </div>

      <div className={cn("w-full md:w-2/3 flex flex-col", !selectedConversation && "hidden md:flex")}>
        {selectedConversation ? (
          <ConversationView 
            key={selectedConversation.id} 
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

