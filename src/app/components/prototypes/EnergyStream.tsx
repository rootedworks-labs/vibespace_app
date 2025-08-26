'use client';

import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef } from 'react';

// Define the properties for each vibe
const vibeConfig = {
  flow: { color: 'bg-vibe-flow' },
  joy: { color: 'bg-vibe-joy' },
  hype: { color: 'bg-vibe-hype' },
  warmth: { color: 'bg-vibe-warmth' },
  glow: { color: 'bg-vibe-glow' },
  reflect: { color: 'bg-vibe-reflect' },
  love: { color: 'bg-vibe-love' },
};

type VibeType = keyof typeof vibeConfig;

// Define the structure for a particle's state
interface ParticleState {
  id: string;
  vibeType: VibeType;
  x: number;
  y: number;
  vx: number; // Velocity on the x-axis
  vy: number; // Velocity on the y-axis
}

interface EnergyStreamProps {
  /** An object with the counts for each vibe type. */
  vibeCounts: Partial<Record<VibeType, number>>;
}

const MAX_PARTICLES = 50;

export function EnergyStream({ vibeCounts }: EnergyStreamProps) {
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // This effect initializes the particles when the vibe counts change
  useEffect(() => {
    const totalVibes = Object.values(vibeCounts).reduce((sum, count) => sum + (count || 0), 0);
    if (totalVibes === 0) {
      setParticles([]);
      return;
    }

    const newParticles = Object.entries(vibeCounts).flatMap(([vibe, count]) => {
      const proportion = (count || 0) / totalVibes;
      const numParticles = Math.round(proportion * Math.min(totalVibes, MAX_PARTICLES));
      
      return Array.from({ length: numParticles }, (_, i) => ({
        id: `${vibe}-${i}`,
        vibeType: vibe as VibeType,
        x: Math.random() * 300,
        y: Math.random() * 80,
        // --- CHANGE: Reduced the velocity multiplier from 2 to 1 for a slower speed ---
        vx: (Math.random() - 0.5) * 0.10,
        vy: (Math.random() - 0.5) * 0.10,
      }));
    });

    setParticles(newParticles);
  }, [vibeCounts]);

  // This effect runs the animation loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();

        setParticles(prevParticles =>
          prevParticles.map(p => {
            let newX = p.x + p.vx;
            let newY = p.y + p.vy;
            let newVx = p.vx;
            let newVy = p.vy;

            // Bouncing logic (adjusted for dot size)
            if (newX <= 0 || newX >= width - 8) newVx = -newVx;
            if (newY <= 0 || newY >= height - 8) newVy = -newVy;

            return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
          })
        );
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [particles.length]);

  if (particles.length === 0) {
    return (
      <div className="h-6 flex items-center justify-center">
        <p className="text-xs text-neutral-400">Be the first to share a vibe</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-6 w-full overflow-hidden rounded-lg">
      {particles.map(p => {
        // --- THIS IS THE FIX ---
        // Check if the vibeType exists in the config before rendering
        const config = vibeConfig[p.vibeType];
        if (!config) {
          console.warn(`[EnergyStream] Received unknown vibeType: "${p.vibeType}"`);
          return null; // Don't render anything for this particle
        }
        const { color } = config;
        return (
          <div
            key={p.id}
            className="absolute"
            style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
          >
            {/* --- CHANGE: Replaced the Icon with a styled div to create a dot --- */}
            <div className={cn('h-2 w-2 rounded-full', color)} />
          </div>
        );
      })}
    </div>
  );
}