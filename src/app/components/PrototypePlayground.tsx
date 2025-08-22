"use client";

import { Users, Sparkles, Clock, PanelsTopLeft, ThumbsUp, Coffee, Moon } from "lucide-react";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedEnergyBar, type EnergyKey } from "@/src/app/components/AnimatedEnergyBar"; // adjust path if needed

/* ---------------- Shared styling helpers ---------------- */
const CardFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ y: 8, opacity: 0.95 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="relative w-[min(700px,92vw)] rounded-[26px] p-[2px] bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-500 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
  >
    <div className="relative overflow-hidden rounded-[24px] bg-white border border-white/40 p-6">
      {children}
    </div>
  </motion.div>
);

const HeaderWithAvatar: React.FC = () => (
  <>
    {/* Avatar with name below */}
    <div className="absolute top-3 right-5 z-10 flex flex-col items-center">
      <Image
        src="/rootedworkslabs-logo.png" // ensure in /public
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
  </>
);

const MediaBlock: React.FC = () => (
  <div className="relative aspect-video rounded-2xl bg-gray-100 mb-4 overflow-hidden">
    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
  </div>
);

/* ---------------- Energy colors for stream/ambient ---------------- */
const ENERGY_COLORS: Record<EnergyKey, string> = {
  Calm: "rgb(16, 185, 129)", // teal/emerald
  Hype: "rgb(244, 114, 182)", // pink
  Warmth: "rgb(251, 191, 36)", // amber
  Glow: "rgb(59, 130, 246)", // blue
  Gem: "rgb(168, 85, 247)", // violet
};

/* helper: convert rgb(...) to rgba(..., alpha) */
function rgba(rgb: string, alpha: number) {
  const m = rgb.match(/rgb\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)/i);
  if (!m) return rgb; // fallback
  const [, r, g, b] = m;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ---------------- Default Demo ---------------- */
export const DemoEnergyBarStory_Default: React.FC = () => (
  <CardFrame>
    <HeaderWithAvatar />
    <MediaBlock />
    <AnimatedEnergyBar className="w-full justify-center" />
    <p className="mt-3 text-xs text-gray-500 text-center">Tap icons to pop + ripple. Record this area for IG Story/Reel.</p>
  </CardFrame>
);

/* ---------------- Energy Stream Line Demo ---------------- */
type StreamParticle = { id: number; key: EnergyKey; topPct: number; size: number; duration: number; opacity: number; };

const EnergyStreamLine: React.FC<{ particles: StreamParticle[] }> = ({ particles }) => (
  <div className="mt-3 relative h-8 rounded-full bg-gray-50 border border-gray-100 overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    {particles.map((p) => (
      <motion.span
        key={p.id}
        className="absolute rounded-full"
        style={{ top: `${p.topPct}%`, width: p.size, height: p.size, backgroundColor: ENERGY_COLORS[p.key], boxShadow: `0 0 10px ${ENERGY_COLORS[p.key]}55` }}
        initial={{ x: "-8%", opacity: p.opacity }}
        animate={{ x: "108%", opacity: [p.opacity, p.opacity, 0.2] }}
        transition={{ duration: p.duration, ease: "linear" }}
      />
    ))}
    <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
  </div>
);

export const DemoEnergyBarStory_Stream: React.FC = () => {
  const [stream, setStream] = React.useState<StreamParticle[]>([]);

  function pushParticle(key: EnergyKey, next: boolean) {
    if (!next) return; // only on toggle ON
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

  return (
    <CardFrame>
      <HeaderWithAvatar />
      <MediaBlock />
      <AnimatedEnergyBar className="w-full justify-center" onToggle={pushParticle} />
      <EnergyStreamLine particles={stream} />
      <p className="mt-3 text-xs text-gray-500 text-center">Tap icons to pop + ripple. Record this area for IG Story/Reel.</p>
    </CardFrame>
  );
};

/* ---------------- Ambient Animation Demo ---------------- */

type AmbientPulse = { id: number; key: EnergyKey; xPct: number; yPct: number };

const AmbientWash: React.FC<{ color: string | null }> = ({ color }) => {
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
          // FIX: use rgba(color, alpha) — rgb strings can't take `${color}22`
          `radial-gradient(120% 120% at 50% 50%, ${rgba(color, 0.13)}, transparent 70%)`,
          "radial-gradient(120% 120% at 50% 50%, transparent, transparent)",
        ],
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      aria-hidden
    />
  );
};

const AmbientPulses: React.FC<{ pulses: AmbientPulse[] }> = ({ pulses }) => (
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
          // FIX: rgba() for alpha
          background: `radial-gradient(closest-side, ${rgba(ENERGY_COLORS[p.key], 0.13)}, transparent 70%)`,
        }}
        initial={{ opacity: 0.0, scale: 0.8 }}
        animate={{ opacity: [0.18, 0.0], scale: 1.25 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        aria-hidden
      />
    ))}
  </>
);

export const DemoEnergyBarStory_Ambient: React.FC = () => {
  const [ambient, setAmbient] = React.useState<AmbientPulse[]>([]);
  const [washColor, setWashColor] = React.useState<string | null>(null);

  function onToggle(key: EnergyKey, next: boolean) {
    if (!next) return;
    setWashColor(ENERGY_COLORS[key]);
    const pulse: AmbientPulse = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      key,
      xPct: 20 + Math.random() * 60,
      yPct: 20 + Math.random() * 60,
    };
    setAmbient((prev) => [...prev.slice(-6), pulse]);
    setTimeout(() => setWashColor(null), 800);
  }

  return (
    <CardFrame>
      {/* ambient layers */}
      <AmbientWash color={washColor} />
      <AmbientPulses pulses={ambient} />

      <HeaderWithAvatar />
      <MediaBlock />
      <AnimatedEnergyBar className="w-full justify-center" onToggle={onToggle} />
      <p className="mt-3 text-xs text-gray-500 text-center">Tap icons to pop + ripple. Record this area for IG Story/Reel.</p>
    </CardFrame>
  );
};



export default function PrototypePlayground() {
  const [selected, setSelected] = React.useState<(typeof DEMOS)[number]["key"]>("Default");
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-1">VibeSpace — Prototype Playground</h1>
        <p className="text-sm text-gray-600">Toggle between demos without copy-paste</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEMOS.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelected(d.key)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              selected === d.key
                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {d.key}
          </button>
        ))}
      </div>

      <div className="px-4">{DEMOS.find((d) => d.key === selected)?.node}</div>
    </div>
  );
}

/* --- Radial Navigation Demo --- */
export const Demo_RadialNavigation: React.FC = () => {
  const items = [
    { key: "People", Icon: Users },
    { key: "Vibes", Icon: Sparkles },
    { key: "Windows", Icon: Clock },
    { key: "Spaces", Icon: PanelsTopLeft },
  ];

  return (
    <CardFrame>
      <HeaderWithAvatar />
      <div className="relative flex items-center justify-center py-10">
        {/* hub */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 rounded-full px-5 py-3 bg-[var(--brand)] text-white shadow-lg"
        >
          Vibe Hub
        </motion.button>

        {/* orbit */}
        <div className="absolute inset-0 flex items-center justify-center">
          {items.map((it, i) => {
            const angle = (i / items.length) * Math.PI * 2;
            const r = 120; // radius
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <motion.button
                key={it.key}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95, rotate: -3 }}
                className="absolute rounded-2xl border bg-white border-gray-200 shadow-md px-3 py-2 flex items-center gap-2"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                <it.Icon className="w-4 h-4 text-gray-700" />
                <span className="text-sm">{it.key}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 text-center">
        Radial hub → tap spokes to navigate people, vibes, time windows, spaces.
      </p>
    </CardFrame>
  );
};

/* --- Time-Windowed Feed Demo --- */
export const Demo_TimeWindowFeed: React.FC = () => {
  const windows = [
    { key: "Morning", posts: ["Stretch + tea 🌿", "Studio warmup 🎶"] },
    { key: "Afternoon", posts: ["Co-work sprint 💻", "Park loop 🚶🏽‍♀️"] },
    { key: "Evening", posts: ["Lo-fi wind-down 🎧", "Neighborhood hang 🏘️"] },
  ];

  const [active, setActive] = React.useState<string>(windows[0].key);

  return (
    <CardFrame>
      <HeaderWithAvatar />

      {/* time chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {windows.map((w) => (
          <button
            key={w.key}
            onClick={() => setActive(w.key)}
            className={`px-3 py-1.5 rounded-full border text-sm transition ${
              active === w.key
                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {w.key}
          </button>
        ))}
      </div>

      {/* posts */}
      <div className="space-y-2">
        {windows
          .find((w) => w.key === active)
          ?.posts.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              {p}
            </motion.div>
          ))}
      </div>

      <div className="mt-4">
        <AnimatedEnergyBar className="w-full justify-center" />
      </div>

      <p className="mt-3 text-xs text-gray-500 text-center">
        Switch time windows instead of endless scroll.
      </p>
    </CardFrame>
  );
};

/* --- Vibe Check Card Demo --- */
export const Demo_VibeCheckCard: React.FC = () => {
  const prompts = [
    "What’s your energy right now?",
    "What’s the micro-win today?",
    "What are you open to?",
  ];
  const [i, setI] = React.useState(0);
  const prompt = prompts[i % prompts.length];

  const quick = [
    { key: "Chill", Icon: Coffee },
    { key: "Focused", Icon: ThumbsUp },
    { key: "Sparkly", Icon: Sparkles },
    { key: "Low-key", Icon: Moon },
  ];

  return (
    <CardFrame>
      <HeaderWithAvatar />

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span className="text-sm font-medium text-emerald-800">Vibe Check</span>
        </div>

        <h3 className="text-lg font-heading font-semibold mb-2">{prompt}</h3>

        {/* quick responses */}
        <div className="mb-3 flex flex-wrap gap-2">
          {quick.map(({ key, Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94, rotate: -2 }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm inline-flex items-center gap-2"
              onClick={() => setI((x) => x + 1)}
              aria-label={key}
            >
              <Icon className="w-4 h-4 text-gray-700" />
              <span className="sr-only">{key}</span>
            </motion.button>
          ))}
        </div>

        {/* optional: energy bar underneath */}
        <AnimatedEnergyBar compact className="justify-center" />
      </div>

      <p className="mt-3 text-xs text-gray-500 text-center">
        Lightweight daily check-in with quick taps (no typing needed).
      </p>
    </CardFrame>
  );
};

/* ---------------- Playground Switcher ---------------- */

const DEMOS = [
  { key: "Default", node: <DemoEnergyBarStory_Default /> },
  { key: "Energy Stream", node: <DemoEnergyBarStory_Stream /> },
  { key: "Ambient Animation", node: <DemoEnergyBarStory_Ambient /> },
  { key: "Radial Navigation", node: <Demo_RadialNavigation /> },
  { key: "Time-Window Feed", node: <Demo_TimeWindowFeed /> },
  { key: "Vibe Check Card", node: <Demo_VibeCheckCard /> },
] as const;
