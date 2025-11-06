'use client';

import { Lock } from 'lucide-react';

/**
 * A component to display a "This account is private" message.
 * This is shown instead of the UserPostFeed.
 */
export function PrivateProfileMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center border-t border-neutral-200">
      <Lock className="h-10 w-10 text-neutral-400" />
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">This Account is Private</h3>
        <p className="text-sm text-neutral-500">
          Follow them to see their vibes.
        </p>
      </div>
    </div>
  );
}
