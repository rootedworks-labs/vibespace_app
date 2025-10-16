'use client';

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Waves, Flame, Moon, Sun, Sparkles } from "lucide-react";

// Time-windowed prototype for VibeSpace
// Content is grouped into daily windows rather than infinite scroll.
// NOW with an inline ReactionBar using energy-based reactions.

export default function VibeTimeWindowedPrototype() {
  const [activeDay, setActiveDay] = React.useState<string>("Monday");

  const windows = [
    { day: "Monday", posts: ["Morning meditation 🌿", "Studio session 🎶", "Evening walk 🌙"] },
    { day: "Tuesday", posts: ["Coffee catch-up ☕", "Team brainstorm 💡"] },
    { day: "Wednesday", posts: ["Reading nook 📖", "Neighborhood vibes 🏘"] },
    { day: "Thursday", posts: ["Block party flyers 🎨"] },
    { day: "Friday", posts: ["Weekend planning 🗓", "Lo-fi listening 🎧"] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">🕊 VibeSpace — Time Windowed Prototype</h1>
        <p className="text-sm text-gray-600">Content is grouped into daily chapters. Switch days instead of endless scroll.</p>
      </header>

      {/* Day Selector */}
      <div className="flex gap-2 justify-center mb-6 flex-wrap">
        {windows.map((w) => (
          <button
            key={w.day}
            onClick={() => setActiveDay(w.day)}
            className={`px-4 py-2 rounded-full border transition ${activeDay===w.day?"bg-[var(--brand)] text-white border-[var(--brand)]":"bg-white text-gray-700 border-gray-200 hover:bg-green-50"}`}
          >
            {w.day}
          </button>
        ))}
      </div>

      {/* Active Day Content */}
      <section className="max-w-2xl mx-auto">
        {windows.filter((w) => w.day===activeDay).map((w) => (
          <motion.div
            key={w.day}
            initial={{opacity:0, y:10}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.3}}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><CalendarDays size={18}/> {w.day}</h2>
            <ul className="space-y-3">
              {w.posts.map((post, i) => (
                <li key={i} className="p-3 rounded-xl bg-green-50/60 text-gray-800 border border-green-100">
                  <p className="mb-2">{post}</p>
                  <ReactionBar id={`${w.day}-${i}`} />
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

/* -------------------- Reactions -------------------- */

type Energy = "Calm" | "Hype" | "Nostalgic" | "Warmth" | "Glow";

const ENERGY_META: Record<Energy, { Icon: React.ComponentType<{ className?: string; size?: number }>; hint: string }> = {
  Calm: { Icon: Waves, hint: "peaceful, grounding" },
  Hype: { Icon: Flame, hint: "charged, high energy" },
  Nostalgic: { Icon: Moon, hint: "memory, reflective" },
  Warmth: { Icon: Sun, hint: "cozy, inviting" },
  Glow: { Icon: Sparkles, hint: "radiant, uplifting" },
};

function ReactionBar({ id }: { id: string }) {
  // Local state per list item; in real app, key by post id and persist via API
  const [active, setActive] = React.useState<Record<Energy, boolean>>({ Calm:false, Hype:false, Nostalgic:false, Warmth:false, Glow:false });
  const [counts, setCounts] = React.useState<Record<Energy, number>>({
    Calm: rand(1, 24),
    Hype: rand(0, 18),
    Nostalgic: rand(0, 16),
    Warmth: rand(0, 20),
    Glow: rand(0, 14),
  });

  function toggle(kind: Energy){
    setActive((prev) => ({ ...prev, [kind]: !prev[kind] }));
    setCounts((prev) => ({ ...prev, [kind]: prev[kind] + (active[kind] ? -1 : 1) }));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(ENERGY_META) as Energy[]).map((kind) => {
        const { Icon, hint } = ENERGY_META[kind];
        const isOn = active[kind];
        return (
          <button
            key={`${id}-${kind}`}
            onClick={() => toggle(kind)}
            aria-pressed={isOn}
            title={`${kind}: ${hint}`}
            className={`group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm transition ${
              isOn
                ? "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/30"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <motion.span whileTap={{ scale: 0.9 }} className="inline-flex items-center">
              <Icon className="w-4 h-4" />
            </motion.span>
            <span className="hidden sm:inline">{kind}</span>
            <span className="tabular-nums text-xs text-gray-500">{counts[kind]}</span>
          </button>
        );
      })}
    </div>
  );
}

function rand(min: number, max: number){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
