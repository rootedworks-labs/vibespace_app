'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VibeCard } from '@/src/app/components/prototypes/VibeCard';

interface Post {
  id: number;
  author: string;
  content: string;
  timeWindow: 'Morning' | 'Afternoon' | 'Evening';
  vibeCounts: {
    flow?: number;
    joy?: number;
    hype?: number;
    love?: number;
    glam?: number;
  };
}

export function VibeDeck({ posts }: { posts: Post[] }) {
  const [index, setIndex] = React.useState(0);
  const post = posts[index];

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  return (
    <div className="relative h-96">
      <AnimatePresence>
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(event, info) => {
            if (info.offset.x < -100) {
              handleNext();
            }
          }}
        >
          <VibeCard {...post} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}