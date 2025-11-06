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
  isChecking: boolean; 
  isAuthenticated: () => boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

// --- UPDATED 'create' SYNTAX ---
// By adding <AuthState>() before persist, we explicitly type the store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isChecking: true, // Default to true (checking on load)
      isAuthenticated: () => !!get().accessToken,
      login: (accessToken, user) => set({ accessToken, user, isChecking: false }),
      logout: () => set({ accessToken: null, user: null, isChecking: false }), 
    }),
    {
      name: 'vibespace-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isChecking = false;
        }
      },
    }
  )
);

