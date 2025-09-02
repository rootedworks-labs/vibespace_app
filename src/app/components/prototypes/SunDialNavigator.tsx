'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/src/app/components/ui/Button';
import { cn } from '@/lib/utils';

const timeWindows = ['Morning', 'Afternoon', 'Evening'] as const;
type TimeWindow = (typeof timeWindows)[number];

// The component now accepts props to control its state from the parent page
export function SunDialNavigator({ activeWindow, setActiveWindow }: { activeWindow: TimeWindow, setActiveWindow: (window: TimeWindow) => void }) {
  const getArcStyle = (window: TimeWindow) => {
    const isActive = activeWindow === window;
    const baseOffset = {
      Morning: -140,
      Afternoon: 0,
      Evening: 140,
    }[window];

    const activeOffset = {
      Morning: 140,
      Afternoon: 0,
      Evening: -140,
    }[activeWindow];

    return {
      x: isActive ? 0 : baseOffset - activeOffset,
      y: isActive ? 0 : 30,
      scale: isActive ? 1.25 : 0.9,
      zIndex: isActive ? 10 : 1,
    };
  };

  const getBackgroundColor = (window: TimeWindow) => {
    if (activeWindow !== window) return '';
    switch (window) {
      case 'Morning':
        return 'bg-brand-sand text-brand-deep-blue';
      case 'Afternoon':
        return 'bg-brand-terracotta text-white';
      case 'Evening':
        return 'bg-brand-deep-blue text-white';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      {timeWindows.map((window) => (
        <motion.div
          key={window}
          className="absolute"
          animate={getArcStyle(window)}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Button
            variant={activeWindow === window ? 'default' : 'outline'}
            onClick={() => setActiveWindow(window)}
            className={cn(
              "w-32 h-12 rounded-full transition-all duration-300 shadow-lg",
              getBackgroundColor(window)
            )}
          >
            {window}
            {activeWindow === window && (
              <motion.div
                className="absolute inset-0 rounded-full -z-10"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
