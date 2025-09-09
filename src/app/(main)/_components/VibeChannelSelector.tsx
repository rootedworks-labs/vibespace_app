"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { vibeConfig } from '@/src/app/components/prototypes/vibe-config';

// Define the VibeType based on the keys of vibeConfig
export type VibeType = keyof typeof vibeConfig;

interface VibeChannelSelectorProps {
  onVibeSelect: (vibe: VibeType | null) => void;
}

export function VibeChannelSelector({ onVibeSelect }: VibeChannelSelectorProps) {
  const [selectedVibe, setSelectedVibe] = useState<VibeType | null>(null);

  const handleSelect = (vibeType: VibeType) => {
    // If the user clicks the same vibe again, deselect it. Otherwise, select the new one.
    const newSelectedVibe = selectedVibe === vibeType ? null : vibeType;
    setSelectedVibe(newSelectedVibe);
    onVibeSelect(newSelectedVibe);
  };

  return (
    <div>
      <p className="text-sm font-medium text-neutral-600 mb-2">
        Optionally, add to a Vibe Channel:
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(vibeConfig).map(([key, { icon: Icon, textColor }]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelect(key as VibeType)}
            className={cn(
              'flex items-center gap-2 py-1 px-3 rounded-full border transition-all duration-200',
              selectedVibe === key
                ? 'bg-brand-sage text-white border-brand-sage'
                : 'bg-transparent text-neutral-500 border-neutral-300 hover:border-neutral-400 hover:text-neutral-700'
            )}
          >
            <Icon className={cn('h-4 w-4', selectedVibe !== key && textColor)} />
            <span className="text-sm font-semibold capitalize">{key}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

