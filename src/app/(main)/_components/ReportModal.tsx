'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/src/app/api';
import toast from 'react-hot-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/src/app/components/ui/Modal';
import { Button } from '@/src/app/components/ui/Button';
import { Textarea } from '@/src/app/components/ui/TextArea';
import { Flag } from 'lucide-react';

// Define the reasons for reporting
const reportReasons = [
  "Spam or Misleading Content",
  "Harassment or Hateful Content",
  "Inappropriate or Explicit Content",
  "Impersonation",
] as const;

// Validation schema for the report form
const reportSchema = z.object({
  reason: z.enum(reportReasons), // Removed the problematic error message parameter
  details: z.string().max(500, 'Details cannot exceed 500 characters.').optional(),
});

interface ReportModalProps {
  contentType: 'post' | 'comment';
  contentId: number;
  children: React.ReactNode; // The trigger button
}

export function ReportModal({ contentType, contentId, children }: ReportModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
  });

  const { isSubmitting, errors } = form.formState;

  const onSubmit = async (values: z.infer<typeof reportSchema>) => {
    const toastId = toast.loading('Submitting report...');
    try {
      await api.post('/reports', {
        reported_content_type: contentType,
        reported_id: contentId,
        reason: values.reason,
        // Include details if provided
        ...(values.details && { details: values.details }),
      });
      toast.success('Report submitted. Thank you for helping keep VibeSpace safe.', { id: toastId });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to submit report. Please try again.', { id: toastId });
      console.error('Report submission failed:', error);
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Report Content</ModalTitle>
        </ModalHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <p className="font-medium mb-2">Why are you reporting this?</p>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <label key={reason} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={reason}
                    {...form.register('reason')}
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason.message || 'Please select a reason.'}</p>}
          </div>
          <div>
            <label htmlFor="details" className="font-medium">Additional Details (Optional)</label>
            <Textarea
              id="details"
              placeholder="Provide any extra context here..."
              {...form.register('details')}
              className="mt-1"
            />
             {errors.details && <p className="text-sm text-red-500 mt-1">{errors.details.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
