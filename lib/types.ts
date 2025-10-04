export interface User {
  id: string;
  username: string;

  profile_picture_url: string | null;
}

export interface Notification {
  id: string;
  actor: User;
  type: 'VIBE' | 'COMMENT' | 'FOLLOW';
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
  sender_id: number;
}