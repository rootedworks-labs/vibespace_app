import { create } from 'zustand';

// Define the shape of the user object, including the new optional property
interface User {
  id: number;
  username: string;
  profile_picture_url?: string | null;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  login: (accessToken, user) => set({ accessToken, user }),
  logout: () => set({ accessToken: null, user: null }),
}));