import { create } from 'zustand';

export type TimeWindow = 'Morning' | 'Afternoon' | 'Evening';

interface FeedState {
  activeWindow: TimeWindow;
  setActiveWindow: (window: TimeWindow) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  activeWindow: 'Afternoon', // Default value
  setActiveWindow: (window) => set({ activeWindow: window }),
}));