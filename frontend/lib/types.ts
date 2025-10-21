export interface User {
  id: string;
  username: string;

  profile_picture_url: string | null;
}

export interface Notification {
  id: string;
  sender: User;
  type: 'vibe' | 'comment' | 'follow';
  post_id?: string;
  read: boolean;
  created_at: string;
}

// Defines a conversation for the direct messaging feature
export interface Conversation {
  id: number;
  user: User;
  lastMessage: string;
  timestamp: string;
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  conversation_id:number
  sender_id: number;
  media_url: string;
  media_type: string | null;

}