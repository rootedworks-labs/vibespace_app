'use client';

import { useState } from 'react';
import { PostFeed } from '@/src/app/(main)/_components/PostFeed';
import { SunDialSegments } from '@/src/app/components/prototypes/SunDialSegments';
import { MobileNavbar } from '@/src/app/components/MobileNavBar';

type TimeWindow = 'Morning' | 'Afternoon' | 'Evening';

export default function HomePage() {
  const [activeWindow, setActiveWindow] = useState<TimeWindow>('Afternoon');

  return (
    <>
      <main className="container mx-auto max-w-2xl">
        <SunDialSegments activeWindow={activeWindow} setActiveWindow={setActiveWindow} />
        <PostFeed timeWindow={activeWindow} />
      </main>
      <MobileNavbar />
    </>
  );
}

