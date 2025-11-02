export interface User {
  id: string;
  username: string;

  profile_picture_url: string | null;
  is_following_viewer: boolean;
}

export interface Notification {
  id: string;
  sender: User;
  type: 'vibe' | 'comment' | 'follow';
  post_id?: string;
  is_read: boolean;
  created_at: string;
}

// Defines a conversation for the direct messaging feature
export interface Conversation {
  id: number;
  user: ConversationParticipant;
  lastMessage: string;
  timestamp: string;
}

export interface ConversationParticipant {
  id: string; // Or number, adjust based on your backend
  username: string;
  profile_picture_url: string | null;
  // Note: No is_following_viewer here
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  conversation_id:number
  sender_id: number;
  media_url: string;
  media_type: string | null;
  read_at: string;
  link_preview_data: LinkPreview | null;
}

export interface Post {
  id: number;
  user_id: number;
  username: string;
  profile_picture_url: string | null;
  content: string;
  created_at: string;
  vibe_counts: Record<string, number>;
  comment_count: number;
  user_vibe: string | null;
  media_url?: string | null;
  media_type?: 'image' | 'video' | null;
  link_preview_data: LinkPreview | null;
}

export interface LinkPreview {
  url: string;
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
}