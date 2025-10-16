'use client';

import * as React from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { Sun, SunMedium, Moon } from 'lucide-react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const DEFAULT_SEGMENTS = [
  { key: 'morning', label: 'Morning', color: 'var(--color-brand-sage)', textColor: '#0E1B2C' },
  { key: 'afternoon', label: 'Afternoon', color: 'var(--color-brand-terracotta)', textColor: '#FFFFFF' },
  { key: 'evening', label: 'Evening', color: 'var(--color-brand-deep-blue)', textColor: '#FFFFFF' },
];

type TimeWindow = 'Morning' | 'Afternoon' | 'Evening';

type Props = {
  activeWindow: TimeWindow;
  setActiveWindow: (window: TimeWindow) => void;

  outerRadius?: number;
  innerRadius?: number;
  spreadDeg?: number;
  centerOffsetY?: number;
  className?: string;
};

function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

function norm360(deg: number) {
  return ((deg % 360) + 360) % 360;
}

function nearestAngleTo(currentDeg: number, targetBaseDeg: number) {
  const base = norm360(targetBaseDeg);
  const k = Math.round((currentDeg - base) / 360);
  let candidate = base + 360 * k;
  const delta = candidate - currentDeg;
  if (Math.abs(delta) > 180) {
    candidate += 360 * (delta > 0 ? -1 : 1);
  }
  return candidate;
}

function annularSectorPath(cx: number, cy: number, rInner: number, rOuter: number, startDeg: number, endDeg: number) {
  const startOuter = polar(rOuter, startDeg);
  const endOuter = polar(rOuter, endDeg);
  const startInner = polar(rInner, endDeg);
  const endInner = polar(rInner, startDeg);
  const largeArcFlag = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return [
    'M', cx + startOuter.x, cy + startOuter.y,
    'A', rOuter, rOuter, 0, largeArcFlag, 1, cx + endOuter.x, cy + endOuter.y,
    'L', cx + startInner.x, cy + startInner.y,
    'A', rInner, rInner, 0, largeArcFlag, 0, cx + endInner.x, cy + endInner.y,
    'Z',
  ].join(' ');
}

export function SunDialSegments({
  activeWindow,
  setActiveWindow,
  outerRadius = 150,
  innerRadius = 70,
  spreadDeg = 360,
  centerOffsetY = 0,
  className,
}: Props) {
  const segments = DEFAULT_SEGMENTS;
  const count = segments.length;
  const mid = 270;

  const step = spreadDeg / count;
  const start0 = mid - spreadDeg / 2;

  const angles = segments.map((s, i) => {
    const a0 = start0 + i * step;
    const a1 = a0 + step;
    const midRaw = (a0 + a1) / 2;
    const midNorm = norm360(midRaw);
    return { key: s.key, start: a0, end: a1, midRaw, midNorm, index: i };
  });

  const activeKey = activeWindow.toLowerCase() as 'morning' | 'afternoon' | 'evening';
  const angleFor = (key: string) => angles.find(a => a.key === key)?.midNorm ?? 270;

  const rotation = useMotionValue(270 - angleFor(activeKey));

  React.useEffect(() => {
    const current = rotation.get();
    const targetBase = 270 - angleFor(activeKey);
    const nearest = nearestAngleTo(current, targetBase);

    const controls = animate(rotation, nearest, {
      type: 'spring',
      stiffness: 80,
      damping: 20,
      mass: 1.2,
    });
    return () => controls.stop();
  }, [activeKey]);

  const pad = 24;
  const R = outerRadius + pad;
  const size = R * 2 + pad;
  const viewBox = `${-size / 2} ${-size / 2} ${size} ${size}`;

  return (
    <div className={cx('relative w-full h-72 flex items-center justify-center', className)}>
      <motion.svg width="100%" height="100%" viewBox={viewBox} className="absolute" style={{ translateY: `${centerOffsetY}px` }}>
        <motion.g style={{ rotate: rotation }}>
          {angles.map((a) => {
            const seg = segments[a.index];
            const isActive = seg.key === activeKey;
            const rOuter = isActive ? outerRadius + 8 : outerRadius;
            const d = annularSectorPath(0, 0, innerRadius, rOuter, a.start, a.end);
            const labelRadius = (innerRadius + rOuter) / 2;
            const { x: lx, y: ly } = polar(labelRadius, a.midRaw);
            const counter = useTransform(rotation, (r: number) => -r);

            return (
              <g key={seg.key}>
                {isActive && (
                  <motion.path
                    d={annularSectorPath(0, 0, Math.max(0, innerRadius - 6), rOuter + 14, a.start, a.end)}
                    fill={seg.color}
                    opacity={0.32}
                    style={{ filter: 'blur(10px)' as any }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 0.32, scale: 1 }}
                  />
                )}
                <motion.path
                  d={d}
                  fill={seg.color}
                  className="cursor-pointer"
                  onClick={() => setActiveWindow(seg.label as TimeWindow)}
                />
                <motion.g style={{ rotate: counter }}>
                  <foreignObject x={lx - 60} y={ly - 20} width={120} height={40} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                    <div
                      className="flex items-center justify-center gap-1"
                      style={{
                        color: seg.textColor,
                        fontWeight: isActive ? 700 : 600,
                        fontSize: isActive ? 16 : 14,
                      }}
                    >
                      {seg.key === 'morning' && <Sun size={16} />}
                      {seg.key === 'afternoon' && <SunMedium size={16} />}
                      {seg.key === 'evening' && <Moon size={16} />}
                      <span>{seg.label}</span>
                    </div>
                  </foreignObject>
                </motion.g>
              </g>
            );
          })}
        </motion.g>
      </motion.svg>
    </div>
  );
}
