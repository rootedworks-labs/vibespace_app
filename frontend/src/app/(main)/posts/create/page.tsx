'use client';

import { CreatePostForm } from '@/src/app/(main)/_components/CreatePostForm';
import { Navbar } from '@/src/app/components/Navbar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreatePostPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <Link href="/feed" className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>
        <CreatePostForm />
      </div>
    </>
  );
}

