'use client';

import * as React from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { Sun, SunMedium, Moon } from 'lucide-react'; // <-- icons

// Simple class combiner (swap for your own `cn` if you have one)
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type Segment = {
  key: 'morning' | 'afternoon' | 'evening' | (string & {}); // keep your keys but allow custom
  label: string;
  color: string;      // wedge fill
  textColor?: string; // label color
};

type Props = {
  segments?: Segment[];
  activeKey: string;
  onChange: (key: string) => void;

  // Layout
  outerRadius?: number;   // px
  innerRadius?: number;   // px (0 => full pie wedge)
  spreadDeg?: number;     // total arc degrees (e.g., 360 for full circle, 160 for semi)
  centerOffsetY?: number; // mostly useful for semicircles

  className?: string;
};

const DEFAULT_SEGMENTS: Segment[] = [
  {
    key: 'morning',
    label: 'Morning',
    color: 'var(--color-brand-sage)',
    textColor: '#0E1B2C',
  },
  {
    key: 'afternoon',
    label: 'Afternoon',
    color: 'var(--color-brand-terracotta)',
    textColor: '#FFFFFF',
  },
  {
    key: 'evening',
    label: 'Evening',
    color: 'var(--color-brand-deep-blue)',
    textColor: '#FFFFFF',
  },
];

// ---------- helpers ----------
function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

// Keep a number in [0, 360)
function norm360(deg: number) {
  return ((deg % 360) + 360) % 360;
}

/**
 * Return the numerically nearest angle to `currentDeg` that is equivalent to
 * `targetBaseDeg` modulo 360. This guarantees a short rotation (≤180°).
 */
function nearestAngleTo(currentDeg: number, targetBaseDeg: number) {
  const base = norm360(targetBaseDeg);                 // 0..360
  const k = Math.round((currentDeg - base) / 360);     // choose nearest turn
  let candidate = base + 360 * k;

  // Guard rare boundary cases where rounding still leaves >180° gap
  const delta = candidate - currentDeg;
  if (Math.abs(delta) > 180) {
    candidate += 360 * (delta > 0 ? -1 : 1);
  }
  return candidate;
}

// Donut slice
function annularSectorPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number
) {
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

function ArcGuide({ radius, spreadDeg }: { radius: number; spreadDeg: number }) {
  const mid = 270;
  const start = mid - spreadDeg / 2;
  const end = mid + spreadDeg / 2;
  const p1 = polar(radius, start);
  const p2 = polar(radius, end);
  const largeArcFlag = spreadDeg > 180 ? 1 : 0;
  const d = `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`;
  return <path d={d} fill="none" className="stroke-black/10 dark:stroke-white/10" strokeWidth={2} />;
}

// ---------- component ----------
export function SunDialSegments({
  segments = DEFAULT_SEGMENTS,
  activeKey,
  onChange,
  outerRadius = 150,
  innerRadius = 70,
  spreadDeg = 360,
  centerOffsetY = 0,
  className,
}: Props) {
  const count = segments.length;
  const mid = 270; // 12 o'clock

  // Evenly distribute across the arc centered at 270°
  // Equal slices that exactly fill spreadDeg.
  const step = count > 0 ? spreadDeg / count : 0;
  const start0 = mid - spreadDeg / 2;

  // We keep raw start/end for drawing (they may exceed 360 for the last slice),
  // but also compute a normalized mid angle for rotation math (0..360).
  const angles = segments.map((s, i) => {
    const a0 = start0 + i * step;
    const a1 = a0 + step;
    const midRaw = (a0 + a1) / 2;
    const midNorm = norm360(midRaw);
    return { key: s.key, start: a0, end: a1, midRaw, midNorm, index: i };
  });

  const angleFor = (key: string) => {
    const a = angles.find(x => x.key === key);
    return a ? a.midNorm : 270;
  };

  // Rotation motion value (degrees)
  const rotation = useMotionValue(270 - angleFor(activeKey));

  // Animate rotation using the nearest wrapped target (prevents 240° spins)
  React.useEffect(() => {
    const current = rotation.get();                   // can be any real number
    const targetBase = 270 - angleFor(activeKey);     // normalized base (0..360)
    const nearest = nearestAngleTo(current, targetBase);

    const controls = animate(rotation, nearest, {
      type: 'spring',
      stiffness: 80,  // gentler
      damping: 20,    // smoother settle
      mass: 1.2,      // slightly heavier feel
    });
    return () => controls.stop();
  }, [activeKey]);

  // Keyboard a11y
  const activeIdx = Math.max(0, angles.findIndex(a => a.key === activeKey));
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!count) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(segments[(activeIdx + 1) % count].key);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(segments[(activeIdx - 1 + count) % count].key);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(segments[0].key);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(segments[count - 1].key);
    }
  };

  // SVG sizing
  const pad = 24;
  const R = outerRadius + pad;
  const size = R * 2 + pad;
  const viewBox = `${-size / 2} ${-size / 2} ${size} ${size}`;

  return (
    <div
      className={cx('relative w-full h-72 flex items-center justify-center', className)}
      role="tablist"
      aria-label="Time window"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
    >
      {/* Optional faint guide arc (hidden for full circle) */}
      {spreadDeg < 360 && (
        <motion.svg
          width="100%"
          height="100%"
          viewBox={viewBox}
          className="pointer-events-none absolute"
          style={{ translateY: `${centerOffsetY}px` }}
          aria-hidden
        >
          <ArcGuide radius={outerRadius + 6} spreadDeg={spreadDeg} />
        </motion.svg>
      )}

      {/* Interactive dial */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        className="absolute"
        style={{ translateY: `${centerOffsetY}px` }}
      >
        <motion.g style={{ rotate: rotation }}>
          {angles.map((a) => {
            const seg = segments[a.index];
            const isActive = seg.key === activeKey;

            // Active wedge expands outward slightly
            const rOuter = isActive ? outerRadius + 8 : outerRadius;
            const d = annularSectorPath(0, 0, innerRadius, rOuter, a.start, a.end);

            // Label centroid (halfway between radii at mid-angle)
            const labelRadius = (innerRadius + rOuter) / 2;
            const { x: lx, y: ly } = polar(labelRadius, a.midRaw);

            // Keep text + icon upright as dial rotates
            const counter = useTransform(rotation, (r: number) => -r);

            return (
              <g key={seg.key}>
                {/* Soft glow for active */}
                {isActive && (
                  <motion.path
                    d={annularSectorPath(0, 0, Math.max(0, innerRadius - 6), rOuter + 14, a.start, a.end)}
                    fill={seg.color}
                    opacity={0.32}
                    style={{ filter: 'blur(10px)' as any }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 0.32, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  />
                )}

                {/* Wedge */}
                <motion.path
                  role="tab"
                  aria-label={seg.label}
                  aria-selected={isActive}
                  d={d}
                  fill={seg.color}
                  className="cursor-pointer pointer-events-auto"
                  initial={false}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => onChange(seg.key)}
                />

                {/* Icon + label inside the wedge (centroid) */}
                <motion.g style={{ rotate: counter }}>
                  <foreignObject
                    x={lx - 60}
                    y={ly - 20}
                    width={120}
                    height={40}
                    style={{ overflow: 'visible', pointerEvents: 'none' }}
                  >
                    <div
                      className="flex items-center justify-center gap-1"
                      style={{
                        color: seg.textColor ?? '#111', // icons inherit this via currentColor
                        fontWeight: isActive ? 700 : 600,
                        fontSize: isActive ? 16 : 14,
                        lineHeight: '20px',
                        textAlign: 'center',
                        // light glow for readability on mixed backgrounds
                        textShadow: isActive
                          ? '0 1px 8px rgba(0,0,0,0.28)'
                          : '0 1px 5px rgba(0,0,0,0.18)',
                        filter: isActive ? 'drop-shadow(0 1px 6px rgba(0,0,0,0.20))' : 'none',
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
