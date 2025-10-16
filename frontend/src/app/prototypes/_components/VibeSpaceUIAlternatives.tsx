'use client';

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/src/app/components/ui/Card";
import { Waves, Sprout, Sparkles } from "lucide-react";

export default function VibeSpaceUIAlternatives() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Moodboard Style */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">🌿 Moodboard UI</h2>
          <p className="text-gray-600 mb-4">
            Posts appear as cards that can be arranged into collections. Feels more
            like curating a board than scrolling a feed.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-green-100 rounded-xl h-20 flex items-center justify-center text-[var(--brand)] font-bold"
              >
                Vibe {i + 1}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Radial Energy Map */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">🔮 Radial Energy Map</h2>
          <p className="text-gray-600 mb-4">
            Posts radiate around a center point. Closer = stronger resonance with
            your vibe.
          </p>
          <div className="relative w-full h-64 flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              You
            </div>
            {[Waves, Sprout, Sparkles].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[var(--brand)]"
                initial={{ rotate: i * 120 }}
                animate={{ rotate: i * 120 + 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 0px" }}
              >
                <Icon size={20} />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time-Windowed Feed */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">🕊 Time-Windowed Feed</h2>
          <p className="text-gray-600 mb-4">
            Content is grouped into daily or weekly chapters instead of infinite
            scrolling.
          </p>
          <div className="space-y-2">
            {["Monday", "Tuesday", "Wednesday"].map((day, i) => (
              <div
                key={i}
                className="bg-green-50 rounded-xl p-3 border border-green-100"
              >
                <p className="font-medium text-[var(--brand)]">{day}</p>
                <p className="text-sm text-gray-600">3 new vibes posted</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotion/Reaction Selector */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-3">🎨 Energy Reactions</h2>
          <p className="text-gray-600 mb-4">
            Instead of likes, people tag posts with vibes: Calm 🌿, Hype 🔥,
            Nostalgic 🌙.
          </p>
          <div className="flex gap-3">
            {['🌿 Calm', '🔥 Hype', '🌙 Nostalgic'].map((vibe, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-full bg-green-100 text-[var(--brand)] font-medium shadow-sm hover:bg-green-200"
              >
                {vibe}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
