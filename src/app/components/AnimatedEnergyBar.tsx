"use client";

import React from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Waves, Flame, Sun, Sparkles, Gem } from "lucide-react";
import type { Variants, Transition } from "framer-motion";
import Image from "next/image";

/**
 * AnimatedEnergyBar.tsx — smoother + staggered version
 * - Icons: Waves, Flame, Sun, Sparkles, Gem
 * - Tweened keyframes + gentle cubic bezier for silky motion
 * - Transform-only (scale/opacity) + GPU hints
 * - Transform-based ripple (radial gradient)
 * - Staggered entrance using parent/child variants
 * CSS: :root { --brand: #278d6d; }
 */

export type EnergyKey = "Calm" | "Hype" | "Warmth" | "Glow" | "Gem";

const ENERGIES: { key: EnergyKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "Calm", label: "Calm", Icon: Waves },
  { key: "Hype", label: "Hype", Icon: Flame },
  { key: "Warmth", label: "Warmth", Icon: Sun },
  { key: "Glow", label: "Glow", Icon: Sparkles },
  { key: "Gem", label: "Gem", Icon: Gem },
];

// Child animation for each button (used by parent stagger)
const childVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: [0.6, 1.12, 1],
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1], // keep the smooth cubic-bezier
    },
  },
};


export function AnimatedEnergyBar({
  compact = false,
  initialCounts,
  onToggle,
  className,
}: {
  compact?: boolean;
  initialCounts?: Partial<Record<EnergyKey, number>>;
  onToggle?: (key: EnergyKey, next: boolean, nextCount: number) => void;
  className?: string;
}) {
  const [active, setActive] = React.useState<Record<EnergyKey, boolean>>({
    Calm: false,
    Hype: false,
    Warmth: false,
    Glow: false,
    Gem: false,
  });

  const [counts, setCounts] = React.useState<Record<EnergyKey, number>>({
    Calm: initialCounts?.Calm ?? rand(3, 24),
    Hype: initialCounts?.Hype ?? rand(1, 18),
    Warmth: initialCounts?.Warmth ?? rand(1, 20),
    Glow: initialCounts?.Glow ?? rand(0, 16),
    Gem: initialCounts?.Gem ?? rand(0, 8),
  });

  // ✨ NEW: queue an emit to call the parent AFTER commit
  type EmitPayload = { key: EnergyKey; next: boolean; nextCount: number } | null;
  const [emit, setEmit] = React.useState<EmitPayload>(null);

  React.useEffect(() => {
    if (!emit) return;
    onToggle?.(emit.key, emit.next, emit.nextCount);
    setEmit(null);
  }, [emit, onToggle]);

  function toggle(key: EnergyKey) {
    // update local state synchronously…
    setActive((prev) => {
      const next = !prev[key];
      // …and compute next counts
      setCounts((prevCounts) => {
        const nextCount = prevCounts[key] + (next ? 1 : -1);
        const updated = { ...prevCounts, [key]: nextCount };
        // queue the parent callback to run after render
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
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } } }}
      >
        {ENERGIES.map(({ key, label, Icon }) => {
          const isOn = active[key];
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
              {/* smooth transform-based ripple */}
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
              {/* visually hidden, accessible label */}
              {!compact && <span className="sr-only">{label}</span>}

              <motion.span
                className="tabular-nums text-gray-500"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
              >
                {counts[key]}
              </motion.span>
            </motion.button>
          );
        })}
      </motion.div>
    </MotionConfig>
  );
}


// Simple demo block for screen recording (IG Story/Reel)
// export function DemoEnergyBarStory() {
//   return (
//     <div className="w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-green-50">
//       <div className="w-[min(700px,92vw)] rounded-3xl border border-gray-100 bg-white shadow-xl p-6">
//         <div className="mb-4">
//           <h3 className="text-lg font-heading font-bold">VibeCard — “Weekend Mood”</h3>
//           <p className="text-gray-600 font-sans">Chill mix and a walk in the park 🌿</p>
//         </div>
//         <div className="aspect-video rounded-2xl bg-gray-100 mb-4" />
//         <AnimatedEnergyBar />
//         <p className="mt-3 text-xs text-gray-500">Tap icons to pop + ripple. Record this area for IG Story/Reel.</p>
//       </div>
//     </div>
//   );
// }





// export function DemoEnergyBarStory() {
//   // mock reactors
//   const reactors = [
//     "/avatars/a1.png",
//     "/avatars/a2.png",
//     "/avatars/a3.png",
//     "/avatars/a4.png",
//   ];

//   return (
//     <div className="w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-green-50">
//       {/* Gradient frame */}
//       <motion.div
//         initial={{ y: 8, opacity: 0.95 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//         className="relative w-[min(700px,92vw)] rounded-[26px] p-[2px] bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-500 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
//       >
//         <div className="relative rounded-[24px] bg-white border border-white/40 p-6">
//           {/* Avatar + name below */}
//           <div className="absolute top-3 right-5 flex flex-col items-center">
//             <Image
//               src="/rootedworkslabs-logo.png" // ensure in /public
//               alt="RootedWorks Labs"
//               width={56}
//               height={56}
//               className="rounded-full border-2 border-white shadow-lg"
//               priority
//             />
//             <span className="mt-1 text-xs font-medium text-gray-800">RootedWorks Labs</span>
//             <span className="text-[11px] text-gray-500">Sat • 4:32 PM</span>
//           </div>

//           {/* Title + subtitle */}
//           <div className="mb-4 pr-24">
//             <h3 className="text-lg font-heading font-bold">VibeCard — “Weekend Mood”</h3>
//             <p className="text-gray-600 font-sans">Chill mix and a walk in the park 🌿</p>
//           </div>

//           {/* Media area */}
//           <div className="relative aspect-video rounded-2xl bg-gray-100 mb-4 overflow-hidden">
//             <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
//           </div>

//           {/* Animated reactions */}
//           <AnimatedEnergyBar className="w-full justify-center" />

//           {/* Reactor avatars row */}
//           <div className="mt-3 flex items-center justify-center gap-2">
//             <div className="flex -space-x-3">
//               {reactors.map((src, i) => (
//                 <Image
//                   key={src}
//                   src={src}
//                   alt={`Reactor ${i + 1}`}
//                   width={24}
//                   height={24}
//                   className="rounded-full border border-white shadow-sm"
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-gray-500">+ 18 more felt this</span>
//           </div>

//           {/* Footer hint */}
//           <p className="mt-3 text-xs text-gray-500 text-center">
//             Tap icons to pop + ripple. Record this area for IG Story/Reel.
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

const ENERGY_COLORS: Record<EnergyKey, string> = {
  Calm:   "rgb(16, 185, 129)",   // teal/emerald
  Hype:   "rgb(244, 114, 182)",  // pink
  Warmth: "rgb(251, 191, 36)",   // amber
  Glow:   "rgb(59, 130, 246)",   // blue
  Gem:    "rgb(168, 85, 247)",   // violet
};

type AmbientPulse = { id: number; key: EnergyKey; xPct: number; yPct: number };

export function DemoEnergyBarStory() {
  const [stream, setStream] = React.useState<StreamParticle[]>([]);
  const [ambient, setAmbient] = React.useState<AmbientPulse[]>([]);
  const [washColor, setWashColor] = React.useState<string | null>(null);

  function onToggle(key: EnergyKey, next: boolean) {
    if (!next) return;
    // Energy Stream particle
    pushParticle(key);
    // Ambient color wash + pulse
    setWashColor(ENERGY_COLORS[key]);
    pushPulse(key);
  }

  function pushParticle(key: EnergyKey) {
    const p: StreamParticle = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      key,
      topPct: 15 + Math.random() * 70,
      size: 6 + Math.floor(Math.random() * 6),
      duration: 3.8 + Math.random() * 2.2,
      opacity: 0.8,
    };
    setStream((prev) => [...prev.slice(-24), p]);
  }

  function pushPulse(key: EnergyKey) {
    const pulse: AmbientPulse = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      key,
      xPct: 20 + Math.random() * 60, // avoid extreme edges
      yPct: 20 + Math.random() * 60,
    };
    setAmbient((prev) => [...prev.slice(-6), pulse]); // keep last ~6 pulses
    // clear wash after a moment
    setTimeout(() => setWashColor(null), 800);
  }

  return (
    <div className="w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-green-50">
      {/* Gradient frame */}
      <motion.div
        initial={{ y: 8, opacity: 0.95 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[min(700px,92vw)] rounded-[26px] p-[2px] bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-500 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      >
        <div className="relative overflow-hidden rounded-[24px] bg-white border border-white/40 p-6">
          {/* Ambient vibe wash (soft gradient tint) */}
          <AmbientWash color={washColor} />

          {/* Ambient pulses (radial glow bursts) */}
          <AmbientPulses pulses={ambient} />

          {/* Avatar with name below */}
          <div className="absolute top-3 right-5 z-10 flex flex-col items-center">
            <Image
              src="/rootedworkslabs-logo.png"
              alt="RootedWorks Labs"
              width={56}
              height={56}
              className="rounded-full border-2 border-white shadow-lg"
              priority
            />
            <span className="mt-1 text-xs font-medium text-gray-800">RootedWorks Labs</span>
            <span className="text-[11px] text-gray-500">Sat • 4:32 PM</span>
          </div>

          {/* Title + subtitle */}
          <div className="mb-4 pr-24">
            <h3 className="text-lg font-heading font-bold">VibeCard — “Weekend Mood”</h3>
            <p className="text-gray-600 font-sans">Chill mix and a walk in the park 🌿</p>
          </div>

          {/* Media area */}
          <div className="relative aspect-video rounded-2xl bg-gray-100 mb-4 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
          </div>

          {/* Animated reactions */}
          <AnimatedEnergyBar className="w-full justify-center" onToggle={onToggle} />

          {/* Energy Stream Line (replaces IG-style avatars) */}
          <EnergyStreamLine particles={stream} />

          {/* Footer hint */}
          <p className="mt-3 text-xs text-gray-500 text-center">
            Tap icons to pop + ripple. Record this area for IG Story/Reel.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Ambient components ---------------- */

function AmbientWash({ color }: { color: string | null }) {
  // Render only when we have a color to show
  if (!color) return null;
  return (
    <motion.div
      key={color + "-wash"}
      className="pointer-events-none absolute inset-0 z-0"
      initial={{ opacity: 0, background: "transparent" }}
      animate={{
        opacity: [0, 0.12, 0],
        background: [
          "radial-gradient(120% 120% at 50% 50%, transparent, transparent)",
          `radial-gradient(120% 120% at 50% 50%, ${color}22, transparent 70%)`,
          "radial-gradient(120% 120% at 50% 50%, transparent, transparent)",
        ],
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      aria-hidden
    />
  );
}

function AmbientPulses({ pulses }: { pulses: AmbientPulse[] }) {
  return (
    <>
      {pulses.map((p) => (
        <motion.span
          key={p.id}
          className="pointer-events-none absolute z-0 rounded-full"
          style={{
            left: `calc(${p.xPct}% - 200px)`,
            top: `calc(${p.yPct}% - 200px)`,
            width: 400,
            height: 400,
            background: `radial-gradient(closest-side, ${ENERGY_COLORS[p.key]}22, transparent 70%)`,
          }}
          initial={{ opacity: 0.0, scale: 0.8 }}
          animate={{ opacity: [0.18, 0.0], scale: 1.25 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          aria-hidden
        />
      ))}
    </>
  );
}

/* ---------------- Energy Stream Line ---------------- */

type StreamParticle = {
  id: number;
  key: EnergyKey;
  topPct: number;
  size: number;
  duration: number;
  opacity: number;
};

function EnergyStreamLine({ particles }: { particles: StreamParticle[] }) {
  return (
    <div className="mt-3 relative h-8 rounded-full bg-gray-50 border border-gray-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            top: `${p.topPct}%`,
            width: p.size,
            height: p.size,
            backgroundColor: ENERGY_COLORS[p.key],
            boxShadow: `0 0 10px ${ENERGY_COLORS[p.key]}55`,
          }}
          initial={{ x: "-8%", opacity: p.opacity }}
          animate={{ x: "108%", opacity: [p.opacity, p.opacity, 0.2] }}
          transition={{ duration: p.duration, ease: "linear" }}
        />
      ))}
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
    </div>
  );
}


/* helpers */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
