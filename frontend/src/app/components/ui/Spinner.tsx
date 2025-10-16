import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <Loader2
      className={cn('h-8 w-8 animate-spin text-primary', className)}
    />
  );
};