'use client';

import { ReportList } from './_components/ReportList';
import { ShieldAlert } from 'lucide-react';
import { Navbar } from '@/src/app/components/Navbar';

export default function AdminReportsPage() {
  // In a real application, you would add a check here to ensure
  // that only users with an 'admin' role can access this page.

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-heading font-bold">Content Moderation</h1>
        </div>
        <p className="mb-6 text-gray-600">
          Review user-submitted reports for content that may violate community guidelines.
        </p>
        <ReportList />
      </div>
    </>
  );
}
