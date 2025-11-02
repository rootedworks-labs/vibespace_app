'use client';

// Assuming LinkPreview type is in '@/lib/types'
import { LinkPreview } from '@/lib/types';
//import Image from 'next/image';

interface LinkPreviewCardProps {
  data: LinkPreview;
}

export const LinkPreviewCard = ({ data }: LinkPreviewCardProps) => {
  // Get the hostname (e.g., "github.com") from the URL
  const domain = data.siteName || new URL(data.url).hostname.replace(/^www\./, '');

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 block" // Use mt-2 for spacing
      // Prevent click from bubbling up to the parent card/bubble
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700">
        {/* Image */}
        {data.image && (
          <div className="relative hidden flex-shrink-0 sm:block" style={{ width: '120px', height: '120px' }}>
            <img
              src={data.image}
              alt={data.title}
              className="absolute h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
            />
          </div>
        )}
        {/* Text Content */}
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <p className="truncate text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {domain}
          </p>
          <h4 className="truncate font-semibold text-neutral-800 dark:text-neutral-100">
            {data.title}
          </h4>
          {data.description && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
              {data.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};
