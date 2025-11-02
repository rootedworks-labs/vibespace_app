'use client';

import { PostFeed } from '@/src/app/(main)/_components/PostFeed';
import { SunDialSegments } from '@/src/app/components/prototypes/SunDialSegments';
import { MobileNavbar } from '@/src/app/components/MobileNavBar';

export default function HomePage() {

  return (
    <>
      <main className="container mx-auto max-w-2xl">
        <SunDialSegments />
        <PostFeed />
      </main>
    </>
  );
}

