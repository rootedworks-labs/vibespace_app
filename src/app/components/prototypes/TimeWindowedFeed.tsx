'use client';

import { useState } from 'react';
import { VibeCard } from './VibeCard';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

// Define the available time windows as a specific type
const timeWindows = ['Morning', 'Afternoon', 'Evening'] as const;
type TimeWindow = (typeof timeWindows)[number];

// --- THIS IS THE FIX ---
// The VibeCounts type definition was missing. It has been re-added here.
type VibeCounts = {
  flow?: number;
  joy?: number;
  hype?: number;
  glam?: number;
  love?: number;
};
// --- END FIX ---

// Define a specific interface for a Post
interface MockPost {
  id: number;
  author: string;
  content: string;
  timeWindow: TimeWindow; // Use the specific TimeWindow type here
  vibeCounts: VibeCounts;
}

// Apply the MockPost[] type to your mock data array
const mockPosts: MockPost[] = [
  { id: 1, author: 'Alex', content: 'First thing in the morning, I gotta get it, I\'m on it.', timeWindow: 'Morning', vibeCounts: { flow: 8, joy: 5 } },
  { id: 2, author: 'Brenda', content: 'Woke up this morning to a message from the mayor.', timeWindow: 'Morning', vibeCounts: { love: 15 } },
  { id: 3, author: 'Chris', content: '', timeWindow: 'Afternoon', vibeCounts: { joy: 22, glam: 4 } },
  { id: 4, author: 'Dana', content: 'You are now rocking with the best.', timeWindow: 'Afternoon', vibeCounts: { hype: 7 } },
  { id: 5, author: 'Eli', content: 'It\'s an all nighter, go pack a lunch, yeah', timeWindow: 'Evening', vibeCounts: { flow: 30, joy: 12 } },
];

export function TimeWindowedFeed() {
  const [activeWindow, setActiveWindow] = useState<TimeWindow>('Afternoon');

  const filteredPosts = mockPosts.filter(post => post.timeWindow === activeWindow);

  return (
    <div className="w-full max-w-xl">
      <h3 className="font-heading font-bold text-xl mb-4">Prototype: Time-Windowed Feed</h3>
      
      {/* Navigation for Time Windows */}
      <div className="flex items-center justify-center p-2 mb-4 bg-neutral-100 rounded-lg border">
        {timeWindows.map(window => (
          <Button
            key={window}
            variant="ghost"
            className={cn(
              'font-semibold',
              activeWindow === window && 'bg-white shadow-sm'
            )}
            onClick={() => setActiveWindow(window)}
          >
            {window}
          </Button>
        ))}
      </div>

      {/* Feed Content */}
      <div className="space-y-4 w-full flex flex-col items-center">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <VibeCard
              key={post.id}
              author={post.author}
              timeWindow={post.timeWindow}
              text={post.content}
              vibeCounts={post.vibeCounts}
            />
          ))
        ) : (
          <div className="text-center p-12 border rounded-lg bg-white">
            <p className="text-neutral-500">No vibes in this window yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}