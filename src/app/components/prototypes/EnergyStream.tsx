// src/app/components/prototypes/EnergyStream.tsx
'use client';

import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import { vibeConfig } from './vibe-config';

type VibeType = keyof typeof vibeConfig;

interface ParticleState {
  id: string;
  vibeType: VibeType;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface EnergyStreamProps {
  vibeCounts: Partial<Record<VibeType, number>>;
}

const MAX_PARTICLES = 50;
const DOT_SIZE = 8; // The height/width of our dot (h-2 w-2 = 8px)

export function EnergyStream({ vibeCounts }: EnergyStreamProps) {
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);

  // This effect uses a ResizeObserver to reliably measure the container's size
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // This effect creates particles only when vibeCounts or containerSize changes
  useEffect(() => {
    // Don't create particles until the container has been measured
    if (!containerSize || containerSize.width === 0) return;

    const totalVibes = Object.values(vibeCounts).reduce((sum, count) => sum + (count || 0), 0);
    if (totalVibes === 0) {
      setParticles([]);
      return;
    }

    const newParticles = Object.entries(vibeCounts).flatMap(([vibe, count]) => {
      const proportion = totalVibes > 0 ? (count || 0) / totalVibes : 0;
      const numParticles = Math.round(proportion * Math.min(totalVibes, MAX_PARTICLES));
      
      return Array.from({ length: numParticles }, (_, i) => ({
        id: `${vibe}-${i}-${Math.random()}`,
        vibeType: vibe as VibeType,
        // Spawn particles safely within the measured bounds
        x: Math.random() * (containerSize.width - DOT_SIZE),
        y: Math.random() * (containerSize.height - DOT_SIZE),
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
      }));
    });

    setParticles(newParticles);
  }, [vibeCounts, containerSize]);

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

            if (newX <= 0 || newX >= width - DOT_SIZE) newVx = -newVx;
            if (newY <= 0 || newY >= height - DOT_SIZE) newVy = -newVy;

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

  return (
    <div ref={containerRef} className="relative h-6 w-full overflow-hidden min-h-[48px]">
      {particles.map(p => {
        const config = vibeConfig[p.vibeType];
        if (!config) return null;
        const { dotColor } = config;

        return (
          <div
            key={p.id}
            className="absolute"
            style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
          >
            <div className={cn('h-2 w-2 rounded-full', dotColor)} />
          </div>
        );
      })}
      {particles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-neutral-400">Be the first to share a vibe</p>
        </div>
      )}
    </div>
  );
}
