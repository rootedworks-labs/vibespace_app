'use client';

import { CreatePostForm } from '@/src/app/(main)/_components/CreatePostForm';
import { Card } from '@/src/app/components/ui/Card'; // Import your Card component
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function CreatePostPage() {
  const router = useRouter();

  return (
    // NOTE: Removed the redundant <Navbar />. Your (main)/layout.tsx already provides this.
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Link 
        href="/feed" 
        className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-brand-deep-blue mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </Link>
      
      {/* Wrap the form in your consistent Card component */}
      <Card className="p-4 sm:p-8">
        <CreatePostForm onSuccess={() => router.push('/feed')} />
      </Card>
    </div>
  );
}
