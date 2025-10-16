'use client';

import React from 'react';
import { VibeCard } from './VibeCard';
import { cn } from '@/lib/utils';

const timeWindows = ['Morning', 'Afternoon', 'Evening'] as const;
type TimeWindow = (typeof timeWindows)[number];

const mockPosts = [
    { id: 1, author: 'Alex', text: 'Morning vibes are the best.', timeWindow: 'Morning' as TimeWindow, vibeCounts: { flow: 8, joy: 5 } },
    { id: 2, author: 'Brenda', text: 'Just finished a great workout!', timeWindow: 'Morning' as TimeWindow, vibeCounts: { love: 15 } },
    { id: 3, author: 'Chris', text: 'Afternoon coffee break.', timeWindow: 'Afternoon' as TimeWindow, vibeCounts: { joy: 22, glam: 4 } },
    { id: 4, author: 'Dana', text: 'Coding away the afternoon.', timeWindow: 'Afternoon' as TimeWindow, vibeCounts: { hype: 7 } },
    { id: 5, author: 'Eli', text: 'Evening walk to clear my head.', timeWindow: 'Evening' as TimeWindow, vibeCounts: { flow: 30, joy: 12 } },
    { id: 6, author: 'Frank', text: 'Ready for the weekend!', timeWindow: 'Evening' as TimeWindow, vibeCounts: { hype: 25, love: 10 } },
];

export function HorizonPath() {
  return (
    <div className="w-full bg-gray-100 py-12">
      {/* SVG for the wavy mask effect */}
      <svg width="0" height="0">
        <defs>
          <clipPath id="wavy-mask" clipPathUnits="objectBoundingBox">
            <path d="M0,0.1 C0.2,0,0.3,0.2,0.5,0.2 S0.8,0,1,0.1 V0.9 C0.8,1,0.7,0.8,0.5,0.8 S0.2,1,0,0.9 V0.1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div 
        className="flex space-x-8 overflow-x-auto p-8 bg-gradient-to-r from-yellow-200 via-amber-200 to-indigo-200"
        style={{ clipPath: 'url(#wavy-mask)' }}
      >
        {mockPosts.map(post => (
          <div key={post.id} className="flex-shrink-0 w-[28rem]">
            <VibeCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}