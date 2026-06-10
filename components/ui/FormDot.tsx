'use client'

import { useEffect } from 'react'
import { motion, animate, useMotionValue, useReducedMotion } from 'framer-motion'

interface FormDotProps {
  result: 'W' | 'D' | 'L'
  index?: number
}

const dotStyles = { W: 'bg-win', D: 'bg-draw', L: 'bg-loss' }
const labels    = { W: 'Win',   D: 'Draw',   L: 'Loss'   }

// Animates via MotionValues + standalone animate() — bypasses AnimatePresence
// initial={false} context which would suppress normal initial→animate transitions.
function AnimatedDot({
  className,
  index,
  ariaLabel,
  title,
}: {
  className: string
  index: number
  ariaLabel?: string
  title?: string
}) {
  const scale   = useMotionValue(0)
  const opacity = useMotionValue(0)

  useEffect(() => {
    const s = animate(scale,   1, { type: 'spring', stiffness: 500, damping: 25, delay: index * 0.06 })
    const o = animate(opacity, 1, { duration: 0.15, delay: index * 0.06 })
    return () => { s.stop(); o.stop() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.span
      style={{ scale, opacity }}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      title={title}
    />
  )
}

export function FormDot({ result, index = 0 }: FormDotProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <span
        className={`inline-block size-2.5 rounded-full ${dotStyles[result]}`}
        title={labels[result]}
        aria-label={labels[result]}
      />
    )
  }

  return (
    <AnimatedDot
      className={`inline-block size-2.5 rounded-full ${dotStyles[result]}`}
      index={index}
      ariaLabel={labels[result]}
      title={labels[result]}
    />
  )
}

interface FormStripProps {
  form: ('W' | 'D' | 'L')[]
}

export function FormStrip({ form }: FormStripProps) {
  const shouldReduceMotion = useReducedMotion()

  const padded: (('W' | 'D' | 'L') | null)[] = [
    ...Array(Math.max(0, 5 - form.length)).fill(null),
    ...form.slice(-5),
  ]

  return (
    <span className="flex items-center gap-1" aria-label={`Form: ${form.join(' ')}`}>
      {padded.map((r, i) =>
        r ? (
          <FormDot key={i} result={r} index={i} />
        ) : shouldReduceMotion ? (
          <span key={i} className="inline-block size-2.5 rounded-full bg-border" aria-hidden />
        ) : (
          <AnimatedDot
            key={i}
            className="inline-block size-2.5 rounded-full bg-border"
            index={i}
          />
        )
      )}
    </span>
  )
}
