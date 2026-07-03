import React from 'react';
import { motion } from 'framer-motion';

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 1.6,
    repeat: Infinity,
    ease: 'linear',
  },
};

const SkeletonCard = () => {
  return (
    <div className="relative flex flex-col h-full rounded-2xl overflow-hidden bg-gaming-surface border border-white/5">
      {/* Image area */}
      <motion.div
        className="h-64 w-full"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
          backgroundSize: '400% 100%',
        }}
        animate={shimmer.animate}
        transition={shimmer.transition}
      />

      {/* Content area */}
      <div className="p-6 flex flex-col gap-3 flex-grow">
        {/* Brand line */}
        <motion.div
          className="h-2.5 w-16 rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
            backgroundSize: '400% 100%',
          }}
          animate={shimmer.animate}
          transition={shimmer.transition}
        />
        {/* Title line 1 */}
        <motion.div
          className="h-4 w-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
            backgroundSize: '400% 100%',
          }}
          animate={shimmer.animate}
          transition={{ ...shimmer.transition, delay: 0.1 }}
        />
        {/* Title line 2 */}
        <motion.div
          className="h-4 w-3/4 rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
            backgroundSize: '400% 100%',
          }}
          animate={shimmer.animate}
          transition={{ ...shimmer.transition, delay: 0.15 }}
        />
        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="h-3.5 w-3.5 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
                backgroundSize: '400% 100%',
              }}
              animate={shimmer.animate}
              transition={{ ...shimmer.transition, delay: i * 0.05 }}
            />
          ))}
        </div>
        {/* Price row */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
          <motion.div
            className="h-6 w-28 rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
              backgroundSize: '400% 100%',
            }}
            animate={shimmer.animate}
            transition={{ ...shimmer.transition, delay: 0.2 }}
          />
          <motion.div
            className="h-10 w-10 rounded-xl"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
              backgroundSize: '400% 100%',
            }}
            animate={shimmer.animate}
            transition={{ ...shimmer.transition, delay: 0.25 }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
