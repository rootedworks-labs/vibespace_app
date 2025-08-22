'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, Sprout, Sparkles, Music2, ImageIcon, X, Filter } from "lucide-react";

// Single-file prototype: Moodboard-first with Radial Peek + Reactions
// Drop into Next.js + Tailwind. Requires: framer-motion, lucide-react.

export default function VibeMoodboardPrototype() {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Post | null>(null);

  const filtered = activeTag
    ? POSTS.filter((p) => p.tags.includes(activeTag))
    : POSTS;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">🌿 VibeSpace — Moodboard Prototype</h1>
          <p className="text-sm text-gray-600">Arrangeable cards, vibe filters, gentle interactions. Click a card to open details.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[var(--brand)]">
          <Waves /> <Sprout /> <Sparkles />
        </div>
      </header>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 text-gray-700"><Filter size={16}/> Filter by vibe:</span>
        <FilterPill label="All" active={!activeTag} onClick={() => setActiveTag(null)} />
        {VIBE_TAGS.map((t) => (
          <FilterPill key={t} label={t} active={activeTag === t} onClick={() => setActiveTag(t)} />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((post) => (
          <motion.article
            key={post.id}
            layout
            whileHover={{ y: -2 }}
            className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => setSelected(post)}
          >
            <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center relative">
              {post.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="opacity-30 w-10 h-10" />
                </div>
              )}
              <div className="absolute right-3 top-3 flex items-center gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-white/90 text-gray-800 border border-gray-200 shadow-sm">{t}</span>
                ))}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-gray-900 line-clamp-1">{post.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{post.subtitle}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[var(--brand)]/90">
                  <Reaction kind="resonate" count={post.counts.resonate} />
                  <Reaction kind="grow" count={post.counts.grow} />
                  <Reaction kind="glow" count={post.counts.glow} />
                </div>
                <span className="text-xs text-gray-500">{post.time}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal
              className="absolute left-1/2 top-1/2 w-[min(92vw,920px)] -translate-x-1/2 -translate-y-1/2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-3xl overflow-hidden bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">{selected.title}</h3>
                    <p className="text-sm text-gray-600">{selected.subtitle}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-gray-100"><X /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto md:h-[420px] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {selected.type === "image" && <img src={selected.src} alt="" className="absolute inset-0 w-full h-full object-cover"/>}
                    {selected.audio && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full">
                        <Music2 size={16} /> <span className="text-sm">{selected.audio.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col">
                    <p className="text-gray-700 mb-4 leading-relaxed">{selected.body}</p>

                    <div className="mt-auto flex items-center gap-3">
                      <ActionButton label="Resonate" icon={<Waves className="w-5 h-5"/>} />
                      <ActionButton label="Grow" icon={<Sprout className="w-5 h-5"/>} />
                      <ActionButton label="Glow" icon={<Sparkles className="w-5 h-5"/>} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Radial Peek (ambient non-interactive preview) */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">🔮 Radial Energy Peek</h2>
        <p className="text-sm text-gray-600 mb-4">Non-linear discovery cue. Items orbit to hint at alternative navigation.</p>
        <div className="relative h-56 rounded-3xl bg-gradient-to-b from-white to-green-50 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] font-medium">You</div>
          {[Waves, Sprout, Sparkles].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[var(--brand)]"
              initial={{ rotate: i * 120 }}
              animate={{ rotate: i * 120 + 360 }}
              transition={{ duration: 28 - i * 3, repeat: Infinity, ease: "linear" }}
              style={{ left: "50%", top: "50%", transformOrigin: `${70 + i * 26}px 0px` }}
            >
              <Icon size={18} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- Helper components --- */
function FilterPill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1 rounded-full text-sm border transition",
        active
          ? "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/30"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ActionButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  const [active, setActive] = React.useState(false);
  const [count, setCount] = React.useState(() => Math.floor(Math.random() * 40));
  return (
    <button
      onClick={() => { setActive((v) => !v); setCount((c) => c + (active ? -1 : 1)); }}
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition",
        active ? "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/30" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
      <span className="tabular-nums text-gray-500">{count}</span>
    </button>
  );
}

function Reaction({ kind, count }: { kind: "resonate" | "grow" | "glow"; count: number }) {
  const Icon = kind === "resonate" ? Waves : kind === "grow" ? Sprout : Sparkles;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
      <Icon className="w-4 h-4 text-[var(--brand)]" />
      {count}
    </span>
  );
}


/* --- Mock Data --- */
export type Post = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  type: "image" | "text";
  src?: string;
  tags: string[];
  counts: { resonate: number; grow: number; glow: number };
  time: string;
  audio?: { title: string };
};

const VIBE_TAGS = ["Calm", "Hype", "Nostalgic", "Focus", "Warmth"] as const;

const POSTS: Post[] = [
  {
    id: "p1",
    title: "Morning Sunlight",
    subtitle: "Soft light through the blinds — slow, intentional start.",
    body: "Starting slow. Breathing before speaking. Letting the room fill with warmth before the day asks for anything.",
    type: "image",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    tags: ["Calm", "Warmth"],
    counts: { resonate: 24, grow: 6, glow: 3 },
    time: "2h",
    audio: { title: "Ambient Dawn" },
  },
  {
    id: "p2",
    title: "Studio Session",
    subtitle: "Looping a chord until it feels like breath.",
    body: "Creativity as repetition — we circle an idea until it stops resisting and starts resonating.",
    type: "image",
    src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    tags: ["Focus"],
    counts: { resonate: 11, grow: 4, glow: 1 },
    time: "5h",
    audio: { title: "Lo-fi Drift" },
  },
  {
    id: "p3",
    title: "Neighborhood Walk",
    subtitle: "Old oak trees and familiar corners.",
    body: "When the pace is gentle, the mind starts telling the truth again.",
    type: "image",
    src: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1200&auto=format&fit=crop",
    tags: ["Nostalgic", "Calm"],
    counts: { resonate: 40, grow: 9, glow: 7 },
    time: "1d",
  },
  {
    id: "p4",
    title: "Block Party Flyers",
    subtitle: "Stacking color until it pops.",
    body: "Some energies aren’t meant to be subtle — they’re meant to gather people in the street.",
    type: "image",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    tags: ["Hype", "Warmth"],
    counts: { resonate: 15, grow: 3, glow: 12 },
    time: "2d",
  },
  {
    id: "p5",
    title: "Reading Nook",
    subtitle: "Silence that feels like a friend.",
    body: "The best rooms are the ones that don’t ask you to perform.",
    type: "image",
    src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
    tags: ["Calm", "Focus"],
    counts: { resonate: 18, grow: 5, glow: 2 },
    time: "3d",
  },
];
