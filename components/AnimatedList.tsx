'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedListProps {
  children: React.ReactNode
  staggerMs?: number
  className?: string
}

const itemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
}

export function AnimatedList({ children, staggerMs = 35, className }: AnimatedListProps) {
  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: staggerMs / 1000 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {React.Children.map(children, (child) =>
        child != null ? (
          <motion.div variants={itemVariants}>{child}</motion.div>
        ) : null
      )}
    </motion.div>
  )
}
