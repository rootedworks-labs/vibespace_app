'use client';

import { Button } from '@/src/app/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/app/components/ui/Card';
import Link from 'next/link';
import { ConfirmationModal } from './ConfirmationModal';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import api from '@/src/app/api';

// Define the shape of a report object
interface Report {
  id: number;
  reason: string;
  reported_content_type: 'post' | 'comment';
  reported_id: number;
  // In a real app, you'd have more details like the content snippet, reporter, etc.
}

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const { mutate } = useSWRConfig();
  const contentLink = report.reported_content_type === 'post' 
    ? `/posts/${report.reported_id}` 
    : '#'; // Link to comments would be more complex

  const handleDismiss = async () => {
    // In a real app, you'd call an API endpoint to update the report status
    toast.success(`Report #${report.id} dismissed.`);
    // Optimistically update the UI by re-fetching the reports list
    mutate('/admin/reports');
  };

  const handleTakeAction = async () => {
    // This is a placeholder for more complex actions like deleting content or suspending a user
    // For now, we'll just show a toast and re-fetch the reports
    toast.success(`Action taken on report #${report.id}.`);
    mutate('/admin/reports');
  };

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-lg">Report #{report.id}: {report.reason}</CardTitle>
        <CardDescription>
          Type: {report.reported_content_type} | Content ID: {report.reported_id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mt-4">
          <Link href={contentLink} passHref>
            <Button variant="link">View Content</Button>
          </Link>
          <div className="space-x-2">
            <ConfirmationModal
              triggerButton={<Button variant="secondary" size="sm">Dismiss</Button>}
              title="Dismiss Report"
              description={`Are you sure you want to dismiss report #${report.id}? This action cannot be undone.`}
              confirmText="Yes, Dismiss"
              onConfirm={handleDismiss}
            />
            <ConfirmationModal
              triggerButton={<Button variant="destructive" size="sm">Take Action</Button>}
              title="Take Action on Report"
              description={`Are you sure you want to take action on report #${report.id}? This will remove the content.`}
              confirmText="Yes, Take Action"
              onConfirm={handleTakeAction}
              variant="destructive"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
