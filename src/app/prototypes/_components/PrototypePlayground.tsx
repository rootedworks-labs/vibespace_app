"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// at the top with your other imports
import {
  Waves, Flame, Sun, Sparkles, Gem, Smile, Moon,
  Flower2, Heart, Zap, Music4, Rocket, Users, Clock, PanelsTopLeft,
} from "lucide-react";
import type { EnergyItem, EnergyKey } from "@/src/app/prototypes/_components/AnimatedEnergyBar";
import { AnimatedEnergyBar } from "@/src/app/prototypes/_components/AnimatedEnergyBar";

/* =========================================================
   Preset vibe sets
   ========================================================= */
const SET_BALANCED: EnergyItem[] = [
  { key: "Flow", label: "Flow", Icon: Waves },
  { key: "Hype", label: "Hype", Icon: Flame },
  { key: "Warmth", label: "Warmth", Icon: Sun },
  { key: "Glow", label: "Glow", Icon: Sparkles },
  { key: "Gem", label: "Gem", Icon: Gem },
  { key: "Joy", label: "Joy", Icon: Smile },
  { key: "Reflect", label: "Reflect", Icon: Moon },
];

const SET_CHILL: EnergyItem[] = [
  { key: "Flow", label: "Flow", Icon: Waves },
  { key: "Warmth", label: "Warmth", Icon: Sun },
  { key: "Reflect", label: "Reflect", Icon: Moon },
  { key: "Serenity", label: "Serenity", Icon: Flower2 },
  { key: "Joy", label: "Joy", Icon: Smile },
  { key: "Love", label: "Love", Icon: Heart },
  { key: "Glow", label: "Glow", Icon: Sparkles },
];

const SET_HYPE: EnergyItem[] = [
  { key: "Hype", label: "Hype", Icon: Flame },
  { key: "Spark", label: "Spark", Icon: Zap },
  { key: "Glow", label: "Glow", Icon: Sparkles },
  { key: "Gem", label: "Gem", Icon: Gem },
  { key: "Joy", label: "Joy", Icon: Smile },
  { key: "Groove", label: "Groove", Icon: Music4 },
  { key: "Drive", label: "Drive", Icon: Rocket },
];

const VIBESETS = {
  Balanced: SET_BALANCED,
  Chill: SET_CHILL,
  Hype: SET_HYPE,
} as const;

/* =========================================================
   Colors for Stream / Ambient
   ========================================================= */
const ENERGY_COLORS: Record<string, string> = {
  Flow:  "rgb(16,185,129)",  // teal
  Hype:  "rgb(244,114,182)", // pink
  Warmth:"rgb(251,191,36)",  // amber
  Glow:  "rgb(59,130,246)",  // blue
  Gem:   "rgb(168,85,247)",  // violet
  Joy:   "rgb(236,72,153)",  // fuchsia
  Reflect:"rgb(99,102,241)", // indigo
  Serenity:"rgb(20,184,166)",// teal-500
  Love:  "rgb(239,68,68)",   // red
  Spark: "rgb(250,204,21)",  // yellow
  Groove:"rgb(34,197,94)",   // green
  Drive: "rgb(2,132,199)",   // sky-600
};

const colorFor = (key: string) => ENERGY_COLORS[key] ?? "rgb(39,141,109)"; // default brand

// rgba helper for ambient gradients (FIXED template string)
function rgba(rgb: string, alpha: number) {
  const m = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (!m) return rgb;
  const [, r, g, b] = m;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* =========================================================
   Shared UI bits (frame, header, media)
   ========================================================= */
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

/* =========================================================
   DEMO 1 — Default
   ========================================================= */
const DemoEnergyBarStory_Default: React.FC<{ energies: EnergyItem[] }> = ({ energies }) => (
  <CardFrame>
    <HeaderWithAvatar />
    <MediaBlock />
    <AnimatedEnergyBar className="w-full justify-center" energies={energies} />
    <p className="mt-3 text-xs text-gray-500 text-center">
      Tap icons to pop + ripple. Record this area for IG Story/Reel.
    </p>
  </CardFrame>
);

/* =========================================================
   DEMO 2 — Energy Stream Line
   ========================================================= */
type StreamParticle = { id: number; key: string; topPct: number; size: number; duration: number; opacity: number; };

const EnergyStreamLine: React.FC<{ particles: StreamParticle[] }> = ({ particles }) => (
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
          backgroundColor: colorFor(p.key),
          boxShadow: `0 0 10px ${rgba(colorFor(p.key), 0.33)}`,
        }}
        initial={{ x: "-8%", opacity: p.opacity }}
        animate={{ x: "108%", opacity: [p.opacity, p.opacity, 0.2] }}
        transition={{ duration: p.duration, ease: "linear" }}
      />
    ))}
    <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
  </div>
);

const DemoEnergyBarStory_Stream: React.FC<{ energies: EnergyItem[] }> = ({ energies }) => {
  const [stream, setStream] = React.useState<StreamParticle[]>([]);

  function pushParticle(key: EnergyKey, next: boolean) {
    if (!next) return;
    const p: StreamParticle = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      key: String(key),
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
      <AnimatedEnergyBar className="w-full justify-center" energies={energies} onToggle={pushParticle} />
      <EnergyStreamLine particles={stream} />
      <p className="mt-3 text-xs text-gray-500 text-center">Flowing “energy” instead of IG-style avatars.</p>
    </CardFrame>
  );
};

/* =========================================================
   DEMO 3 — Ambient Animation
   ========================================================= */
type AmbientPulse = { id: number; key: string; xPct: number; yPct: number };

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
          background: `radial-gradient(closest-side, ${rgba(colorFor(p.key), 0.13)}, transparent 70%)`,
        }}
        initial={{ opacity: 0.0, scale: 0.8 }}
        animate={{ opacity: [0.18, 0.0], scale: 1.25 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        aria-hidden
      />
    ))}
  </>
);

const DemoEnergyBarStory_Ambient: React.FC<{ energies: EnergyItem[] }> = ({ energies }) => {
  const [ambient, setAmbient] = React.useState<AmbientPulse[]>([]);
  const [washColor, setWashColor] = React.useState<string | null>(null);

  function onToggle(key: EnergyKey, next: boolean) {
    if (!next) return;
    const c = colorFor(String(key));
    setWashColor(c);
    const pulse: AmbientPulse = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      key: String(key),
      xPct: 20 + Math.random() * 60,
      yPct: 20 + Math.random() * 60,
    };
    setAmbient((prev) => [...prev.slice(-6), pulse]);
    setTimeout(() => setWashColor(null), 800);
  }

  return (
    <CardFrame>
      <AmbientWash color={washColor} />
      <AmbientPulses pulses={ambient} />
      <HeaderWithAvatar />
      <MediaBlock />
      <AnimatedEnergyBar className="w-full justify-center" energies={energies} onToggle={onToggle} />
      <p className="mt-3 text-xs text-gray-500 text-center">Soft ambient color wash + pulses on reactions.</p>
    </CardFrame>
  );
};

/* =========================================================
   DEMO 4 — Radial Navigation (fixed)
   ========================================================= */
const Demo_RadialNavigation: React.FC = () => {
  const items = [
    { key: "People", Icon: Users },
    { key: "Vibes", Icon: Sparkles },
    { key: "Windows", Icon: Clock },
    { key: "Spaces", Icon: PanelsTopLeft },
  ];
  const radius = 120;

  return (
    <CardFrame>
      <HeaderWithAvatar />
      <div className="relative flex items-center justify-center py-10">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 rounded-full px-5 py-3 bg-[var(--brand)] text-white shadow-lg"
        >
          Vibe Hub
        </motion.button>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            left: "50%",
            top: "50%",
            width: radius * 2,
            height: radius * 2,
            transform: "translate(-50%, -50%)",
            borderRadius: "9999px",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        />

        <div className="absolute inset-0">
          {items.map((it, i) => {
            const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={it.key}
                className="absolute"
                style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
              >
                <motion.button
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95, rotate: -3 }}
                  style={{ x, y }}
                  className="rounded-2xl border bg-white border-gray-200 shadow-md px-3 py-2 flex items-center gap-2 transform-gpu"
                >
                  <it.Icon className="w-4 h-4 text-gray-700" />
                  <span className="text-sm">{it.key}</span>
                </motion.button>
              </div>
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

/* =========================================================
   DEMO 5 — Time-Windowed Feed
   ========================================================= */
const Demo_TimeWindowFeed: React.FC<{ energies: EnergyItem[] }> = ({ energies }) => {
  const windows = [
    { key: "Morning", posts: ["Stretch + tea 🌿", "Studio warmup 🎶"] },
    { key: "Afternoon", posts: ["Co-work sprint 💻", "Park loop 🚶🏽‍♀️"] },
    { key: "Evening", posts: ["Lo-fi wind-down 🎧", "Neighborhood hang 🏘️"] },
  ];
  const [active, setActive] = React.useState<string>(windows[0].key);

  return (
    <CardFrame>
      <HeaderWithAvatar />

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

      <div className="space-y-2">
        {windows.find((w) => w.key === active)?.posts.map((p, i) => (
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
        <AnimatedEnergyBar className="w-full justify-center" energies={energies} />
      </div>

      <p className="mt-3 text-xs text-gray-500 text-center">
        Switch time windows instead of endless scroll.
      </p>
    </CardFrame>
  );
};

/* =========================================================
   DEMO 6 — Vibe Check Card
   ========================================================= */
const Demo_VibeCheckCard: React.FC<{ energies: EnergyItem[] }> = ({ energies }) => {
  const quick = energies.slice(0, 4);

  return (
    <CardFrame>
      <HeaderWithAvatar />

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span className="text-sm font-medium text-emerald-800">Vibe Check</span>
        </div>

        <h3 className="text-lg font-heading font-semibold mb-2">
          What’s your energy right now?
        </h3>

        <div className="mb-3 flex flex-wrap gap-2">
          {quick.map(({ key, Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94, rotate: -2 }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm inline-flex items-center gap-2"
              aria-label={key}
            >
              <Icon className="w-4 h-4 text-gray-700" />
              <span className="sr-only">{key}</span>
            </motion.button>
          ))}
        </div>

        <AnimatedEnergyBar compact className="justify-center" energies={energies} />
      </div>

      <p className="mt-3 text-xs text-gray-500 text-center">
        Lightweight daily check-in with quick taps (no typing needed).
      </p>
    </CardFrame>
  );
};

/* =========================================================
   Playground Switcher
   ========================================================= */
const DEMOS = [
  { key: "Default", render: (energies: EnergyItem[]) => <DemoEnergyBarStory_Default energies={energies} /> },
  { key: "Energy Stream", render: (energies: EnergyItem[]) => <DemoEnergyBarStory_Stream energies={energies} /> },
  { key: "Ambient Animation", render: (energies: EnergyItem[]) => <DemoEnergyBarStory_Ambient energies={energies} /> },
  { key: "Radial Navigation", render: () => <Demo_RadialNavigation /> },
  { key: "Time-Window Feed", render: (energies: EnergyItem[]) => <Demo_TimeWindowFeed energies={energies} /> },
  { key: "Vibe Check Card", render: (energies: EnergyItem[]) => <Demo_VibeCheckCard energies={energies} /> },
] as const;

type DemoKey = (typeof DEMOS)[number]["key"];
type VibesetKey = keyof typeof VIBESETS;

export default function PrototypePlayground() {
  const [selected, setSelected] = React.useState<DemoKey>("Default");
  const [vibeset, setVibeset] = React.useState<VibesetKey>("Balanced");
  const energies = VIBESETS[vibeset];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-1">VibeSpace — Prototype Playground</h1>
        <p className="text-sm text-gray-600">Toggle demos + vibe sets</p>
      </div>

      {/* Vibe set selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(VIBESETS) as VibesetKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setVibeset(k)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              vibeset === k
                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Demo selector */}
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

      {/* Render selected demo */}
      <div className="px-4">
        {DEMOS.find((d) => d.key === selected)?.render(energies)}
      </div>
    </div>
  );
}
