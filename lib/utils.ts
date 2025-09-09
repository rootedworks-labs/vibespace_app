import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add this new function to convert a date string to a time window
export const getTimeWindow = (dateString: string): 'Morning' | 'Afternoon' | 'Evening' => {
  const date = new Date(dateString);
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return 'Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Afternoon';
  } else {
    return 'Evening';
  }
};