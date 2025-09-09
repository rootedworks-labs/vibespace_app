import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  profile_picture_url?: string | null;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: () => boolean; // Add this line
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({ // Add 'get'
      accessToken: null,
      user: null,
      isAuthenticated: () => !!get().accessToken, // Implement the function
      login: (accessToken, user) => set({ accessToken, user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'vibespace-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
