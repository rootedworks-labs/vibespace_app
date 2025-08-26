import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

export const useAuthStore = create(
  persist<AuthState>(
  (set) => ({
  accessToken: null,
  user: null,
  login: (accessToken, user) => set({ accessToken, user }),
  logout: () => set({ accessToken: null, user: null }),
  }),
  {
    name: 'vibespace-auth-storage',
    storage: createJSONStorage(() => localStorage),
  }
  )
  
  );