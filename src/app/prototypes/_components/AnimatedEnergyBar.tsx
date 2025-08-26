"use client";

import React from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import type { Variants } from "framer-motion";

// Allow any string keys for flexibility across sets
export type EnergyKey = string;

// A single energy item the bar can render
export type EnergyItem = {
  key: EnergyKey;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const childVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: [0.6, 1.12, 1],
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AnimatedEnergyBar({
  compact = false,
  initialCounts,
  energies = [],
  onToggle,
  className,
}: {
  compact?: boolean;
  initialCounts?: Partial<Record<EnergyKey, number>>;
  energies?: EnergyItem[];
  onToggle?: (key: EnergyKey, next: boolean, nextCount: number) => void;
  className?: string;
}) {
  // Build state from incoming energies
  const makeActive = React.useCallback(
    () =>
      Object.fromEntries(energies.map((e) => [e.key, false])) as Record<
        EnergyKey,
        boolean
      >,
    [energies]
  );

  const makeCounts = React.useCallback(
    () =>
      Object.fromEntries(
        energies.map((e) => [
          e.key,
          initialCounts?.[e.key] ?? rand(0, 18),
        ])
      ) as Record<EnergyKey, number>,
    [energies, initialCounts]
  );

  const [active, setActive] = React.useState<Record<EnergyKey, boolean>>(
    makeActive()
  );
  const [counts, setCounts] = React.useState<Record<EnergyKey, number>>(
    makeCounts()
  );

  // Keep state in sync if the set of energies changes
  React.useEffect(() => {
    setActive(makeActive());
    setCounts(makeCounts());
  }, [makeActive, makeCounts]);

  // Defer parent callbacks to after commit (prevents React warning)
  type EmitPayload = { key: EnergyKey; next: boolean; nextCount: number } | null;
  const [emit, setEmit] = React.useState<EmitPayload>(null);
  React.useEffect(() => {
    if (!emit) return;
    onToggle?.(emit.key, emit.next, emit.nextCount);
    setEmit(null);
  }, [emit, onToggle]);

  function toggle(key: EnergyKey) {
    setActive((prev) => {
      const next = !prev[key];
      setCounts((prevCounts) => {
        const nextCount = (prevCounts[key] ?? 0) + (next ? 1 : -1);
        const updated = { ...prevCounts, [key]: nextCount };
        setEmit({ key, next, nextCount });
        return updated;
      });
      return { ...prev, [key]: next };
    });
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={`inline-flex items-center gap-2 ${className ?? ""}`}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
        }}
      >
        {energies.map(({ key, label, Icon }) => {
          const isOn = !!active[key];
          return (
            <motion.button
              key={key}
              variants={childVariants}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93, rotate: -3 }}
              onClick={() => toggle(key)}
              aria-pressed={isOn}
              title={label}
              className={[
                "relative overflow-visible rounded-full border px-3 py-1 transition select-none",
                "inline-flex items-center gap-1.5 transform-gpu will-change-transform",
                compact ? "text-xs" : "text-sm",
                isOn
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100",
              ].join(" ")}
            >
              {/* Ripple */}
              <AnimatePresence>
                {isOn && (
                  <motion.span
                    key="ripple"
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ opacity: 0.28, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 1.25 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    aria-hidden
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(39,141,109,0.25), rgba(39,141,109,0) 70%)",
                    }}
                  />
                )}
              </AnimatePresence>

              <Icon className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
              {/* if you want visible labels, remove sr-only */}
              {!compact && <span className="sr-only">{label}</span>}

              <motion.span
                className="tabular-nums text-gray-500"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
              >
                {counts[key] ?? 0}
              </motion.span>
            </motion.button>
          );
        })}
      </motion.div>
    </MotionConfig>
  );
}

/* helpers */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
