'use client';

import useSWR from 'swr';
import api from '@/src/app/api';
import { ReportCard } from './ReportCard';
import { Spinner } from '@/src/app/components/ui/Spinner';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function ReportList() {
  const { data: reports, error, isLoading } = useSWR('/admin/reports', fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Could not load reports. You may not have permission to view this page.</div>;
  }

  return (
    <div className="space-y-4">
      {reports && reports.length > 0 ? (
        reports.map((report: any) => (
          <ReportCard key={report.id} report={report} />
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">The report queue is empty.</p>
      )}
    </div>
  );
}
