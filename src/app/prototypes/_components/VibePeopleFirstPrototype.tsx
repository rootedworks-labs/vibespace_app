"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Smile, Sparkles } from "lucide-react";

// VibeSpace People-First Prototypes
// Includes: Presence-First Home, Ritual Card, and Circles view

export default function VibePeopleFirstPrototype() {
  const [ritualResponse, setRitualResponse] = React.useState("");

  const peopleNow = [
    { id: 1, name: "Amina", status: "☕ Open to chat" },
    { id: 2, name: "Luis", status: "🎧 In focus" },
    { id: 3, name: "Kai", status: "🌿 Taking a break" },
    { id: 4, name: "Sofia", status: "💡 Brainstorming" },
  ];

  const circles = [
    { id: 1, name: "Study Buddies", members: 12, vibe: "Focus" },
    { id: 2, name: "Weekend Walkers", members: 8, vibe: "Calm" },
    { id: 3, name: "Neighborhood Creators", members: 15, vibe: "Hype" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6 space-y-8">
      {/* Presence First Home */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users size={18}/> Who’s Around
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {peopleNow.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.05 }}
              className="shrink-0 w-28 rounded-2xl bg-white border border-gray-100 shadow-sm p-3 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/20 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">{p.name}</p>
              <p className="text-xs text-gray-500">{p.status}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ritual Card */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Smile size={18}/> Daily Ritual
        </h2>
        <motion.div
          initial={{opacity:0, y:10}}
          animate={{opacity:1, y:0}}
          className="rounded-2xl bg-white border border-gray-100 shadow p-4 max-w-lg mx-auto"
        >
          <p className="text-gray-700 mb-3">Today I’m feeling…</p>
          <input
            type="text"
            value={ritualResponse}
            onChange={(e) => setRitualResponse(e.target.value)}
            placeholder="Add your one-liner"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 mb-3"
          />
          <button
            className="px-4 py-2 rounded-full bg-[var(--brand)] text-white font-medium hover:opacity-90"
            onClick={() => alert(`Submitted: ${ritualResponse}`)}
          >
            Share
          </button>
        </motion.div>
      </section>

      {/* Circles */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Sparkles size={18}/> My Circles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {circles.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ y:-2 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4"
            >
              <h3 className="font-medium text-gray-900 mb-1">{c.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{c.members} members</p>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">{c.vibe}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
