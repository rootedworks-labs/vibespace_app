"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, Sprout, Sparkles, Music2, ArrowLeft, Filter, X } from "lucide-react";

// Radial-first navigation prototype for VibeSpace
// - Primary nav = orbiting clusters around the user (center)
// - Click a node to open its collection panel (right)
// - Panel lists posts; click a post to open modal
// - Includes vibe filters and reactions
// Requirements: framer-motion, lucide-react, TailwindCSS

export default function VibeRadialPrototype() {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [activeCluster, setActiveCluster] = React.useState<Cluster | null>(CLUSTERS[0]);
  const [selected, setSelected] = React.useState<Post | null>(null);

  const posts = React.useMemo(() => {
    const base = activeCluster ? activeCluster.posts : [];
    return activeTag ? base.filter((p) => p.tags.includes(activeTag)) : base;
  }, [activeCluster, activeTag]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      {/* Left: Radial Map */}
      <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-4 xl:p-8 relative overflow-hidden">
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">🔮 VibeSpace — Radial Navigation</h1>
          <div className="flex items-center gap-2 text-[var(--brand)]"><Waves/><Sprout/><Sparkles/></div>
        </header>
        <p className="text-sm text-gray-600 mb-4">Non-linear discovery: clusters orbit your center. Choose a cluster to explore matching posts.</p>

        <div className="relative h-[520px] rounded-2xl bg-gradient-to-b from-white to-green-50">
          {/* Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] font-medium border border-[var(--brand)]/20">You</div>

          {/* Orbiting clusters */}
          {CLUSTERS.map((cluster, i) => (
            <OrbitingNode
              key={cluster.id}
              index={i}
              icon={cluster.icon}
              label={cluster.label}
              colorClass={cluster.colorClass}
              onClick={() => setActiveCluster(cluster)}
              active={activeCluster?.id === cluster.id}
            />
          ))}
        </div>

        {/* Filters below map (mobile/desktop) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 text-gray-700"><Filter size={16}/> Filter by vibe:</span>
          <FilterPill label="All" active={!activeTag} onClick={() => setActiveTag(null)} />
          {VIBE_TAGS.map((t) => (
            <FilterPill key={t} label={t} active={activeTag === t} onClick={() => setActiveTag(t)} />
          ))}
        </div>
      </section>

      {/* Right: Cluster Panel */}
      <aside className="rounded-3xl bg-white border border-gray-100 shadow-sm p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <button
            onClick={() => setActiveCluster(null)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Back"
          >
            <ArrowLeft />
          </button>
          <div>
            <p className="text-xs text-gray-500">Cluster</p>
            <h2 className="text-lg font-semibold">{activeCluster?.label ?? "—"}</h2>
          </div>
        </div>

        <div className="max-h-[calc(100vh-220px)] overflow-auto p-4 space-y-3">
          {(posts.length === 0) && (
            <div className="text-sm text-gray-500">No posts match this vibe filter.</div>
          )}
          {posts.map((post) => (
            <button
              key={post.id}
              className="w-full text-left rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition overflow-hidden shadow-sm"
              onClick={() => setSelected(post)}
            >
              <div className="flex gap-3 p-3">
                <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {post.type === "image" && (
                    <img src={post.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.subtitle}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[var(--brand)]/90">
                      <Reaction kind="resonate" count={post.counts.resonate} />
                      <Reaction kind="grow" count={post.counts.grow} />
                      <Reaction kind="glow" count={post.counts.glow} />
                    </div>
                    <span className="text-xs text-gray-500">{post.time}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Post Modal */}
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
    </div>
  );
}

/* -------------------- Orbiting Node -------------------- */
function OrbitingNode({
  index,
  icon: Icon,
  label,
  onClick,
  active,
  colorClass,
}: {
  index: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  colorClass: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const radius = 110 + index * 46; // distance from center
  return (
    <motion.button
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md border text-sm flex items-center gap-2 px-3 py-2 bg-white ${active ? "ring-2 ring-[var(--brand)]" : ""}`}
      initial={{ rotate: index * 120 }}
      animate={{ rotate: index * 120 + 360 }}
      transition={{ duration: 26 - index * 3, repeat: Infinity, ease: "linear" }}
      style={{ left: "50%", top: "50%", transformOrigin: `${radius}px 0px` }}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon size={18} />
      </span>
      <span className="hidden sm:block font-medium text-gray-800">{label}</span>
    </motion.button>
  );
}

/* -------------------- Small UI Bits -------------------- */
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

function Reaction({ kind, count }: { kind: "resonate" | "grow" | "glow"; count: number }) {
  const Icon = kind === "resonate" ? Waves : kind === "grow" ? Sprout : Sparkles;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
      <Icon className="w-4 h-4 text-[var(--brand)]" />
      {count}
    </span>
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

/* -------------------- Mock Data -------------------- */
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

export type Cluster = {
  id: string;
  label: string;
  colorClass: string; // tailwind bg utility for the icon
  icon: React.ComponentType<{ size?: number; className?: string }>;
  posts: Post[];
};

const VIBE_TAGS = ["Calm", "Hype", "Nostalgic", "Focus", "Warmth"] as const;

const commonPosts: Post[] = [
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

const CLUSTERS: Cluster[] = [
  {
    id: "c1",
    label: "Calm & Warmth",
    colorClass: "bg-emerald-100 text-[var(--brand)]",
    icon: Sprout,
    posts: commonPosts,
  },
  {
    id: "c2",
    label: "Focus Flow",
    colorClass: "bg-emerald-100 text-[var(--brand)]",
    icon: Waves,
    posts: [...commonPosts].reverse(),
  },
  {
    id: "c3",
    label: "Glow & Hype",
    colorClass: "bg-emerald-100 text-[var(--brand)]",
    icon: Sparkles,
    posts: commonPosts.slice(0, 4),
  },
];
